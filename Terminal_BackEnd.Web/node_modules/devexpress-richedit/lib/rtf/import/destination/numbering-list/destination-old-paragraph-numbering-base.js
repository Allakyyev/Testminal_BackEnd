import { StrikeoutType, UnderlineType } from '../../../../core/model/character/enums';
import { ListNumberAlignment, NumberingFormat } from '../../../../core/model/numbering-lists/list-level-properties';
import { ParagraphFirstLineIndent } from '../../../../core/model/paragraph/paragraph-properties';
import { ShadingInfo } from '../../../../core/model/shadings/shading-info';
import { DestinationBase } from '../base/destination';
import { TextAfterDestination } from '../base/text-after-destination';
import { TextBeforeDestination } from '../base/text-before-destination';
import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
export class DestinationOldParagraphNumberingBase extends DestinationBase {
    get destinationType() { return DestinationType.DestinationOldParagraphNumberingBase; }
    get controlCharHT() { return null; }
    static setNumberingListFormat(importer, format) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.format = format;
    }
    static setUnderlineType(importer, underlineType) {
        importer.importers.character.characterFormatting.coreProperties.fontUnderlineType = underlineType;
    }
    static onCardinalKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.CardinalText);
    }
    static onDecimalKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.Decimal);
    }
    static onUpperCaseAlphabeticalKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.UpperLetter);
    }
    static onUpperCaseRomanKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.UpperRoman);
    }
    static onLowerCaseAlphabeticalKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.LowerLetter);
    }
    static onLowerCaseRomanKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.LowerRoman);
    }
    static onOrdinalKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.Ordinal);
    }
    static onOrdinalTextKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.OrdinalText);
    }
    static onNumberingInCircleKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setNumberingListFormat(importer, NumberingFormat.DecimalEnclosedCircle);
    }
    static onDashedUndrelineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.Dashed);
    }
    static onDashDottedUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.DashDotted);
    }
    static onDashDotDottedUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.DashDotDotted);
    }
    static onHairlineUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.ThickSingle);
    }
    static onThickUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.ThickSingle);
    }
    static onWaveUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.Wave);
    }
    static onDottedUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.Dotted);
    }
    static onDoubleUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.Double);
    }
    static onNoneUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        DestinationOldParagraphNumberingBase.setUnderlineType(importer, UnderlineType.None);
    }
    static onContinuousUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.character.characterFormatting.coreProperties.underlineWordsOnly = false;
    }
    static onWordUnderlineKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.character.characterFormatting.coreProperties.underlineWordsOnly = true;
    }
    static onFontNumberKeyword(importer, parameterValue, hasParameter) {
        const fontImporter = importer.importers.font;
        if (!hasParameter)
            parameterValue = fontImporter.defaultFontNumber;
        fontImporter.setFont(fontImporter.fonts.getRtfFontInfoById(parameterValue));
    }
    static onFontBoldKeyword(importer, parameterValue, hasParameter) {
        const val = hasParameter ? parameterValue != 0 : true;
        importer.importers.character.characterFormatting.coreProperties.fontBold = val;
    }
    static onItalicKeyword(importer, parameterValue, hasParameter) {
        const val = hasParameter ? parameterValue != 0 : true;
        importer.importers.character.characterFormatting.coreProperties.fontItalic = val;
    }
    static onAllCapsKeyword(importer, parameterValue, hasParameter) {
        const val = hasParameter ? parameterValue != 0 : true;
        importer.importers.character.characterFormatting.coreProperties.allCaps = val;
    }
    static onSmallCapsKeyword(importer, parameterValue, hasParameter) {
        const val = hasParameter ? parameterValue != 0 : true;
        importer.importers.character.characterFormatting.coreProperties.smallCaps = !val;
    }
    static onStrikeKeyword(importer, parameterValue, hasParameter) {
        const val = hasParameter ? parameterValue != 0 : true;
        importer.importers.character.characterFormatting.coreProperties.fontStrikeoutType = val ? StrikeoutType.Single : StrikeoutType.None;
    }
    static onForegroundColorKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 0;
        const oldSh = importer.importers.character.characterFormatting.coreProperties.shadingInfo;
        importer.importers.character.characterFormatting.coreProperties.shadingInfo = new ShadingInfo(oldSh.shadingPattern, oldSh.backColor, DestinationSubDocument.getColorIndex(importer, parameterValue));
    }
    static onIndentKeyword(importer, parameterValue, _hasParameter) {
        const info = importer.importers.paragraph.paragraphFormatting;
        if (parameterValue < 0) {
            info.coreProperties.firstLineIndent = -parameterValue;
            info.coreProperties.firstLineIndentType = ParagraphFirstLineIndent.Hanging;
        }
        else {
            info.coreProperties.firstLineIndent = parameterValue;
            info.coreProperties.firstLineIndentType = ParagraphFirstLineIndent.Indented;
        }
    }
    static onSpaceKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onUsePrevKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.includeInformationFromPreviousLevel = true;
    }
    static onStartAtKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.start = parameterValue;
    }
    static onHangingIndentKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.coreProperties.firstLineIndentType = ParagraphFirstLineIndent.Hanging;
    }
    static onRestartOnSectionBreakKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onCenterAlignmentKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.alignment = ListNumberAlignment.Center;
    }
    static onLeftAlignmentKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.alignment = ListNumberAlignment.Left;
    }
    static onRightAlignmentKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.numbering.oldListLevelInfo.listLevelProperties.alignment = ListNumberAlignment.Right;
    }
    static onTextBeforeKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new TextBeforeDestination(importer);
    }
    static onTextAfterKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new TextAfterDestination(importer);
    }
    nestedGroupFinished(nestedDestination) {
        super.nestedGroupFinished(nestedDestination);
        if (nestedDestination instanceof TextBeforeDestination) {
            this.textBefore = nestedDestination.value;
            return;
        }
        if (nestedDestination instanceof TextAfterDestination) {
            this.textAfter = nestedDestination.value;
            return;
        }
    }
    beforePopRtfState() {
        super.beforePopRtfState();
        this.importer.importers.numbering.oldListLevelInfo.textAfter = this.textAfter;
        this.importer.importers.numbering.oldListLevelInfo.textBefore = this.textBefore;
    }
}
