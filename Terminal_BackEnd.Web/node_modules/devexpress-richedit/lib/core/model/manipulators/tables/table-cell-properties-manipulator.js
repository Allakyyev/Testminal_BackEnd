import { TableCellPropertyChangedSubDocumentChange } from '../../changes/sub-document/table/cell-property-changed';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemTableCellComplexUseStateObject, HistoryItemTableCellStateObject, HistoryItemTableCellUseStateObject } from '../../history/states/history-item-state-object';
import { JSONServerTableCellProperty } from '../../json/enums/table/json-table-cell-enums';
import { TableCellPropertiesMask } from '../../tables/properties/table-cell-properties';
export class TableCellPropertiesManipulator {
    constructor(manipulator) {
        this.cellMargins = new TableCellComplexPropertyWithUseManipulator(manipulator, JSONServerTableCellProperty.CellMargins, [TableCellPropertiesMask.UseTopMargin, TableCellPropertiesMask.UseRightMargin, TableCellPropertiesMask.UseBottomMargin, TableCellPropertiesMask.UseLeftMargin], (prop, vals) => { prop.cellMargins.top = vals[0]; prop.cellMargins.right = vals[1]; prop.cellMargins.bottom = vals[2]; prop.cellMargins.left = vals[3]; }, (prop) => [prop.cellMargins.top, prop.cellMargins.right, prop.cellMargins.bottom, prop.cellMargins.left]);
        this.borders = new TableCellComplexPropertyWithUseManipulator(manipulator, JSONServerTableCellProperty.Borders, [TableCellPropertiesMask.UseTopBorder, TableCellPropertiesMask.UseRightBorder, TableCellPropertiesMask.UseBottomBorder, TableCellPropertiesMask.UseLeftBorder, TableCellPropertiesMask.UseTopLeftDiagonalBorder, TableCellPropertiesMask.UseTopRightDiagonalBorder], (prop, vals) => {
            prop.borders.topBorder = vals[0] || prop.borders.topBorder;
            prop.borders.rightBorder = vals[1] || prop.borders.rightBorder;
            prop.borders.bottomBorder = vals[2] || prop.borders.bottomBorder;
            prop.borders.leftBorder = vals[3] || prop.borders.leftBorder;
            prop.borders.topLeftDiagonalBorder = vals[4] || prop.borders.topLeftDiagonalBorder;
            prop.borders.topRightDiagonalBorder = vals[5] || prop.borders.topRightDiagonalBorder;
        }, (prop) => [prop.borders.topBorder, prop.borders.rightBorder, prop.borders.bottomBorder, prop.borders.leftBorder, prop.borders.topLeftDiagonalBorder, prop.borders.topRightDiagonalBorder]);
        this.preferredWidth = new TableCellPropertiesManipulatorCore(manipulator, JSONServerTableCellProperty.PreferredWidth, (cell, val) => cell.preferredWidth = val, (cell) => cell.preferredWidth);
        this.hideCellMark = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.HideCellMark, TableCellPropertiesMask.UseHideCellMark, (prop, val) => prop.hideCellMark = val, (prop) => prop.hideCellMark);
        this.noWrap = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.NoWrap, TableCellPropertiesMask.UseNoWrap, (prop, val) => prop.noWrap = val, (prop) => prop.noWrap);
        this.fitText = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.FitText, TableCellPropertiesMask.UseFitText, (prop, val) => prop.fitText = val, (prop) => prop.fitText);
        this.textDirection = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.TextDirection, TableCellPropertiesMask.UseTextDirection, (prop, val) => prop.textDirection = val, (prop) => prop.textDirection);
        this.verticalAlignment = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.VerticalAlignment, TableCellPropertiesMask.UseVerticalAlignment, (prop, val) => prop.verticalAlignment = val, (prop) => prop.verticalAlignment);
        this.shadingInfo = new TableCellPropertiesWithUseManipulatorCore(manipulator, JSONServerTableCellProperty.ShadingInfo, TableCellPropertiesMask.UseShadingInfoIndex, (prop, val) => prop.shadingInfo = val, (prop) => prop.shadingInfo);
        this.columnSpan = new TableCellPropertyManipulator(manipulator, JSONServerTableCellProperty.ColumnSpan, (cell, val) => cell.columnSpan = val, cell => cell.columnSpan);
        this.verticalMerging = new TableCellPropertyManipulator(manipulator, JSONServerTableCellProperty.VerticalMerging, (cell, val) => cell.verticalMerging = val, cell => cell.verticalMerging);
    }
}
class TableCellPropertiesManipulatorCore {
    constructor(manipulator, jsonTableCellProperty, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.jsonTableCellProperty = jsonTableCellProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, rowIndex, cellIndex, newValue) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let row = table.rows[rowIndex];
        let cell = row.cells[cellIndex];
        oldState.register(new HistoryItemTableCellStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, this.getProperty(cell)));
        this.setProperty(cell, newValue);
        newState.register(new HistoryItemTableCellStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, newValue));
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let row = table.rows[state.lastObject.rowIndex];
        let cell = row.cells[state.lastObject.cellIndex];
        this.setProperty(cell, state.lastObject.value);
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, state));
    }
}
class TableCellPropertyManipulator {
    constructor(manipulator, jsonTableCellProperty, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.jsonTableCellProperty = jsonTableCellProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, rowIndex, cellIndex, newValue) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let cell = table.rows[rowIndex].cells[cellIndex];
        oldState.register(new HistoryItemTableCellStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, this.getProperty(cell)));
        this.setProperty(cell, newValue);
        newState.register(new HistoryItemTableCellStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, newValue));
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let cell = table.rows[state.lastObject.rowIndex].cells[state.lastObject.cellIndex];
        this.setProperty(cell, state.lastObject.value);
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, state));
    }
}
class TableCellComplexPropertyWithUseManipulator {
    constructor(manipulator, jsonTableCellProperty, masks, setProperties, getProperties) {
        this.manipulator = manipulator;
        this.jsonTableCellProperty = jsonTableCellProperty;
        this.setProperties = setProperties;
        this.getProperties = getProperties;
        this.masks = masks;
    }
    setValue(subDocument, tableIndex, rowIndex, cellIndex, newValues, newUses) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let cell = table.rows[rowIndex].cells[cellIndex];
        let properties = cell.properties;
        let oldUseValues = [];
        for (let mask of this.masks)
            oldUseValues.push(properties.getUseValue(mask));
        oldState.register(new HistoryItemTableCellComplexUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, this.getProperties(properties), oldUseValues));
        this.setValuesCore(subDocument.documentModel.cache, cell, newValues, newUses);
        newState.register(new HistoryItemTableCellComplexUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, newValues, newUses));
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let cell = table.rows[state.lastObject.rowIndex].cells[state.lastObject.cellIndex];
        this.setValuesCore(subDocument.documentModel.cache, cell, state.lastObject.value, state.lastObject.uses);
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, state));
    }
    setValuesCore(cache, cell, newValues, newUses) {
        var properties = cell.properties.clone();
        this.setProperties(properties, newValues);
        for (let i = this.masks.length - 1; i >= 0; i--) {
            if (newUses[i] !== undefined)
                properties.setUseValue(this.masks[i], newUses[i]);
        }
        cell.properties = cache.tableCellPropertiesCache.getItem(properties);
    }
}
class TableCellPropertiesWithUseManipulatorCore {
    constructor(manipulator, jsonTableCellProperty, tableCellPropertiesMask, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.tableCellPropertiesMask = tableCellPropertiesMask;
        this.jsonTableCellProperty = jsonTableCellProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, rowIndex, cellIndex, newValue, newUse) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let cell = table.rows[rowIndex].cells[cellIndex];
        let properties = cell.properties;
        oldState.register(new HistoryItemTableCellUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, this.getProperty(properties), properties.getUseValue(this.tableCellPropertiesMask)));
        this.setValueCore(subDocument.documentModel.cache, cell, newValue, newUse);
        newState.register(new HistoryItemTableCellUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, rowIndex, cellIndex, newValue, newUse));
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        let cell = table.rows[state.lastObject.rowIndex].cells[state.lastObject.cellIndex];
        this.setValueCore(subDocument.documentModel.cache, cell, state.lastObject.value, state.lastObject.use);
        this.manipulator.notifyModelChanged(new TableCellPropertyChangedSubDocumentChange(subDocument, this.jsonTableCellProperty, state));
    }
    setValueCore(cache, cell, newValue, newUse) {
        var properties = cell.properties.clone();
        this.setProperty(properties, newValue);
        properties.setUseValue(this.tableCellPropertiesMask, newUse);
        cell.properties = cache.tableCellPropertiesCache.getItem(properties);
    }
}
