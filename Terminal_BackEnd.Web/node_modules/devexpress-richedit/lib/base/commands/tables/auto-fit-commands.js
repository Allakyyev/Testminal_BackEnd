import { LayoutPositionCreatorConflictFlags } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../../core/layout/layout-position';
import { LayoutColumn } from '../../../core/layout/main-structures/layout-column';
import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { TableLayoutTypeHistoryItem, TablePreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TableLayoutType } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class AutoFitCommandBase extends TableCommandBase {
    getState() {
        if (this.isEnabled()) {
            const tbl = this.selection.tableInfo.table;
            if (tbl)
                return new SimpleCommandState(true, tbl);
        }
        return new SimpleCommandState(false);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
}
export class AutoFitContentsCommand extends AutoFitCommandBase {
    executeCore(state, parameter) {
        const table = state.value;
        const history = this.history;
        const subDocument = parameter.subDocument;
        history.beginTransaction();
        history.addAndRedo(new TableLayoutTypeHistoryItem(this.modelManipulator, subDocument, table.index, TableLayoutType.Autofit, true));
        history.addAndRedo(new TablePreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, TableWidthUnit.create(0, TableWidthUnitType.Auto)));
        this.modelManipulator.table.forEachCell(table, (pos, _cellSpan) => {
            history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, pos.rowIndex, pos.cellIndex, TableWidthUnit.create(0, TableWidthUnitType.Auto)));
        });
        history.endTransaction();
        return true;
    }
}
export class AutoFitWindowCommand extends AutoFitCommandBase {
    executeCore(state, parameter) {
        const table = state.value;
        const history = this.history;
        const subDocument = parameter.subDocument;
        history.beginTransaction();
        history.addAndRedo(new TableLayoutTypeHistoryItem(this.modelManipulator, subDocument, table.index, TableLayoutType.Autofit, true));
        history.addAndRedo(new TablePreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, TableWidthUnit.create(TableWidthUnit.MAX_PERCENT_WIDTH, TableWidthUnitType.FiftiethsOfPercent)));
        const widths = this.modelManipulator.table.distributeWidthsToAllColumns(table, TableWidthUnit.MAX_PERCENT_WIDTH);
        this.modelManipulator.table.forEachCell(table, (pos, cellSpan) => {
            history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, pos.rowIndex, pos.cellIndex, TableWidthUnit.create(this.modelManipulator.table.fullCellWidth(widths, cellSpan, pos.cell.columnSpan), TableWidthUnitType.FiftiethsOfPercent)));
        });
        history.endTransaction();
        return true;
    }
}
export class FixedColumnWidthCommand extends AutoFitCommandBase {
    executeCore(state, parameter) {
        const table = state.value;
        const history = this.history;
        const subDocument = parameter.subDocument;
        const lp = LayoutPosition.ensure(this.control.layoutFormatterManager, this.selection, subDocument, table.getStartPosition(), DocumentLayoutDetailsLevel.Row, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        const grid = this.getGrid(table, lp);
        history.beginTransaction();
        history.addAndRedo(new TableLayoutTypeHistoryItem(this.modelManipulator, subDocument, table.index, TableLayoutType.Fixed, true));
        history.addAndRedo(new TablePreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, TableWidthUnit.create(0, TableWidthUnitType.Auto)));
        const widths = grid ?
            ListUtils.reducedMap(grid.columns.width, (width) => {
                const w = UnitConverter.pixelsToTwipsF(width);
                return w === 0 ? null : w;
            }) :
            this.modelManipulator.table.distributeWidthsToAllColumns(table, UnitConverter.pixelsToTwipsF((this.getAvaliableWidth_px(table, lp))));
        this.modelManipulator.table.forEachCell(table, (pos, cellSpan) => {
            history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, pos.rowIndex, pos.cellIndex, TableWidthUnit.create(this.modelManipulator.table.fullCellWidth(widths, cellSpan, pos.cell.columnSpan), TableWidthUnitType.ModelUnits)));
        });
        history.endTransaction();
        return true;
    }
    getGrid(table, lp) {
        const tableInfo = lp.column.tablesInfo ? ListUtils.elementBy(lp.column.tablesInfo, (info) => info.logicInfo.grid.table.index == table.index) : null;
        return tableInfo ? tableInfo.logicInfo.grid : null;
    }
    getAvaliableWidth_px(table, lp) {
        if (table.nestedLevel == 0)
            return LayoutColumn.findSectionColumnWithMinimumWidth(lp.pageArea.columns);
        let cell = lp.row.tableCellInfo;
        while (cell.parentRow.parentTable.logicInfo.grid.table.nestedLevel != table.nestedLevel - 1)
            cell = cell.parentRow.parentTable.parentCell;
        return cell.avaliableContentWidth;
    }
}
