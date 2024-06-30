import { Flag } from '@devexpress/utils/lib/class/flag';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export var TableCellBoundFlags;
(function (TableCellBoundFlags) {
    TableCellBoundFlags[TableCellBoundFlags["StartAndEndOnOtherColumns"] = 0] = "StartAndEndOnOtherColumns";
    TableCellBoundFlags[TableCellBoundFlags["StartOnThisColumn"] = 1] = "StartOnThisColumn";
    TableCellBoundFlags[TableCellBoundFlags["EndOnThisColumn"] = 2] = "EndOnThisColumn";
})(TableCellBoundFlags || (TableCellBoundFlags = {}));
export class LayoutTableCellInfo extends Rectangle {
    constructor(parentRow, bound, cellGridIndex, avaliableContentWidth) {
        super(bound.x, bound.y, bound.width, bound.height);
        this.layoutRows = [];
        this.parentRow = parentRow;
        this.layoutRows = [];
        this.cellGridIndex = cellGridIndex;
        this.boundFlags = new Flag(TableCellBoundFlags.StartOnThisColumn | TableCellBoundFlags.EndOnThisColumn);
        this.internalTables = {};
        this.avaliableContentWidth = avaliableContentWidth;
    }
    isStartWithInternalTable() {
        return !!this.internalTables[0];
    }
    isEndWithInternalTable() {
        return !!this.internalTables[this.layoutRows.length];
    }
    getLastLayoutRowIncludingInternalTables() {
        const lastInternalTable = this.internalTables[this.layoutRows.length];
        return lastInternalTable ?
            ListUtils.last(ListUtils.last(lastInternalTable.tableRows).rowCells).getLastLayoutRowIncludingInternalTables() :
            ListUtils.last(this.layoutRows);
    }
    getFirstLayoutRowByModelPositionIncludingInternalTables() {
        const firstInternalTable = this.internalTables[0];
        return firstInternalTable ?
            ListUtils.min(firstInternalTable.tableRows[0].rowCells, cell => cell.getFirstLayoutRowByModelPositionIncludingInternalTables().columnOffset)
                .getFirstLayoutRowByModelPositionIncludingInternalTables() :
            this.layoutRows[0];
    }
    getEndPosition() {
        const internalTableAfterLastRow = this.internalTables[this.layoutRows.length];
        return internalTableAfterLastRow ?
            ListUtils.last(ListUtils.last(internalTableAfterLastRow.tableRows).rowCells).getEndPosition() :
            ListUtils.last(this.layoutRows).getEndPosition();
    }
    isEmpty() {
        return !this.layoutRows.length && NumberMapUtils.isEmpty(this.internalTables);
    }
}
