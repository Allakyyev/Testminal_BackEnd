import { __awaiter } from "tslib";
import { ElementDestination } from '../../destination';
export class GridColumnDestination extends ElementDestination {
    constructor(data, tableGrid) {
        super(data);
        this.tableGrid = tableGrid;
    }
    get elementHandlerTable() {
        return {};
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableGrid.push(this.data.readerHelper.getWpSTIntegerValue(reader, 'w'));
        });
    }
}
