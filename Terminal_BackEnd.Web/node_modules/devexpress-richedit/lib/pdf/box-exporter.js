import { LayoutAnchoredPictureBox } from '../core/layout/main-structures/layout-boxes/layout-anchored-picture-box';
import { LayoutPictureBox } from '../core/layout/main-structures/layout-boxes/layout-picture-box';
import { MeasureInfoText } from '../core/measurer/measure-info';
import { CharacterFormattingScript } from '../core/model/character/enums';
import { LayoutFontsCollector, LayoutFontsCollectorElement } from '../core/model/fonts/grabber';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Constants } from '@devexpress/utils/lib/constants';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { SparseIntervalsMapCollector } from '@devexpress/utils/lib/intervals/sparse/map-collector';
import { PdfCharacterPropertiesExporter } from './character-properties-exporter';
export class PdfBoxExporter {
    constructor(doc, textFontMapCache, measurer) {
        this.doc = doc;
        this.textFontMapCache = textFontMapCache;
        this.characterPropertiesExporter = new PdfCharacterPropertiesExporter();
        this.measurer = measurer;
    }
    export(row, box, boxIndex, rowOffset, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline) {
        const boxY = box.getTop(row);
        const pos = Point.plus(rowOffset, new Point(box.x ? box.x : 0, boxY ? boxY : 0)).applyConverter(UnitConverter.pixelsToPointsF);
        const size = box.createSize().applyConverter(UnitConverter.pixelsToPointsF);
        if ((box instanceof LayoutPictureBox || box instanceof LayoutAnchoredPictureBox) && box.cacheInfo.isPdfCompatible()) {
            const base64 = box.cacheInfo.pdfCompatibleBase64;
            this.doc.image(base64, pos.x, pos.y, { width: size.width, height: size.height });
        }
        else {
            this.exportText(pos, size, LayoutFontsCollector.boxContent(box), box, boxIndex, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline);
        }
    }
    getTextPosition(box, baseLine, pos) {
        const cp = box.characterProperties;
        const fontSize = cp.fontSize;
        const script = cp.script;
        let offsetY = 0;
        if (script == CharacterFormattingScript.Normal)
            offsetY = box.getAscent() - UnitConverter.pointsToPixels(baseLine * fontSize);
        else if (script == CharacterFormattingScript.Subscript)
            offsetY = cp.fontSize * (1 - cp.fontInfo.scriptMultiplier);
        return new Point(pos.x, pos.y + offsetY);
    }
    createTextProperties(charProps, needUnderlineAndStrikeout, baseLine) {
        const textOptions = {};
        textOptions.lineGap = 0;
        if (needUnderlineAndStrikeout && charProps.fontUnderlineType)
            textOptions.underline = true;
        if (needUnderlineAndStrikeout && charProps.fontStrikeoutType)
            textOptions.strike = true;
        textOptions.baseline = -1 * charProps.fontSize * baseLine;
        textOptions.lineBreak = false;
        textOptions.width = Constants.MAX_SAFE_INTEGER;
        return textOptions;
    }
    exportText(pos, size, text, box, boxIndex, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline) {
        const needUnderlineAndStrikeout = boxIndex <= lastBoxIndexWhatCanStrikeoutAndUnderline;
        const it = this.separateTextByFont(text, box.characterProperties);
        while (it.moveToNextInterval()) {
            const font = it.object;
            const currText = text.slice(it.interval.start, it.interval.end);
            if (it.numIntervals > 1) {
                const measureInfo = new MeasureInfoText(currText, box.characterProperties);
                this.measurer.measure([measureInfo]);
                if (it.intervalIndex > 0)
                    pos.x += size.width;
                size = measureInfo.resultSize.applyConverter(UnitConverter.pixelsToPointsF);
            }
            if (font) {
                const cp = box.characterProperties;
                const fontSize = cp.script == CharacterFormattingScript.Normal ? cp.fontSize : cp.fontSize * cp.fontInfo.scriptMultiplier;
                this.doc.font(font.cacheKey, undefined, fontSize);
                const textOptions = this.createTextProperties(cp, needUnderlineAndStrikeout, baseLine);
                this.characterPropertiesExporter.exportCharacterProperties(this.doc, box, pos, size, needUnderlineAndStrikeout);
                const textPos = this.getTextPosition(box, baseLine, pos);
                this.doc.text(currText, textPos.x, textPos.y, textOptions);
            }
            else {
                this.doc.rect(pos.x, pos.y, size.width, size.height).stroke();
            }
        }
    }
    separateTextByFont(text, charProps) {
        const textLen = text.length;
        const collElem = this.textFontMapCache.getItem(new LayoutFontsCollectorElement(charProps));
        const collector = new SparseIntervalsMapCollector((a, b) => a == b ? 0 : 1, new BoundaryInterval(0, 0));
        for (let i = 0; i < textLen; i++)
            collector.add(i, collElem.getFont(text[i]));
        return collector.getIterator();
    }
}
