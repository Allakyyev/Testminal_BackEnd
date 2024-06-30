import { ModelChangeType } from '../../enums';
export class FieldsShowCodeChangedSubDocumentChange {
    constructor(subDocumentId, fieldInterval) {
        this.subDocumentId = subDocumentId;
        this.fieldInterval = fieldInterval;
        this.type = ModelChangeType.FieldsShowCodeChanged;
    }
}
