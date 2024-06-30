import { HistoryItem } from '../base/history-item';
export class DocumentDefaultTabWidthHistoryItem extends HistoryItem {
    constructor(modelManipulator, newDefaultTabWidth) {
        super(modelManipulator);
        this.newDefaultTabWidth = newDefaultTabWidth;
    }
    redo() {
        this.oldDefaultTabWidth = this.modelManipulator.documentProperties.setDefaultTabWidth(this.modelManipulator.model, this.newDefaultTabWidth);
    }
    undo() {
        this.modelManipulator.documentProperties.setDefaultTabWidth(this.modelManipulator.model, this.oldDefaultTabWidth);
    }
}
export class PageColorHistoryItem extends HistoryItem {
    constructor(modelManipulator, newPageColor) {
        super(modelManipulator);
        this.newPageColor = newPageColor;
    }
    redo() {
        this.oldPageColor = this.modelManipulator.documentProperties.changePageColor(this.modelManipulator.model, this.newPageColor);
    }
    undo() {
        this.modelManipulator.documentProperties.changePageColor(this.modelManipulator.model, this.oldPageColor);
    }
}
export class DifferentOddAndEvenPagesHistoryItem extends HistoryItem {
    constructor(modelManipulator, newValue) {
        super(modelManipulator);
        this.newValue = newValue;
    }
    redo() {
        this.oldValue = this.modelManipulator.documentProperties.changeDifferentOddAndEvenPages(this.modelManipulator.model, this.newValue);
    }
    undo() {
        this.modelManipulator.documentProperties.changeDifferentOddAndEvenPages(this.modelManipulator.model, this.oldValue);
    }
}
