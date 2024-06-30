import { AnchoredTextBoxPropertiesChangedSubDocumentChange } from '../../changes/sub-document/anchor/anchored-text-box-properties-changed';
import { HistoryItemIntervalState } from '../../history/states/history-item-state';
import { HistoryItemIntervalAnchoredTextBoxPropertiesStateObject } from '../../history/states/history-item-state-object';
import { BaseManipulator } from '../base-manipulator';
export class TextBoxPropertiesManipulator extends BaseManipulator {
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var run = subDocument.getRunByPosition(interval.start);
        oldState.register(new HistoryItemIntervalAnchoredTextBoxPropertiesStateObject(interval, run.textBoxProperties.clone()));
        run.textBoxProperties = newValue;
        newState.register(new HistoryItemIntervalAnchoredTextBoxPropertiesStateObject(interval, newValue));
        this.modelManipulator.notifyModelChanged(new AnchoredTextBoxPropertiesChangedSubDocumentChange(subDocument.id, run.anchoredObjectID, newState.interval.start, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        var stateValue = state.lastObject;
        var run = subDocument.getRunByPosition(stateValue.interval.start);
        run.textBoxProperties = stateValue.value;
        this.modelManipulator.notifyModelChanged(new AnchoredTextBoxPropertiesChangedSubDocumentChange(subDocument.id, run.anchoredObjectID, state.interval.start, state));
    }
}
