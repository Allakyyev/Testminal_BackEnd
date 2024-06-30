import { Errors } from '@devexpress/utils/lib/errors';
import { TableBasedHistoryItem } from './create-table-history-item';
export class TableRowPropertiesHistoryItemBase extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, newValue) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.newValue = newValue;
        this.rowIndex = rowIndex;
    }
}
export class TableRowGridAfterHistoryItem extends TableRowPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.rowProperties.gridAfter.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.rowProperties.gridAfter.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableRowGridBeforeHistoryItem extends TableRowPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.rowProperties.gridBefore.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.rowProperties.gridBefore.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableRowWidthAfterHistoryItem extends TableRowPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.rowProperties.widthAfter.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.rowProperties.widthAfter.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableRowWidthBeforeHistoryItem extends TableRowPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.rowProperties.widthBefore.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.rowProperties.widthBefore.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableRowPropertiesUseHistoryItemBase extends TableRowPropertiesHistoryItemBase {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, newValues, newUse) {
        super(modelManipulator, boundSubDocument, tableIndex, rowIndex, newValues);
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue, this.newUse);
    }
    undo() {
        this.getManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class TableRowHeightHistoryItem extends TableRowPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.rowProperties.height.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.rowProperties.height.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableRowCellSpacingHistoryItem extends TableRowPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.rowProperties.cellSpacing;
    }
}
export class TableRowCantSplitHistoryItem extends TableRowPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.rowProperties.cantSplit;
    }
}
export class TableRowHideCellMarkHistoryItem extends TableRowPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.rowProperties.hideCellMark;
    }
}
export class TableRowHeaderHistoryItem extends TableRowPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.rowProperties.header;
    }
}
export class TableRowTableRowAlignmentHistoryItem extends TableRowPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.rowProperties.tableRowAlignment;
    }
}
