import { Stack } from '@devexpress/utils/lib/class/stack';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfTableCellProperties } from '../model/table/properties/rtf-table-cell-properties';
import { RtfTableProperties } from '../model/table/properties/rtf-table-properties';
import { RtfTableRowProperties } from '../model/table/properties/table-row-properties';
import { RtfTableController } from './rtf-table-controller';
import { NoTableRtfTableReaderState } from './states/no-table-state';
export class RtfTableReader {
    constructor(importer) {
        this.isNestedTableProperetiesReading = false;
        this._state = new NoTableRtfTableReaderState(this);
        this.data = importer;
        this.tableStack = new Stack();
        this.tables = [];
        this.tableController = this.createTableController();
        this.parentCellMap = {};
        this.resetProperties();
    }
    get state() { return this._state; }
    get tableProperties() {
        {
            if (this._tableProperties == null)
                this._tableProperties = new RtfTableProperties();
            return this._tableProperties;
        }
    }
    get rowProperties() {
        if (this._rowProperties == null)
            this._rowProperties = new RtfTableRowProperties();
        return this._rowProperties;
    }
    get cellProperties() {
        if (this._cellProperties == null)
            this.createCellProperties();
        return this._cellProperties;
    }
    createCellProperties() {
        this._cellProperties = new RtfTableCellProperties();
    }
    restoreProperties(state) {
        this._tableProperties = state.tableProperties;
        this._rowProperties = state.rowProperties;
        this.cellPropertiesCollection = state.cellPropertiesCollection;
        if (this.cellPropertiesCollection.length > 0)
            this._cellProperties = ListUtils.last(this.cellPropertiesCollection);
        else
            this.createCellProperties();
    }
    resetProperties() {
        this._tableProperties = null;
        this._rowProperties = null;
        this._cellProperties = null;
        this.cellPropertiesCollection = [];
        this.processedBorder = null;
    }
    createTableController() {
        return new RtfTableController(this);
    }
    onStartNestedTableProperties() {
        this.isNestedTableProperetiesReading = true;
        this.state.onStartNestedTableProperties();
    }
    onEndParagraph() {
        this.state.onEndParagraph(this.data.importers.paragraph.paragraphFormatting);
    }
    onEndRow() {
        this.state.onEndRow();
    }
    onEndCell() {
        this.state.onEndCell();
    }
    onEndNestedRow() {
        this.isNestedTableProperetiesReading = false;
        this.state.onEndNestedRow();
    }
    onEndNestedCell() {
        this.state.onEndNestedCell();
    }
    onTableRowDefaults() {
        this.state.onTableRowDefaults();
        this.resetProperties();
    }
    onCellxProperty(value) {
        this.cellProperties.right = value;
        if (this.cellPropertiesCollection.length == 0 || ListUtils.last(this.cellPropertiesCollection) != this.cellProperties)
            this.cellPropertiesCollection.push(this.cellProperties);
        this.createCellProperties();
        this.processedBorder = null;
    }
    resetState() {
        this.changeState(new NoTableRtfTableReaderState(this));
        this.tableController.reset();
    }
    changeState(newState) {
        this._state = newState;
    }
}
