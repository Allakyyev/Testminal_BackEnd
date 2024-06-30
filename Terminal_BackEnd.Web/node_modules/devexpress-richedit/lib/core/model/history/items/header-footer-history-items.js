import { HistoryItem } from '../base/history-item';
export class ChangeHeaderFooterIndexHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, sectionIndex, type, newIndex, actionAfterUndo) {
        super(modelManipulator);
        this.sectionIndex = sectionIndex;
        this.type = type;
        this.newIndex = newIndex;
        this.actionAfterUndo = actionAfterUndo;
    }
    redo() {
        this.oldIndex = this.getManipulator().changeObjectIndex(this.sectionIndex, this.type, this.newIndex);
    }
    undo() {
        this.getManipulator().changeObjectIndex(this.sectionIndex, this.type, this.oldIndex);
        this.actionAfterUndo(this.oldIndex);
    }
}
export class ChangeHeaderIndexHistoryItem extends ChangeHeaderFooterIndexHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.header;
    }
}
export class ChangeFooterIndexHistoryItem extends ChangeHeaderFooterIndexHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.footer;
    }
}
