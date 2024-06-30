import { InlineObjectRunPropertyChangedSubDocumentChange } from '../changes/sub-document/picture/inline-object-run-property-changed';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemInlineObjectPropertiesStateObject } from '../history/states/history-item-state-object';
import { JSONInlineObjectProperty } from '../json/enums/json-floating-enums';
import { BaseManipulator } from './base-manipulator';
export class InlineObjectManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.scale = new InlineObjectScaleManipulator(manipulator);
        this.lockAspectRatio = new InlineObjectLockAspectRatioManipulator(manipulator);
    }
}
export class InlineObjectPropertyManipulator extends BaseManipulator {
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var run = subDocument.getRunByPosition(interval.start);
        oldState.register(new HistoryItemInlineObjectPropertiesStateObject(interval, this.getPropertyValue(run.size)));
        newState.register(new HistoryItemInlineObjectPropertiesStateObject(interval, newValue));
        this.setPropertyValue(run.size, newValue);
        this.modelManipulator.notifyModelChanged(new InlineObjectRunPropertyChangedSubDocumentChange(subDocument.id, this.getJSONInlineObjectProperty(), interval.start, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (state.isEmpty())
            return;
        var stateValue = state.lastObject;
        var run = subDocument.getRunByPosition(stateValue.interval.start);
        this.setPropertyValue(run.size, stateValue.value);
        this.modelManipulator.notifyModelChanged(new InlineObjectRunPropertyChangedSubDocumentChange(subDocument.id, this.getJSONInlineObjectProperty(), state.interval.start, state));
    }
}
class InlineObjectScaleManipulator extends InlineObjectPropertyManipulator {
    getPropertyValue(size) {
        return size.scale.clone();
    }
    setPropertyValue(size, value) {
        size.scale.width = value.width;
        size.scale.height = value.height;
    }
    getJSONInlineObjectProperty() {
        return JSONInlineObjectProperty.Scales;
    }
}
class InlineObjectLockAspectRatioManipulator extends InlineObjectPropertyManipulator {
    getPropertyValue(size) {
        return size.lockAspectRatio;
    }
    setPropertyValue(size, value) {
        size.lockAspectRatio = value;
    }
    getJSONInlineObjectProperty() {
        return JSONInlineObjectProperty.LockAspectRatio;
    }
}
