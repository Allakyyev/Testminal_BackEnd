import { CharacterStyle } from '../../../../core/model/character/character-style';
import { RtfCharacterImporter } from '../../importers/character-importer';
import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
import { StyleSheetDestination } from './style-sheet-destination';
export class CharacterStyleDestination extends DestinationSubDocument {
    constructor(importer, styleIndex) {
        super(importer, importer.subDocument);
        importer.importers.style.character.rtfStyleIndex = styleIndex;
        this.styleName = '';
    }
    get destinationType() { return DestinationType.CharacterStyleDestination; }
    get controlCharHT() { return null; }
    static onParentStyleIndex(importer, parameterValue, _hasParameter) {
        importer.importers.style.character.rtfParentStyleIndex = parameterValue;
    }
    static onStyleLinkKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.paragraph.paragraphFormatting.styleLink = parameterValue;
    }
    static onStyleQFormatKeyword(importer, parameterValue, _hasParameter) {
        importer.destination.qFormat = true;
        importer.importers.style.character.rtfParentStyleIndex = parameterValue;
    }
    get canAppendText() {
        return false;
    }
    beforePopRtfState() {
        const name = StyleSheetDestination.getPrimaryStyleName(this.styleName);
        if (!this.importer.importers.style.character.mapRtfIndexToModelIndex[this.importer.importers.style.character.rtfStyleIndex]) {
            const style = this.importer.importers.style.character.getOrCreateStyleByName(name);
            style.primary = this.qFormat;
            const rtfLinkStyleIndex = this.importer.importers.paragraph.paragraphFormatting.styleLink;
            if (rtfLinkStyleIndex >= 0) {
                if (this.importer.importers.style.linkParagraphStyleIndexToCharacterStyleIndex[rtfLinkStyleIndex] != undefined)
                    this.importer.importers.style.linkParagraphStyleIndexToCharacterStyleIndex[rtfLinkStyleIndex] = this.importer.importers.style.character.rtfStyleIndex;
            }
            if (name != CharacterStyle.defaultParagraphCharacterStyleName) {
                style.maskedCharacterProperties = RtfCharacterImporter.getOnlyOwnCharacterProperties(this.importer.importers.character.characterFormatting.coreProperties, style.parent);
            }
        }
    }
    createClone() {
        return new CharacterStyleDestination(this.importer, this.importer.importers.style.character.rtfStyleIndex);
    }
    processCharCore(ch) {
        if (ch != ';')
            this.styleName += ch;
    }
    finalizePieceTableCreation() {
    }
}
