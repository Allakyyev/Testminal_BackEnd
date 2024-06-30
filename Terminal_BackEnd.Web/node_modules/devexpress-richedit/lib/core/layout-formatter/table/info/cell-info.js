import { Constants } from '@devexpress/utils/lib/constants';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { LayoutTableCellInfo, TableCellBoundFlags } from '../../../layout/table/layout-table-cell-info';
import { TablePositionIndexes } from '../../../model/tables/main-structures/table';
import { TableCellMergingState } from '../../../model/tables/secondary-structures/table-base-structures';
import { Formatter } from '../formatter';
export class CellInfo {
    constructor(cellIndex, rowInfo) {
        this._isStartOnThisColumn = false;
        this._formattingSuspended = false;
        this.cellIndex = cellIndex;
        this.rowInfo = rowInfo;
        this.actualCellInfo = this.getActuallCellInfo();
        this.init();
    }
    getContentModelPosition(maxNestedLevel) {
        const formatter = this.innerFormatter;
        return formatter && formatter.tableInfo.table.nestedLevel <= maxNestedLevel ?
            formatter.tableInfo.currCellInfo.getContentModelPosition(maxNestedLevel) : this.contentModelPosition;
    }
    get xContentInterval() {
        return this.actualCellInfo._xContentInterval;
    }
    get xInterval() {
        return this.actualCellInfo._xInterval;
    }
    get currLayoutRowContentWidth() {
        return this.innerFormatter ?
            this.innerFormatter.tableInfo.currCellInfo.currLayoutRowContentWidth :
            this.actualCellInfo.xContentInterval.length;
    }
    get nestedTableMaxWidth() {
        return this.actualCellInfo.xContentInterval.length;
    }
    getCurrLayoutRowOffset(considerInnerFormatter) {
        return (considerInnerFormatter && this.innerFormatter) ?
            this.innerFormatter.tableInfo.currCellInfo.getCurrLayoutRowOffset(true) :
            new Point(this.xContentInterval.start, this.currLayoutTableCellInfo.bottom);
    }
    get isSomeLayoutRowsPlaced() { return this.cell.startParagraphPosition.value != this.contentModelPosition; }
    get heightBeforeContent() { return this.actualCellInfo._heightBeforeContent; }
    get heightAfterContent() { return this.actualCellInfo._heightAfterContent; }
    get tableInfo() { return this.rowInfo.tableInfo; }
    get cell() { return this.rowInfo.row.cells[this.cellIndex]; }
    get isContendFullyPlaced() { return this.actualCellInfo._contentModelPosition == this.actualCellInfo.cell.endParagrapPosition.value; }
    get formattingSuspended() { return this._formattingSuspended; }
    get currLayoutTableCellInfo() { return this.actualCellInfo._currLayoutTableCellInfo; }
    get contentModelPosition() { return this.actualCellInfo._contentModelPosition; }
    get actualTableIndexes() {
        return new TablePositionIndexes(this.actualCellInfo.rowInfo.rowIndex, this.actualCellInfo.cellIndex);
    }
    get minBottomPosition() { return this.actualCellInfo._minBottomPosition; }
    get innerFormatter() { return this.actualCellInfo._innerFormatter; }
    set innerFormatter(val) { this.actualCellInfo._innerFormatter = val; }
    set isStartOnThisColumn(val) { this.actualCellInfo._isStartOnThisColumn = val; }
    set minBottomPosition(val) { this.actualCellInfo._minBottomPosition = Math.max(val, this.actualCellInfo._minBottomPosition); }
    get marginLeft() { return this.actualCellInfo._marginLeft; }
    get marginRight() { return this.actualCellInfo._marginRight; }
    getActuallCellInfo() {
        if (this.cell.verticalMerging != TableCellMergingState.Continue)
            return this;
        const cellGridInfo = this.tableInfo.grid.tableCellInfos[this.rowInfo.rowIndex][this.cellIndex];
        return this.tableInfo.rows[cellGridInfo.getStartRowIndex()].cells[cellGridInfo.getCellIndex(0)];
    }
    cellFullyFormatted() {
        this.cellPartiallyFormatted(this.actualCellInfo.cell.endParagrapPosition.value);
    }
    cellPartiallyFormatted(endPos) {
        if (!this.formattingSuspended)
            this.actualCellInfo._contentModelPosition = endPos;
    }
    undoContentModelPosition() {
        this.actualCellInfo._contentModelPosition = this.actualCellInfo._savedContentModelPosition;
    }
    storeContentModelPosition() {
        this.actualCellInfo._savedContentModelPosition = this.actualCellInfo._contentModelPosition;
    }
    init() {
        const cell = this.cell;
        if (cell.verticalMerging == TableCellMergingState.Continue) {
            this._xInterval = null;
            this._xContentInterval = null;
            this._heightBeforeContent = null;
            this._heightAfterContent = null;
            this._marginLeft = null;
            this._marginRight = null;
            this._savedContentModelPosition = this._contentModelPosition = null;
            return;
        }
        const rowIndex = this.rowInfo.rowIndex;
        const isFirstCellInRow = this.cellIndex == 0;
        const isLastCellInRow = this.rowInfo.row.cells.length - 1 == this.cellIndex;
        const cellInfo = this.tableInfo.grid.tableCellInfos[rowIndex][this.cellIndex];
        const rowCellSpacing = this.rowInfo.cellSpacing;
        this._marginLeft = Formatter.getCellMargin(cell.getActualLeftCellMargin(this.tableInfo.model));
        this._marginRight = Formatter.getCellMargin(cell.getActualRightCellMargin(this.tableInfo.model));
        const cellStartXPosition = this.tableInfo.xPositionStart +
            this.tableInfo.grid.columns.positions[cellInfo.getGridCellIndex()];
        const cellEndXPosition = this.tableInfo.xPositionStart +
            this.tableInfo.grid.columns.positions[cellInfo.getGridCellIndex() + cell.columnSpan];
        const verticalBordersCurrCell = this.tableInfo.verticalBorders[rowIndex][this.cellIndex];
        const brdCellLeft = verticalBordersCurrCell[rowCellSpacing > 0 && isFirstCellInRow ? 1 : 0];
        const cellStartContentXPosition = Math.max(cellStartXPosition + this._marginLeft +
            rowCellSpacing * (isFirstCellInRow ? 2 : 1), brdCellLeft.borderInfo ? this.tableInfo.xPositionStart + brdCellLeft.xPos + brdCellLeft.borderInfo.width : -Number.MAX_VALUE);
        let brdCellRight;
        if (rowCellSpacing > 0 || isLastCellInRow)
            brdCellRight = verticalBordersCurrCell[verticalBordersCurrCell.length - (rowCellSpacing > 0 && isLastCellInRow ? 2 : 1)];
        else
            brdCellRight = this.tableInfo.verticalBorders[rowIndex][this.cellIndex + 1][0];
        const cellEndContentXPosition = Math.min(cellEndXPosition -
            (this._marginRight + rowCellSpacing * (isLastCellInRow ? 2 : 1)), brdCellRight.borderInfo ? this.tableInfo.xPositionStart + brdCellRight.xPos : Constants.MAX_SAFE_INTEGER);
        this._xInterval = FixedInterval.fromPositions(cellStartXPosition, cellEndXPosition);
        this._xContentInterval = FixedInterval.fromPositions(cellStartContentXPosition, cellEndContentXPosition);
        this._savedContentModelPosition = this._contentModelPosition = cell.startParagraphPosition.value;
    }
    initLayoutInfo() {
        const isFirstRow = this.tableInfo.currRowInfo.rowIndex == 0;
        const isLastRow = this.tableInfo.currRowInfo.rowIndex == this.tableInfo.rows.length - 1;
        this.actualCellInfo._minBottomPosition = 0;
        const rowCellSpacing = this.rowInfo.cellSpacing;
        const horBrdLastIndex = this.tableInfo.currRowHorizontalBorders.length - 1;
        const borderBeforeWidth = this.tableInfo.currRowHorizontalBorders[0].maxWidth;
        const borderAfterWidth = this.tableInfo.currRowHorizontalBorders[horBrdLastIndex].maxWidth;
        this.actualCellInfo._heightBeforeContent = (isFirstRow ? borderBeforeWidth : borderBeforeWidth / 2) +
            this.rowInfo.topAndBottomMargins.topMargin;
        this.actualCellInfo._heightAfterContent = (isLastRow ? borderAfterWidth : borderAfterWidth / 2) +
            this.rowInfo.topAndBottomMargins.bottomMargin;
        if (rowCellSpacing > 0) {
            this.actualCellInfo._heightBeforeContent +=
                rowCellSpacing * (this.tableInfo.isThisColumnFirstInTable ? 2 : 1) +
                    (this.tableInfo.isThisTableRowFirstInColumn ? this.tableInfo.currRowHorizontalBorders[1].maxWidth : 0);
            this.actualCellInfo._heightAfterContent +=
                this.tableInfo.currRowHorizontalBorders[horBrdLastIndex - 1].maxWidth +
                    (this.tableInfo.isCurrRowLastInTable ? 2 : 1) * rowCellSpacing;
        }
        this.actualCellInfo._currLayoutTableCellInfo = new LayoutTableCellInfo(this.rowInfo.currLayoutTableRowInfo, new Rectangle(this.xInterval.start, this.tableInfo.currRowInfo.currLayoutTableRowInfo.y, this.xInterval.length, this.actualCellInfo._heightBeforeContent), this.tableInfo.grid.tableCellInfos[this.rowInfo.rowIndex][this.cellIndex].getGridCellIndex(), this.xContentInterval.length);
        if (this.actualCellInfo._isStartOnThisColumn)
            this.currLayoutTableCellInfo.boundFlags.set(TableCellBoundFlags.StartOnThisColumn, false);
    }
    clearLayoutInfo() {
        this.actualCellInfo._heightAfterContent = null;
        this.actualCellInfo._heightBeforeContent = null;
        this.actualCellInfo._currLayoutTableCellInfo = null;
    }
    suspendFormatting() {
        this._formattingSuspended = true;
    }
    resumeFormatting() {
        this._formattingSuspended = false;
    }
}
