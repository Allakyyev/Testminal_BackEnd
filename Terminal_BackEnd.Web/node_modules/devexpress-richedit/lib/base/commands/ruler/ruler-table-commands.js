import { LayoutPositionCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { TableIndentHistoryItem, TableLayoutTypeHistoryItem, TablePreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-properties-history-items';
import { TableRowHeightHistoryItem } from '../../../core/model/history/items/tables/table-row-properties-history-items';
import { TableLayoutType } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableHeightUnit, TableHeightUnitType, TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ResizeColumnTableHelper } from '../../mouse-handler/resize-table-helper';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class RulerChangeTableSizeCommandParametersBase {
    constructor(modelTableIndex, offset, layoutTable) {
        this.modelTableIndex = modelTableIndex;
        this.offset = offset;
        this.layoutTable = layoutTable;
    }
}
export class RulerChangeTableRowHeightCommandParameters extends RulerChangeTableSizeCommandParametersBase {
    constructor(modelTableIndex, offset, layoutTable, layoutRowIndex) {
        super(modelTableIndex, offset, layoutTable);
        this.layoutRowIndex = layoutRowIndex;
    }
}
export class RulerChangeTableColumnWidthCommandParameters extends RulerChangeTableSizeCommandParametersBase {
    constructor(modelTableIndex, offset, layoutTable, oldBorderPosition, callFromRuler) {
        super(modelTableIndex, offset, layoutTable);
        this.oldBorderPosition = oldBorderPosition;
        this.callFromRuler = callFromRuler;
    }
}
export class RulerChangeTableSizeCommnandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.position = this.selection.reversedAnchorPostion;
    }
    getLayoutTableBySelection(subDocument, position) {
        const selection = this.selection;
        const layoutPos = LayoutPositionCreator.createLightLayoutPosition(this.control.layout, subDocument, position, selection.pageIndex, DocumentLayoutDetailsLevel.TableCell, true, false);
        if (layoutPos.row.tableCellInfo)
            return layoutPos.row.tableCellInfo.parentRow.parentTable;
        return LayoutPositionCreator.createLightLayoutPosition(this.control.layout, subDocument, position, selection.pageIndex, DocumentLayoutDetailsLevel.TableCell, false, false).row.tableCellInfo.parentRow.parentTable;
    }
    tableIsEditable(modelTableIndex) {
        const table = this.selection.activeSubDocument.tables[modelTableIndex];
        const tableInterval = FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition());
        return this.selection.activeSubDocument.isEditable([tableInterval]);
    }
}
export class RulerChangeTableRowHeightCommand extends RulerChangeTableSizeCommnandBase {
    executeCore(_state, options) {
        if (!this.tableIsEditable(options.param.modelTableIndex))
            return false;
        const modelManipulator = this.modelManipulator;
        const subDocument = options.subDocument;
        const layoutTable = options.param.layoutTable ||
            this.getLayoutTableBySelection(subDocument, options.intervalsInfo.intervals[0].start);
        const rowIndex = layoutTable.tableRows[options.param.layoutRowIndex].rowIndex;
        const modelRow = layoutTable.logicInfo.grid.table.rows[rowIndex];
        const layoutRow = layoutTable.tableRows[options.param.layoutRowIndex];
        const height = new TableHeightUnit().init(UnitConverter.pixelsToTwips(layoutRow.height + options.param.offset), modelRow.height.type == TableHeightUnitType.Exact ? TableHeightUnitType.Exact : TableHeightUnitType.Minimum);
        this.history.addAndRedo(new TableRowHeightHistoryItem(modelManipulator, subDocument, options.param.modelTableIndex, rowIndex, height));
        return true;
    }
}
export class RulerChangeTableColumnWidthCommand extends RulerChangeTableSizeCommnandBase {
    executeCore(_state, options) {
        const parameters = options.param;
        if (!this.tableIsEditable(parameters.modelTableIndex))
            return false;
        if (parameters.oldBorderPosition + parameters.offset < 0)
            parameters.offset = -parameters.oldBorderPosition;
        const modelManipulator = this.modelManipulator;
        const subDocument = options.subDocument;
        const layoutTable = parameters.layoutTable ||
            this.getLayoutTableBySelection(subDocument, options.intervalsInfo.intervals[0].start);
        const grid = layoutTable.logicInfo.grid;
        const oldPosRelativeTable = parameters.oldBorderPosition - layoutTable.x;
        const columnIndex = ResizeColumnTableHelper.findNearestColumnIndex(grid.columns.positions, oldPosRelativeTable);
        const newTableSizes = this.getNewTableSizes(grid, columnIndex, parameters.offset, parameters.callFromRuler);
        const history = this.history;
        history.beginTransaction();
        let newTableWidth = ListUtils.last(newTableSizes.newColumnsXPositions);
        if (!(grid.table.preferredWidth.type == TableWidthUnitType.ModelUnits && grid.table.preferredWidth.value == newTableWidth))
            history.addAndRedo(new TablePreferredWidthHistoryItem(modelManipulator, subDocument, parameters.modelTableIndex, this.toTableWidthUnit(newTableWidth)));
        if (grid.table.properties.layoutType != TableLayoutType.Fixed)
            history.addAndRedo(new TableLayoutTypeHistoryItem(modelManipulator, subDocument, parameters.modelTableIndex, TableLayoutType.Fixed, true));
        if (newTableSizes.tableIndentOffset != 0) {
            const oldIndent = grid.table.getActualTableIndent(modelManipulator.model.defaultTableProperties).value;
            history.addAndRedo(new TableIndentHistoryItem(modelManipulator, subDocument, parameters.modelTableIndex, this.toTableWidthUnit(UnitConverter.twipsToPixelsF(oldIndent) + newTableSizes.tableIndentOffset), true));
        }
        for (let rowIndex = 0, row; row = grid.table.rows[rowIndex]; rowIndex++) {
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                const cellStartSpan = grid.tableCellInfos[rowIndex][cellIndex].getGridCellIndex();
                const cellEndSpan = cellStartSpan + cell.columnSpan;
                const newCellWidthValue = newTableSizes.newColumnsXPositions[cellEndSpan] - newTableSizes.newColumnsXPositions[cellStartSpan];
                const newCellWidth = this.toTableWidthUnit(newCellWidthValue);
                if (!cell.preferredWidth.equals(newCellWidth))
                    history.addAndRedo(new TableCellPreferredWidthHistoryItem(modelManipulator, subDocument, parameters.modelTableIndex, rowIndex, cellIndex, newCellWidth));
            }
        }
        history.endTransaction();
        return true;
    }
    toTableWidthUnit(val) {
        return new TableWidthUnit().init(UnitConverter.pixelsToTwips(val), TableWidthUnitType.ModelUnits);
    }
    getNewTableSizes(grid, columnBoundIndex, offset, callFromRuler) {
        let newColumnsXPositions = ListUtils.shallowCopy(grid.columns.positions);
        if (columnBoundIndex == 0) {
            if (!callFromRuler) {
                for (let ind = 1; ind < newColumnsXPositions.length; ind++)
                    newColumnsXPositions[ind] -= offset;
            }
            return new NewTableSizes(newColumnsXPositions, offset);
        }
        newColumnsXPositions[columnBoundIndex] += offset;
        if (callFromRuler)
            for (let ind = columnBoundIndex + 1; ind < newColumnsXPositions.length; ind++)
                newColumnsXPositions[ind] += offset;
        return new NewTableSizes(newColumnsXPositions, 0);
    }
}
class NewTableSizes {
    constructor(newColumnsXPositions, tableIndentOffset) {
        this.newColumnsXPositions = newColumnsXPositions;
        this.tableIndentOffset = tableIndentOffset;
    }
}
