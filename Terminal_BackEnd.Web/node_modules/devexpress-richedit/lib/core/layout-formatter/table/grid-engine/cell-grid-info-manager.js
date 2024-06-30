import { GridMaker } from '../../../model/tables/grid/grid-maker';
export class CellGridInfoManager {
    constructor(table) {
        this.tableCellGridInfos = [];
        this.tableCellInfos = [];
        GridMaker.fillGridInfo(table, this.tableCellGridInfos, this.tableCellInfos);
    }
    gridInfosByTablePosition(tblPos) {
        return this.tableCellInfos[tblPos.rowIndex][tblPos.cellIndex];
    }
}
