import { ModelChangeType } from '../../enums';
export class ParagraphAndCharacterMergedPropertiesResetSubDocumentChange {
    constructor(subDocumentId, interval) {
        this.subDocumentId = subDocumentId;
        this.interval = interval;
        this.type = ModelChangeType.ParagraphAndCharacterMergedPropertiesReset;
    }
}
