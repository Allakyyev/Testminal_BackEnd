import { convertToIntervalApi } from '../interval';
export class TableCellApi {
    constructor(tablePosition) {
        this._tablePosition = tablePosition;
    }
    get index() {
        return this._tablePosition.cellIndex;
    }
    get interval() {
        return convertToIntervalApi(this._tablePosition.cell.interval);
    }
}
