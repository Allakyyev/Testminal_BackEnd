import { CharacterStyle } from '../../../../core/model/character/character-style';
import { CharacterFormattingScript, CharacterPropertiesMask, StrikeoutType, UnderlineType } from '../../../../core/model/character/enums';
import { ColorHelper } from '../../../../core/model/color/color';
import { DXColor } from '../../../../core/model/color/dx-color';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { WordProcessingMLValue } from '../../../translation-table/word-processing-mlvalue';
import { WriterHelper } from '../../utils/writer-helper';
import { BaseExporter } from '../base';
export class CharacterPropertiesExporter extends BaseExporter {
    get colorProvider() { return this.data.model.colorProvider; }
    static convertScript(script) {
        switch (script) {
            case CharacterFormattingScript.Subscript: return 'subscript';
            case CharacterFormattingScript.Superscript: return 'superscript';
            default:
            case CharacterFormattingScript.Normal: return 'baseline';
        }
    }
    exportRunPropertiesCore(props) {
        this.fontName(props);
        this.bold(props);
        this.italic(props);
        this.allCaps(props);
        this.smallCaps(props);
        this.strikeout(props);
        this.noProof(props);
        this.hidden(props);
        this.foreColor(props);
        this.doubleFontSize(props);
        this.fontUnderline(props);
        this.backColor(props);
        this.fontScript(props);
        this.rightToLeft(props);
        this.langInfo(props);
    }
    exportStyleCharacterProperties(props) {
        this.writer.writeWpStartElement('rPr');
        this.exportRunPropertiesCore(props);
        this.writer.endElement();
    }
    exportRunProperties(run) {
        if (this.shouldExportRunProperties(run)) {
            this.writer.writeWpStartElement('rPr');
            if (run.characterStyle.styleName != CharacterStyle.defaultParagraphCharacterStyleName)
                this.writer.writeWpStringValue('rStyle', this.data.charStyleExporter.getStyleId(this.data.model.stylesManager.characterStyleNameToIndex[run.characterStyle.styleName]));
            this.exportRunPropertiesCore(run.maskedCharacterProperties);
            this.writer.endElement();
        }
    }
    shouldExportRunProperties(run) {
        const props = run.maskedCharacterProperties;
        return props.getUseValue(CharacterPropertiesMask.UseFontName) ||
            props.getUseValue(CharacterPropertiesMask.UseDoubleFontSize) ||
            props.getUseValue(CharacterPropertiesMask.UseFontBold) ||
            props.getUseValue(CharacterPropertiesMask.UseFontItalic) ||
            props.getUseValue(CharacterPropertiesMask.UseFontUnderlineType) ||
            props.getUseValue(CharacterPropertiesMask.UseUnderlineWordsOnly) ||
            props.getUseValue(CharacterPropertiesMask.UseFontStrikeoutType) ||
            props.getUseValue(CharacterPropertiesMask.UseAllCaps) ||
            props.getUseValue(CharacterPropertiesMask.UseSmallCaps) ||
            props.getUseValue(CharacterPropertiesMask.UseForeColorIndex) ||
            props.getUseValue(CharacterPropertiesMask.UseShadingInfoIndex) ||
            props.getUseValue(CharacterPropertiesMask.UseHighlightColorIndex) ||
            (props.getUseValue(CharacterPropertiesMask.UseUnderlineColorIndex) &&
                !DXColor.isTransparentOrEmpty(props.underlineColor.toRgb(this.colorProvider))) ||
            props.getUseValue(CharacterPropertiesMask.UseScript) ||
            props.getUseValue(CharacterPropertiesMask.UseHidden) ||
            props.getUseValue(CharacterPropertiesMask.UseLangInfo) ||
            props.getUseValue(CharacterPropertiesMask.UseRightToLeft) ||
            props.getUseValue(CharacterPropertiesMask.UseNoProof) ||
            run.characterStyle.styleName != CharacterStyle.defaultParagraphCharacterStyleName;
    }
    fontName(props) {
        if (!props.getUseValue(CharacterPropertiesMask.UseFontName) || !props.fontInfo)
            return;
        this.writer.writeWpStartElement('rFonts');
        const fontName = props.fontInfo.name;
        this.writer.writeWpStringAttr('ascii', fontName);
        this.writer.writeWpStringAttr(new WordProcessingMLValue('hAnsi').openXmlValue, fontName);
        this.writer.endElement();
    }
    bold(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseFontBold))
            this.writer.writeWpBoolValue('b', props.fontBold);
    }
    italic(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseFontItalic))
            this.writer.writeWpBoolValue('i', props.fontItalic);
    }
    allCaps(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseAllCaps))
            this.writer.writeWpBoolValue('caps', props.allCaps);
    }
    smallCaps(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseSmallCaps))
            this.writer.writeWpBoolValue('smallCaps', props.smallCaps);
    }
    strikeout(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseFontStrikeoutType)) {
            switch (props.fontStrikeoutType) {
                case StrikeoutType.Double:
                    this.writer.writeWpBoolValue('dstrike', true);
                    break;
                case StrikeoutType.None:
                    this.writer.writeWpBoolValue('strike', false);
                    break;
                default:
                    this.writer.writeWpBoolValue('strike', true);
                    break;
            }
        }
    }
    noProof(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseNoProof)) {
            this.writer.writeWpStartElement('noProof');
            this.writer.writeWpBoolAttr('val', props.noProof);
            this.writer.endElement();
        }
    }
    hidden(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseHidden))
            this.writer.writeWpBoolValue('vanish', props.hidden);
    }
    doubleFontSize(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseDoubleFontSize))
            this.writer.writeWpIntValue('sz', props.fontSize * 2);
    }
    fontScript(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseScript))
            this.writer.writeWpStringValue('vertAlign', CharacterPropertiesExporter.convertScript(props.script));
    }
    rightToLeft(_props) {
    }
    langInfo(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseLangInfo)) {
            this.writer.writeWpStartElement('lang');
            if (props.langInfo.latin)
                this.writer.writeWpStringAttr('val', props.langInfo.latin);
            if (props.langInfo.bidi)
                this.writer.writeWpStringAttr('bidi', props.langInfo.bidi);
            if (props.langInfo.eastAsia)
                this.writer.writeWpStringAttr('eastAsia', props.langInfo.eastAsia);
            this.writer.endElement();
        }
    }
    fontUnderline(props) {
        const useUnderlineType = props.getUseValue(CharacterPropertiesMask.UseFontUnderlineType);
        const useUnderlineWordsOnly = props.getUseValue(CharacterPropertiesMask.UseUnderlineWordsOnly);
        const useUnderlineColorIndex = props.getUseValue(CharacterPropertiesMask.UseUnderlineColorIndex);
        const underlineColor = useUnderlineColorIndex ? props.underlineColor.toRgb(this.colorProvider) : null;
        if (useUnderlineType || useUnderlineWordsOnly ||
            (useUnderlineColorIndex && !DXColor.isTransparentOrEmpty(underlineColor))) {
            this.writer.writeWpStartElement('u');
            if (useUnderlineWordsOnly && props.underlineWordsOnly &&
                useUnderlineType && props.fontUnderlineType == UnderlineType.Single)
                this.writer.writeWpStringAttr('val', 'words');
            else if (useUnderlineType)
                this.writer.writeWpStringAttr('val', WriterHelper.getValueFromTables(TranslationTables.underlineTables, props.fontUnderlineType, UnderlineType.Single));
            if (useUnderlineColorIndex && !DXColor.isTransparentOrEmpty(underlineColor))
                this.data.colorExporter.exportColorInfo(props.underlineColor, 'color', false);
            this.writer.endElement();
        }
    }
    backColor(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseHighlightColorIndex)) {
            const highlightColor = props.highlightColor.toRgb(this.colorProvider);
            if (!DXColor.isTransparentOrEmpty(highlightColor) && highlightColor != ColorHelper.NO_COLOR)
                this.writer.writeWpStringValue('highlight', this.data.colorExporter.convertHighlightColorToString(props.highlightColor.toRgb(this.colorProvider)));
        }
        if (props.getUseValue(CharacterPropertiesMask.UseShadingInfoIndex) &&
            (props.shadingInfo.getActualColor(this.colorProvider) != ColorHelper.NO_COLOR))
            this.data.colorExporter.exportShadingCore(props.shadingInfo, true);
    }
    foreColor(props) {
        if (props.getUseValue(CharacterPropertiesMask.UseForeColorIndex)) {
            this.writer.writeWpStartElement('color');
            this.data.colorExporter.exportColorInfo(props.textColor, 'val', true);
            this.writer.endElement();
        }
    }
}
