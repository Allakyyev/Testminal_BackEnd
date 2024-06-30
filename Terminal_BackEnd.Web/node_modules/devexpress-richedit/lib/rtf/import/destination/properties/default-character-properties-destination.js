import { CharacterPropertyDescriptor } from '../../../../core/model/character/character-property-descriptor';
import { CharacterPropertiesMask } from '../../../../core/model/character/enums';
import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
export class DefaultCharacterPropertiesDestination extends DestinationSubDocument {
    get destinationType() { return DestinationType.DefaultCharacterPropertiesDestination; }
    get controlCharHT() { return null; }
    constructor(importer) {
        super(importer, importer.subDocument);
        this.importer.importers.character.characterFormatting.coreProperties.
            setValue(CharacterPropertyDescriptor.size, 10);
    }
    get canAppendText() {
        return false;
    }
    beforePopRtfState() {
        this.documentModel.defaultCharacterProperties = this.importer.importers.character.characterFormatting.coreProperties.clone();
        this.importer.importers.character.characterFormatting.coreProperties.setUseValue(CharacterPropertiesMask.UseDoubleFontSize, false);
    }
    createClone() {
        return new DefaultCharacterPropertiesDestination(this.importer);
    }
    processCharCore(_ch) { }
    finalizeSubDocumentCreation() {
    }
}
