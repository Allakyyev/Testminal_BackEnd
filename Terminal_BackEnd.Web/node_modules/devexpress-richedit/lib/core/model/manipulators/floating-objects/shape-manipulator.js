import { ShapeChangedSubDocumentChange } from '../../changes/sub-document/anchor/shape-changed';
import { ShapePropertyChangedSubDocumentChange } from '../../changes/sub-document/anchor/shape-property-changed';
import { HistoryItemIntervalState } from '../../history/states/history-item-state';
import { HistoryItemIntervalShapeStateObject, HistoryItemIntervalStateObject } from '../../history/states/history-item-state-object';
import { JSONShapeProperty } from '../../json/enums/json-floating-enums';
import { BaseManipulator } from '../base-manipulator';
export class ShapeManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.fillColor = new ShapePropertyManipulator(manipulator, JSONShapeProperty.FillColor, (prop, val) => prop.fillColor = val, (prop) => prop.fillColor);
        this.outlineColor = new ShapePropertyManipulator(manipulator, JSONShapeProperty.OutlineColor, (prop, val) => prop.outlineColor = val, (prop) => prop.outlineColor);
        this.outlineWidth = new ShapePropertyManipulator(manipulator, JSONShapeProperty.OutlineWidth, (prop, val) => prop.outlineWidth = val, (prop) => prop.outlineWidth);
    }
    setValue(subDocument, interval, newValue) {
        let oldState = new HistoryItemIntervalState();
        let newState = new HistoryItemIntervalState();
        let run = subDocument.getRunByPosition(interval.start);
        let anchoredRun = run;
        oldState.register(new HistoryItemIntervalShapeStateObject(interval, anchoredRun.shape.clone()));
        anchoredRun.shape = newValue;
        newState.register(new HistoryItemIntervalShapeStateObject(interval, newValue));
        this.modelManipulator.notifyModelChanged(new ShapeChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        let stateValue = state.lastObject;
        let run = subDocument.getRunByPosition(stateValue.interval.start);
        let anchoredRun = run;
        anchoredRun.shape = stateValue.value;
        this.modelManipulator.notifyModelChanged(new ShapeChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, state));
    }
}
export class ShapePropertyManipulator {
    constructor(manipulator, jsonShapeProperty, setPropertyValue, getPropertyValue) {
        this.manipulator = manipulator;
        this.jsonShapeProperty = jsonShapeProperty;
        this.setPropertyValue = setPropertyValue;
        this.getPropertyValue = getPropertyValue;
    }
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var run = subDocument.getRunByPosition(interval.start);
        var anchoredRun = run;
        var shape = anchoredRun.shape.clone();
        oldState.register(new HistoryItemIntervalStateObject(interval, this.getPropertyValue(shape)));
        this.setPropertyValue(shape, newValue);
        anchoredRun.shape = shape;
        newState.register(new HistoryItemIntervalStateObject(interval, newValue));
        this.manipulator.notifyModelChanged(new ShapePropertyChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, this.jsonShapeProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (state.isEmpty())
            return;
        var stateValue = state.lastObject;
        var run = subDocument.getRunByPosition(stateValue.interval.start);
        var anchoredRun = run;
        this.setPropertyValue(anchoredRun.shape, stateValue.value);
        this.manipulator.notifyModelChanged(new ShapePropertyChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, this.jsonShapeProperty, state));
    }
}
