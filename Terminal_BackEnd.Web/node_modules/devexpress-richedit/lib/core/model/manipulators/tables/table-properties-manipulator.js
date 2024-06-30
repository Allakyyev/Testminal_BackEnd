import { TablePropertyChangedSubDocumentChange } from '../../changes/sub-document/table/property-changed';
import { HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemTableComplexUseStateObject, HistoryItemTableStateObject, HistoryItemTableUseStateObject } from '../../history/states/history-item-state-object';
import { JSONEnumTableProperty } from '../../json/enums/table/json-table-enums';
import { TablePropertiesMask } from '../../tables/properties/table-properties';
export class TablePropertiesManipulator {
    constructor(manipulator) {
        this.cellMargins = new TableComplexPropertyWithUseManipulator(manipulator, JSONEnumTableProperty.CellMargins, [TablePropertiesMask.UseTopMargin, TablePropertiesMask.UseRightMargin, TablePropertiesMask.UseBottomMargin, TablePropertiesMask.UseLeftMargin], (prop, vals) => {
            prop.cellMargins.top = vals[0];
            prop.cellMargins.right = vals[1];
            prop.cellMargins.bottom = vals[2];
            prop.cellMargins.left = vals[3];
        }, prop => [prop.cellMargins.top, prop.cellMargins.right, prop.cellMargins.bottom, prop.cellMargins.left]);
        this.cellSpacing = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.CellSpacing, TablePropertiesMask.UseCellSpacing, (prop, val) => prop.cellSpacing = val, (prop) => prop.cellSpacing);
        this.indent = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.Indent, TablePropertiesMask.UseTableIndent, (prop, val) => prop.indent = val, (prop) => prop.indent);
        this.preferredWidth = new TablePropertiesManipulatorCore(manipulator, JSONEnumTableProperty.PreferredWidth, (table, val) => table.preferredWidth = val, (table) => table.preferredWidth);
        this.lookTypes = new TablePropertiesManipulatorCore(manipulator, JSONEnumTableProperty.TableLookTypes, (table, val) => table.lookTypes = val, (table) => table.lookTypes);
        this.borders = new TableComplexPropertyWithUseManipulator(manipulator, JSONEnumTableProperty.Borders, [TablePropertiesMask.UseTopBorder, TablePropertiesMask.UseRightBorder, TablePropertiesMask.UseBottomBorder, TablePropertiesMask.UseLeftBorder, TablePropertiesMask.UseInsideHorizontalBorder, TablePropertiesMask.UseInsideVerticalBorder], (prop, vals) => {
            prop.borders.topBorder = vals[0] || prop.borders.topBorder;
            prop.borders.rightBorder = vals[1] || prop.borders.rightBorder;
            prop.borders.bottomBorder = vals[2] || prop.borders.bottomBorder;
            prop.borders.leftBorder = vals[3] || prop.borders.leftBorder;
            prop.borders.insideHorizontalBorder = vals[4] || prop.borders.insideHorizontalBorder;
            prop.borders.insideVerticalBorder = vals[5] || prop.borders.insideVerticalBorder;
        }, prop => [prop.borders.topBorder, prop.borders.rightBorder, prop.borders.bottomBorder, prop.borders.leftBorder, prop.borders.insideHorizontalBorder, prop.borders.insideVerticalBorder]);
        this.tableStyleColumnBandSize = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.TableStyleColBandSize, TablePropertiesMask.UseTableStyleColBandSize, (prop, val) => prop.tableStyleColumnBandSize = val, (prop) => prop.tableStyleColumnBandSize);
        this.tableStyleRowBandSize = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.TableStyleRowBandSize, TablePropertiesMask.UseTableStyleRowBandSize, (prop, val) => prop.tableStyleRowBandSize = val, (prop) => prop.tableStyleRowBandSize);
        this.avoidDoubleBorders = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.AvoidDoubleBorders, TablePropertiesMask.UseAvoidDoubleBorders, (prop, val) => prop.avoidDoubleBorders = val, (prop) => prop.avoidDoubleBorders);
        this.layoutType = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.LayoutType, TablePropertiesMask.UseTableLayout, (prop, val) => prop.layoutType = val, (prop) => prop.layoutType);
        this.shadingInfo = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.ShadingInfo, TablePropertiesMask.UseShadingInfoIndex, (prop, val) => prop.shadingInfo = val, (prop) => prop.shadingInfo);
        this.tableRowAlignment = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.TableRowAlignment, TablePropertiesMask.UseTableAlignment, (prop, val) => prop.tableRowAlignment = val, (prop) => prop.tableRowAlignment);
        this.isTableOverlap = new TablePropertiesWithUseManipulatorCore(manipulator, JSONEnumTableProperty.IsTableOverlap, TablePropertiesMask.UseIsTableOverlap, (prop, val) => prop.isTableOverlap = val, (prop) => prop.isTableOverlap);
    }
}
class TablePropertiesManipulatorCore {
    constructor(manipulator, jsonTableProperty, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.jsonTableProperty = jsonTableProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, newValue) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        oldState.register(new HistoryItemTableStateObject(tableStartPosition, table.nestedLevel, tableIndex, this.getProperty(table)));
        this.setProperty(table, newValue);
        newState.register(new HistoryItemTableStateObject(tableStartPosition, table.nestedLevel, tableIndex, newValue));
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        this.setProperty(table, state.lastObject.value);
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, state));
    }
}
class TableComplexPropertyWithUseManipulator {
    constructor(manipulator, jsonTableProperty, masks, setProperties, getProperties) {
        this.manipulator = manipulator;
        this.jsonTableProperty = jsonTableProperty;
        this.setProperties = setProperties;
        this.getProperties = getProperties;
        this.masks = masks;
    }
    setValue(subDocument, tableIndex, newValues, newUses) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let properties = table.properties;
        let oldUseValues = [];
        for (let mask of this.masks)
            oldUseValues.push(properties.getUseValue(mask));
        oldState.register(new HistoryItemTableComplexUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, this.getProperties(properties), oldUseValues));
        this.setValuesCore(table, newValues, newUses);
        newState.register(new HistoryItemTableComplexUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, newValues, newUses));
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        this.setValuesCore(table, state.lastObject.value, state.lastObject.uses);
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, state));
    }
    setValuesCore(table, newValues, newUses) {
        var properties = table.properties.clone();
        this.setProperties(properties, newValues);
        for (let i = this.masks.length - 1; i >= 0; i--) {
            if (newUses[i] !== undefined)
                properties.setUseValue(this.masks[i], newUses[i]);
        }
        table.properties = properties;
    }
}
class TablePropertiesWithUseManipulatorCore {
    constructor(manipulator, jsonTableProperty, tablePropertiesMask, setProperty, getProperty) {
        this.manipulator = manipulator;
        this.tablePropertiesMask = tablePropertiesMask;
        this.jsonTableProperty = jsonTableProperty;
        this.setProperty = setProperty;
        this.getProperty = getProperty;
    }
    setValue(subDocument, tableIndex, newValue, newUse) {
        let table = subDocument.tables[tableIndex];
        let tableStartPosition = table.getStartPosition();
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        let properties = table.properties;
        oldState.register(new HistoryItemTableUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, this.getProperty(properties), properties.getUseValue(this.tablePropertiesMask)));
        this.setValueCore(table, newValue, newUse);
        newState.register(new HistoryItemTableUseStateObject(tableStartPosition, table.nestedLevel, tableIndex, newValue, newUse));
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let table = subDocument.tables[state.lastObject.tableIndex];
        this.setValueCore(table, state.lastObject.value, state.lastObject.use);
        this.manipulator.notifyModelChanged(new TablePropertyChangedSubDocumentChange(subDocument, this.jsonTableProperty, state));
    }
    setValueCore(table, newValue, newUse) {
        var properties = table.properties.clone();
        this.setProperty(properties, newValue);
        properties.setUseValue(this.tablePropertiesMask, newUse);
        table.properties = properties;
    }
}
