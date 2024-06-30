import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { Constants } from '@devexpress/utils/lib/constants';
import { ElementDestination } from '../destination';
import { ColumnDestination } from './column-destination';
export class ColumnsDestination extends ElementDestination {
    get elementHandlerTable() {
        return ColumnsDestination.handlerTable;
    }
    get secProps() {
        return this.data.sectionImporter.properties;
    }
    static onColumn(data) {
        const columnInfos = ColumnsDestination.getThis(data).columnInfos;
        return columnInfos ? new ColumnDestination(data, columnInfos) : null;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.secProps.equalWidthColumns = this.data.readerHelper.getWpSTOnOffValue(reader, 'equalWidth', false);
            const columnCount = this.data.readerHelper.getWpSTIntegerValue(reader, 'num', Constants.MIN_SAFE_INTEGER);
            if (columnCount > 0)
                this.secProps.columnCount = columnCount;
            const spacing = this.data.readerHelper.getWpSTIntegerValue(reader, 'space', Constants.MIN_SAFE_INTEGER);
            if (spacing != Constants.MIN_SAFE_INTEGER)
                this.secProps.space = spacing;
            if (!this.secProps.equalWidthColumns)
                this.columnInfos = this.secProps.columnsInfo;
        });
    }
    processElementClose(_reader) {
        if (this.columnInfos) {
            if (this.columnInfos.length > 0)
                this.secProps.columnsInfo = this.columnInfos;
            else
                this.secProps.equalWidthColumns = true;
            this.columnInfos = null;
        }
    }
}
ColumnsDestination.handlerTable = new MapCreator()
    .add('col', ColumnsDestination.onColumn)
    .get();
