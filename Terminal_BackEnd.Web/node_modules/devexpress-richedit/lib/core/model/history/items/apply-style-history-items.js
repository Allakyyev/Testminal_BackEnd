import { HistoryItem } from '../base/history-item';
import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class ApplyCharacterStyleHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, style, restoreHyperlinks) {
        super(modelManipulator, subDocInterval);
        this.newStyle = style;
        this.restoreHyperlinks = restoreHyperlinks;
    }
    redo() {
        this.oldState = this.modelManipulator.style.setCharacterStyle(this.boundSubDocument, this.interval, this.newStyle, this.restoreHyperlinks);
    }
    undo() {
        this.modelManipulator.style.restoreCharacterStyle(this.boundSubDocument, this.oldState);
    }
}
export class ApplyParagraphStyleHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, style) {
        super(modelManipulator, subDocInterval);
        this.newStyle = style;
    }
    redo() {
        this.oldState = this.modelManipulator.style.setParagraphStyle(this.boundSubDocument, this.interval, this.newStyle);
    }
    undo() {
        this.modelManipulator.style.restoreParagraphStyle(this.boundSubDocument, this.oldState);
    }
}
export class ApplyTableStyleHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, tableIndex, style) {
        super(modelManipulator);
        this.newStyle = style;
        this.tableIndex = tableIndex;
        this.subDocument = subDocument;
    }
    redo() {
        this.oldStyle = this.subDocument.tables[this.tableIndex].style;
        this.modelManipulator.table.setTableStyle(this.subDocument, this.tableIndex, this.newStyle);
    }
    undo() {
        this.modelManipulator.table.setTableStyle(this.subDocument, this.tableIndex, this.oldStyle);
    }
}
