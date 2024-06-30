import { ModelChangeType } from '../enums';
export class DocumentProtectionChangedModelChange {
    constructor(documentProtectionProperties) {
        this.documentProtectionProperties = documentProtectionProperties;
        this.type = ModelChangeType.DocumentProtectionChanged;
    }
}
