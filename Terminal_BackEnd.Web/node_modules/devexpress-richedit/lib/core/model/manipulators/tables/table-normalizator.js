import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { GridMaker } from '../../tables/grid/grid-maker';
import { TableCellMergingState } from '../../tables/secondary-structures/table-base-structures';
import { TableWidthUnit, TableWidthUnitType } from '../../tables/secondary-structures/table-units';
export class TableNormalizator {
    constructor(table, setGridBefore, setGridAfter, setWidthBefore, setWidthAfter, setCellSpan, setVerticalMerging) {
        this.setGridBefore = setGridBefore;
        this.setGridAfter = setGridAfter;
        this.setWidthBefore = setWidthBefore;
        this.setWidthAfter = setWidthAfter;
        this.setCellSpan = setCellSpan;
        this.setVerticalMerging = setVerticalMerging;
        this.table = table;
        this.tableCellGridInfos = [];
        this.tableCellInfos = [];
        GridMaker.fillGridInfo(this.table, this.tableCellGridInfos, this.tableCellInfos);
    }
    normalizeAll() {
        this.transformTableToSquare();
        this.normalizeAllHorizontalSpans();
        this.normalizeWidthBeforeAfter();
        this.normalizeVerticalSpans();
        return this;
    }
    transformTableToSquare() {
        const rows = this.table.rows;
        const logicalCells = ListUtils.maxExtended(rows, (row) => row.getTotalCellsInRowConsiderGrid()).maxValue;
        for (let rowIndex = 0, row; row = rows[rowIndex]; rowIndex++)
            if (logicalCells != row.getTotalCellsInRowConsiderGrid())
                this.setGridAfter(this.table, rowIndex, logicalCells);
        return this;
    }
    normalizeAllHorizontalSpans() {
        const rowsIndexesInterval = new FixedInterval(0, this.tableCellGridInfos.length);
        for (let gridCellIndex = this.tableCellGridInfos[0].length - 2; gridCellIndex >= 0; --gridCellIndex) {
            if (ListUtils.allOfOnInterval(rowsIndexesInterval, (rowIndex) => {
                const info = this.tableCellGridInfos[rowIndex][gridCellIndex];
                return info ? gridCellIndex < info.getGridCellIndexEnd(this.table) - 1 : true;
            })) {
                ListUtils.forEachOnInterval(rowsIndexesInterval, (rowIndex) => {
                    const info = this.tableCellGridInfos[rowIndex][gridCellIndex];
                    if (info) {
                        const cellIndex = info.getCellIndexAbs(rowIndex);
                        this.setCellSpan(this.table, rowIndex, cellIndex, this.table.rows[rowIndex].cells[cellIndex].columnSpan - 1);
                    }
                    else {
                        const row = this.table.rows[rowIndex];
                        if (gridCellIndex < row.gridBefore)
                            this.setGridBefore(this.table, rowIndex, row.gridBefore - 1);
                        else
                            this.setGridAfter(this.table, rowIndex, row.gridAfter - 1);
                    }
                });
            }
        }
        return this;
    }
    normalizeWidthBeforeAfter() {
        const rows = this.table.rows;
        for (let rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
            TableNormalizator.setWidthBeforeAfter(this.table, rowIndex, row.gridBefore, row.widthBefore, this.setWidthBefore);
            TableNormalizator.setWidthBeforeAfter(this.table, rowIndex, row.gridAfter, row.widthAfter, this.setWidthAfter);
        }
    }
    normalizeVerticalSpans() {
        const rows = this.table.rows;
        ListUtils.forEach(rows, (row, rowIndex) => {
            ListUtils.forEach(row.cells, (cell, cellIndex) => {
                const info = this.tableCellInfos[rowIndex][cellIndex];
                const mustBe = info.getNumRowsInCell() == 1 ? TableCellMergingState.None : (info.getStartRowIndex() == rowIndex ? TableCellMergingState.Restart : TableCellMergingState.Continue);
                if (cell.verticalMerging != mustBe)
                    this.setVerticalMerging(this.table, rowIndex, cellIndex, mustBe);
            });
        });
    }
    static setWidthBeforeAfter(table, rowIndex, gridNum, width, setWidth) {
        if (gridNum == 0 && (width.type != TableWidthUnitType.Nil || width.value != 0))
            setWidth(table, rowIndex, TableWidthUnit.createDefault());
    }
}
