import { TableRowCollection } from '../collections/table/table-row-collection';
import { IntervalApi } from '../interval';
export class TableApi {
    constructor(processor, subDocument, table) {
        this._processor = processor;
        this._subDocument = subDocument;
        this._table = table;
    }
    get index() {
        return this._table.index;
    }
    get interval() {
        return new IntervalApi(this._table.interval.start, this._table.interval.length);
    }
    delete() {
        this._processor.beginUpdate();
        this._processor.modelManager.modelManipulator.table.removeTableWithContent(this._subDocument, this._table);
        this._processor.endUpdate();
    }
    get rows() {
        return new TableRowCollection(this._processor, this._table);
    }
}
