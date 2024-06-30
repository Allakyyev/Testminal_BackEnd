import { TableRowPropertyChangedSubDocumentChange } from '../../changes/sub-document/table/row-property-changed';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemTableRowStateObject, HistoryItemTableRowUseStateObject } from '../../history/states/history-item-state-object';
import { JSONServerTableRowProperty } from '../../json/enums/table/json-table-row-enums';
import { TableRowPropertiesMask } from '../../tables/properties/table-row-properties';
export class TableRowPropertiesManipulator {
    constructor(manipulator) {
        this.cellSpacing = new TableRowPropertiesWithUseManipulatorCore(manipulator, JSONServerTableRowProperty.CellSpacing, TableRowPropertiesMask.UseCellSpacing, (prop, val) => prop.cellSpacing = val, prop => prop.cellSpacing);
        this.cantSplit = new TableRowPropertiesWithUseManipulatorCore(manipulator, JSONServerTableRowProperty.CantSplit, TableRowPropertiesMask.UseCantSplit, (prop, val) => prop.cantSplit = val, prop => prop.cantSplit);
        this.hideCellMark = new TableRowPropertiesWithUseManipulatorCore(manipulator, JSONServerTableRowProperty.HideCellMark, TableRowPropertiesMask.UseHideCellMark, (prop, val) => prop.hideCellMark = val, prop => prop.hideCellMark);
        this.header = new TableRowPropertiesWithUseManipulatorCore(manipulator, JSONServerTableRowProperty.Header, TableRowPropertiesMask.UseHeader, (prop, val) => prop.header = val, prop => prop.header);
        this.tableRowAlignment = new TableRowPropertiesWithUseManipulatorCore(manipulator, JSONServerTableRowProperty.TableRowAlignment, TableRowPropertiesMask.UseTableRowAlignment, (prop, val) => prop.tableRowAlignment = val, prop => prop.tableRowAlignment);
        this.height = new TableRowPropertiesManipulatorCore(manipulator, JSONServerTableRowProperty.Height, (row, val) => row.height = val, prop => prop.height);
        this.gridAfter = new TableRowPropertiesManipulatorCore(manipulator, JSONServerTableRowProperty.GridAfter, (row, val) => row.gridAfter = val, row => row.gridAfter);
        this.gridBefore = new TableRowPropertiesManipulatorCore(manipulator, JSONServerTableRowProperty.GridBefore, (row, val) => row.gridBefore = val, row => row.gridBefore);
        this.widthAfter = new TableRowPropertiesManipulatorCore(manipulator, JSONServerTableRowProperty.WidthAfter, (row, val) => row.widthAfter = val, row => row.widthAfter);
        this.widthBefore = new TableRowPropertiesManipulatorCore(manipulator, JSONServerTableRowProperty.WidthBefore, (row, val) => row.widthBefore = val, row => row.widthBefore);
    }
}
class TableRowPropertiesManipulatorCore {
    constructor(manipulator, jsonTableCellProperty, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.jsonTableRowProperty = jsonTableCellProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, rowIndex, newValue) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let row = table.rows[rowIndex];
        oldState.register(new HistoryItemTableRowStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, this.getProperty(row)));
        this.setProperty(row, newValue);
        newState.register(new HistoryItemTableRowStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, newValue));
        this.manipulator.notifyModelChanged(new TableRowPropertyChangedSubDocumentChange(subDocument, this.jsonTableRowProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let row = table.rows[state.lastObject.rowIndex];
        this.setProperty(row, state.lastObject.value);
        this.manipulator.notifyModelChanged(new TableRowPropertyChangedSubDocumentChange(subDocument, this.jsonTableRowProperty, state));
    }
}
class TableRowPropertiesWithUseManipulatorCore {
    constructor(manipulator, jsonTableCellProperty, tableRowPropertiesMask, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.tableRowPropertiesMask = tableRowPropertiesMask;
        this.jsonTableRowProperty = jsonTableCellProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, rowIndex, newValue, newUse) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let row = table.rows[rowIndex];
        let properties = row.properties;
        oldState.register(new HistoryItemTableRowUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, this.getProperty(properties), properties.getUseValue(this.tableRowPropertiesMask)));
        this.setValueCore(subDocument.documentModel.cache, row, newValue, newUse);
        newState.register(new HistoryItemTableRowUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, newValue, newUse));
        this.manipulator.notifyModelChanged(new TableRowPropertyChangedSubDocumentChange(subDocument, this.jsonTableRowProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let row = table.rows[state.lastObject.rowIndex];
        this.setValueCore(subDocument.documentModel.cache, row, state.lastObject.value, state.lastObject.use);
        this.manipulator.notifyModelChanged(new TableRowPropertyChangedSubDocumentChange(subDocument, this.jsonTableRowProperty, state));
    }
    setValueCore(cache, row, newValue, newUse) {
        var properties = row.properties.clone();
        this.setProperty(properties, newValue);
        properties.setUseValue(this.tableRowPropertiesMask, newUse);
        row.properties = cache.tableRowPropertiesCache.getItem(properties);
    }
}
