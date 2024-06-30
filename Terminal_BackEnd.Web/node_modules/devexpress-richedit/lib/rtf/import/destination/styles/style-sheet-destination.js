import { ParagraphStyle } from '../../../../core/model/paragraph/paragraph-style';
import { CharacterPropertiesMerger } from '../../../../core/model/properties-merger/character-properties-merger';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RtfParagraphImporter } from '../../importers/paragraph-importer';
import { RtfDocumentModelType } from '../../rtf-import-data';
import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
import { CharacterStyleDestination } from './character-style-destination';
import { TableStyleDestination } from './table-style-destination';
export class StyleSheetDestination extends DestinationSubDocument {
    constructor(importer) {
        super(importer, importer.subDocument);
        this.styleName = "";
        importer.rtfDocumentModelType = RtfDocumentModelType.WithStyle;
    }
    get destinationType() { return DestinationType.StyleSheetDestination; }
    get controlCharHT() { return null; }
    get canAppendText() { return false; }
    static onStyleQFormatKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination.qFormat = true;
    }
    static onParagraphStyle(importer, parameterValue, _hasParameter) {
        importer.importers.style.paragraph.rtfStyleIndex = parameterValue;
    }
    static onParentStyleIndex(importer, parameterValue, _hasParameter) {
        importer.importers.style.paragraph.rtfParentStyleIndex = parameterValue;
    }
    static onStyleLinkKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.styleLink = parameterValue;
    }
    static onNextStyleIndex(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.nextStyle = parameterValue;
    }
    static onCharacterStyle(importer, parameterValue, _hasParameter) {
        importer.destination = new CharacterStyleDestination(importer, parameterValue);
    }
    static onTableStyle(importer, parameterValue, _hasParameter) {
        importer.destination = new TableStyleDestination(importer, parameterValue);
    }
    static onStyleListOverride(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.paragraphListInfo.numberingListIndex = parameterValue;
    }
    static onStyleListLevel(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.paragraphListInfo.listLevelIndex = parameterValue;
    }
    nestedGroupFinished(nestedDestination) {
        if (nestedDestination instanceof StyleSheetDestination) {
            const paragraphFormattingInfo = this.importer.importers.paragraph.paragraphFormatting;
            this.importer.importers.style.paragraph.ensureStyleExist();
            const style = this.importer.importers.style.paragraph
                .getOrCreateStyleByName(StyleSheetDestination.getPrimaryStyleName(nestedDestination.styleName));
            if (paragraphFormattingInfo.styleLink &&
                this.importer.importers.style.linkParagraphStyleIndexToCharacterStyleIndex[this.importer.importers.style.paragraph.rtfStyleIndex] === undefined)
                this.importer.importers.style.linkParagraphStyleIndexToCharacterStyleIndex[this.importer.importers.style.paragraph.rtfStyleIndex] = paragraphFormattingInfo.styleLink;
            if (paragraphFormattingInfo.nextStyle && paragraphFormattingInfo.nextStyle >= 0)
                this.importer.importers.style.nextParagraphStyleIndexTable[this.importer.importers.style.paragraph.rtfStyleIndex] = paragraphFormattingInfo.nextStyle;
            if (style.styleName != ParagraphStyle.normalStyleName) {
                const parentCharacterPropertiesMerger = new CharacterPropertiesMerger();
                parentCharacterPropertiesMerger.mergeParagraphStyle(style.parent);
                const characterMerger = new CharacterPropertiesMerger();
                characterMerger.mergeOnlyOwnCharacterProperties(this.importer.importers.character.characterFormatting.coreProperties, parentCharacterPropertiesMerger.innerProperties);
                style.maskedCharacterProperties = characterMerger.innerProperties;
                style.maskedParagraphProperties = RtfParagraphImporter.getOnlyOwnCharacterProperties(this.importer.importers.paragraph.paragraphFormatting.getCoreProperties(), style.parent);
            }
            if (paragraphFormattingInfo.paragraphListInfo.numberingListIndex >= 0) {
                const rtfIndex = this.importer.importers.style.paragraph.rtfStyleIndex;
                if (this.importer.importers.numbering.paragraphStyleListOverrideIndexMap[rtfIndex] === undefined)
                    this.importer.importers.numbering.paragraphStyleListOverrideIndexMap[rtfIndex] = paragraphFormattingInfo.paragraphListInfo;
            }
            style.primary = nestedDestination.qFormat;
            this.qFormat = false;
        }
    }
    static getPrimaryStyleName(styleName) {
        for (let name of styleName.split(','))
            if (!StringUtils.isNullOrEmpty(name))
                return StringUtils.trim(name);
        return "";
    }
    createClone() {
        const result = new StyleSheetDestination(this.importer);
        result.styleName = this.styleName;
        return result;
    }
    processCharCore(ch) {
        if (ch != ';')
            this.styleName += ch;
    }
    finalizeSubDocumentCreation() {
    }
    processSpecialHexCharCore(_ch) {
    }
}
