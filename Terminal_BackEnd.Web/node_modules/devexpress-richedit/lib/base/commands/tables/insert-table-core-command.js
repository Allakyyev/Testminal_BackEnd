import { LayoutPositionCreatorConflictFlags } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../../core/layout/layout-position';
import { LayoutColumn } from '../../../core/layout/main-structures/layout-column';
import { ControlOptions } from '../../../core/model/options/control';
import { Table } from '../../../core/model/tables/main-structures/table';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertTableCoreCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        const parameter = options.param;
        const subDocument = this.selection.activeSubDocument;
        const position = this.selection.intervals[0].start;
        const lp = LayoutPosition.ensure(this.control.layoutFormatterManager, this.control.selection, subDocument, position, DocumentLayoutDetailsLevel.Row, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        let currentTable = Table.getTableByPosition(subDocument.tables, position, true);
        let availableWidth = currentTable ? lp.row.tableCellInfo.avaliableContentWidth :
            LayoutColumn.findSectionColumnWithMinimumWidth(lp.pageArea.columns);
        this.history.beginTransaction();
        const table = this.modelManipulator.table.insertTable(subDocument, parameter.rowCount, parameter.cellCount, position, UnitConverter.pixelsToTwipsF(availableWidth), this.inputPosition, true);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(table.getStartPosition()).setEndOfLine(false)));
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, subDocument);
        this.history.endTransaction();
        return true;
    }
}
