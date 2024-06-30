import { Errors } from '@devexpress/utils/lib/errors';
import { TableBasedHistoryItem } from './create-table-history-item';
export class TableCellPropertiesHistoryItemBase extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, newValue) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.newValue = newValue;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
    }
}
export class TableCellColumnSpanHistoryItem extends TableCellPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.cellProperties.columnSpan.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.cellIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.cellProperties.columnSpan.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableCellVerticalMergingHistoryItem extends TableCellPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.cellProperties.verticalMerging.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.cellIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.cellProperties.verticalMerging.restoreValue(this.boundSubDocument, this.oldState);
    }
    static fromPosition(modelManipulator, boundSubDocument, position, value) {
        return new TableCellVerticalMergingHistoryItem(modelManipulator, boundSubDocument, position.table.index, position.rowIndex, position.cellIndex, value);
    }
}
export class TableCellPropertiesUseHistoryItemBase extends TableCellPropertiesHistoryItemBase {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, newValues, newUse) {
        super(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, newValues);
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.cellIndex, this.newValue, this.newUse);
    }
    undo() {
        this.getManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class TableCellPropertiesComplexUseHistoryItemBase extends TableCellPropertiesHistoryItemBase {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, newValues, newUses) {
        super(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, newValues);
        if (newValues.length !== newUses.length)
            throw new Error("newValues.length should be equal to newUses.length");
        this.newUses = newUses;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.cellIndex, this.newValue, this.newUses);
    }
    undo() {
        this.getManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class TableCellCellMarginsHistoryItem extends TableCellPropertiesComplexUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.cellMargins;
    }
}
export class TableCellBordersHistoryItem extends TableCellPropertiesComplexUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.borders;
    }
}
export class TableCellPreferredWidthHistoryItem extends TableCellPropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.cellProperties.preferredWidth.setValue(this.boundSubDocument, this.tableIndex, this.rowIndex, this.cellIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.cellProperties.preferredWidth.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableCellHideCellMarkHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.hideCellMark;
    }
}
export class TableCellNoWrapHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.noWrap;
    }
}
export class TableCellFitTextHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.fitText;
    }
}
export class TableCellTextDirectionHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.textDirection;
    }
}
export class TableCellVerticalAlignmentHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.verticalAlignment;
    }
}
export class TableCellShadingInfoHistoryItem extends TableCellPropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.cellProperties.shadingInfo;
    }
}
