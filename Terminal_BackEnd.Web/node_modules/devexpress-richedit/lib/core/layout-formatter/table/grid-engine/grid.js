import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { GridMaker } from '../../../model/tables/grid/grid-maker';
export class Grid {
    constructor(table) {
        this.table = table;
        this.tableCellGridInfos = [];
        this.tableCellInfos = [];
        GridMaker.fillGridInfo(table, this.tableCellGridInfos, this.tableCellInfos);
    }
    get commonWidth() {
        return ListUtils.last(this.columns.positions);
    }
}
