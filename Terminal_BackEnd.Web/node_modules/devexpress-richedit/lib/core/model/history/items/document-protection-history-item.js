import { HistoryItem } from '../base/history-item';
export class DocumentProtectionHistoryItem extends HistoryItem {
    constructor(modelManipulator, newProtectionProperties) {
        super(modelManipulator);
        this.newProtectionProperties = newProtectionProperties;
    }
    redo() {
        this.oldProtectionProperties = this.modelManipulator.documentProtectionProperties.changeProtectionProperties(this.modelManipulator.model, this.newProtectionProperties);
    }
    undo() {
        this.modelManipulator.documentProtectionProperties.changeProtectionProperties(this.modelManipulator.model, this.oldProtectionProperties);
    }
}
