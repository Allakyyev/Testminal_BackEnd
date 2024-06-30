import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { RtfDrawingKeywords } from '../../translation-table/rtf-drawing-keywords';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfAnchoredRunExporter } from './rtf-anchored-run-exporter';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class RtfAnchoredTextBoxRunExporter extends RtfAnchoredRunExporter {
    constructor(rtfBuilder, textBoxRun, exportTextBoxContent) {
        super(rtfBuilder, textBoxRun.anchorInfo, textBoxRun.shape, textBoxRun.size, textBoxRun.containerProperties);
        this.textBoxRun = textBoxRun;
        this.exportTextBoxContent = exportTextBoxContent;
    }
    getWidth() {
        return this.textBoxRun.size.absoluteSize.width;
    }
    getHeight() {
        return this.textBoxRun.size.absoluteSize.height;
    }
    exportContent() {
        this.exportTextBoxProperties(this.textBoxRun.textBoxProperties);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeText);
        this.exportTextBoxContent();
        this.rtfBuilder.closeGroup();
    }
    exportTextBoxProperties(properties) {
        if (isDefined(properties.leftMargin))
            this.rtfBuilder.writeShapeIntegerProperty("dxTextLeft", UnitConverter.twipsToEmu(properties.leftMargin));
        if (isDefined(properties.rightMargin))
            this.rtfBuilder.writeShapeIntegerProperty("dxTextRight", UnitConverter.twipsToEmu(properties.rightMargin));
        if (isDefined(properties.topMargin))
            this.rtfBuilder.writeShapeIntegerProperty("dyTextTop", UnitConverter.twipsToEmu(properties.topMargin));
        if (isDefined(properties.bottomMargin))
            this.rtfBuilder.writeShapeIntegerProperty("dyTextBottom", UnitConverter.twipsToEmu(properties.bottomMargin));
        if (isDefined(properties.resizeShapeToFitText))
            this.rtfBuilder.writeShapeBoolProperty("fFitShapeToText", properties.resizeShapeToFitText);
        if (isDefined(properties.wrapText) && properties.wrapText == false)
            this.rtfBuilder.writeShapeIntegerProperty("WrapText", 2);
    }
    exportFloatingObjectRelativeSize() {
        const textBoxSize = this.textBoxRun.size;
        if (!textBoxSize.useAbsoluteWidth()) {
            this.rtfBuilder.writeShapeIntegerProperty("sizerelh", RtfDrawingKeywords.DrawingObjectRelativeWidthTypeTable[textBoxSize.relativeWidthType]);
            this.rtfBuilder.writeShapeIntegerProperty("pctHoriz", textBoxSize.relativeSize.width / 100);
        }
        if (!textBoxSize.useAbsoluteHeight()) {
            this.rtfBuilder.writeShapeIntegerProperty("sizerelv", RtfDrawingKeywords.DrawingObjectRelativeHeightTypeTable[textBoxSize.relativeHeightType]);
            this.rtfBuilder.writeShapeIntegerProperty("pctVert", textBoxSize.relativeSize.height / 100);
        }
        super.exportFloatingObjectRelativeSize();
    }
}
