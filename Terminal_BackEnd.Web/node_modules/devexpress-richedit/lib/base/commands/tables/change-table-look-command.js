import { TableLookTypesHistoryItem } from '../../../core/model/history/items/tables/table-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TableLookTypes } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableLookCommandBase extends CommandBase {
    getState() {
        const tableInfo = this.selection.tableInfo;
        const state = new SimpleCommandState(this.isEnabled() && tableInfo.extendedData.numRows > 0, false);
        if (state.enabled)
            state.value = this.getValue(tableInfo.table);
        return state;
    }
    getValue(table) {
        const value = !!(table.lookTypes & this.option);
        return this.isInvertedTableLookType() ? !value : value;
    }
    isInvertedTableLookType() {
        return false;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        let table = this.selection.tableInfo.table;
        if (options.param === undefined || options.param === null)
            options.param = !this.getValue(table);
        this.history.beginTransaction();
        this.history.addAndRedo(new TableLookTypesHistoryItem(this.modelManipulator, options.subDocument, table.index, this.getNewValue(table, options.param)));
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
        this.history.endTransaction();
        return true;
    }
    getNewValue(table, parameter) {
        parameter = this.isInvertedTableLookType() ? !parameter : parameter;
        let value = table.lookTypes;
        if (parameter)
            value |= this.option;
        else
            value &= ~this.option;
        return value;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.ToggleFirstRow]: true,
            [RichEditClientCommand.ToggleLastRow]: true,
            [RichEditClientCommand.ToggleFirstColumn]: true,
            [RichEditClientCommand.ToggleLastColumn]: true,
            [RichEditClientCommand.ToggleBandedRows]: true,
            [RichEditClientCommand.ToggleBandedColumn]: true,
            [RichEditClientCommand.ChangeTableLook]: true,
        };
    }
}
export class ChangeTableLookCommand extends ChangeTableLookCommandBase {
    getValue(table) {
        return table.lookTypes;
    }
    getNewValue(_table, parameter) {
        return parameter;
    }
}
export class ToggleFirstRowCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.ApplyFirstRow;
    }
}
export class ToggleLastRowCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.ApplyLastRow;
    }
}
export class ToggleFirstColumnCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.ApplyFirstColumn;
    }
}
export class ToggleLastColumnCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.ApplyLastColumn;
    }
}
export class ToggleBandedRowsCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.DoNotApplyRowBanding;
    }
    isInvertedTableLookType() {
        return true;
    }
}
export class ToggleBandedColumnCommand extends ChangeTableLookCommandBase {
    constructor() {
        super(...arguments);
        this.option = TableLookTypes.DoNotApplyColumnBanding;
    }
    isInvertedTableLookType() {
        return true;
    }
}
