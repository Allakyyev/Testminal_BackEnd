import { HistoryItem } from '../base/history-item';
export class ChangeFieldHyperlinkInfoHistoryItem extends HistoryItem {
    constructor(modelManipulator, boundSubDocument, fieldIndex, newInfo) {
        super(modelManipulator);
        this.boundSubDocument = boundSubDocument;
        this.newInfo = newInfo;
        this.fieldIndex = fieldIndex;
    }
    redo() {
        this.oldInfo = this.modelManipulator.field.setHyperlinkInfoInner(this.boundSubDocument, this.fieldIndex, this.newInfo);
    }
    undo() {
        this.modelManipulator.field.setHyperlinkInfoInner(this.boundSubDocument, this.fieldIndex, this.oldInfo);
    }
}
