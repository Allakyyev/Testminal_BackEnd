import { AnchoredTextBoxSizeChangedSubDocumentChange } from '../../changes/sub-document/anchor/anchored-text-box-size-changed';
import { AnchoredPictureSizeChangedSubDocumentChange } from '../../changes/sub-document/picture/anchored-picture-size-changed';
import { HistoryItemIntervalState } from '../../history/states/history-item-state';
import { HistoryItemIntervalAnchorSizeStateObject } from '../../history/states/history-item-state-object';
import { BaseManipulator } from '../base-manipulator';
export class AnchorSizeManipulatorBase extends BaseManipulator {
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var run = subDocument.getRunByPosition(interval.start);
        var anchoredRun = run;
        oldState.register(new HistoryItemIntervalAnchorSizeStateObject(interval, anchoredRun.size.clone()));
        anchoredRun.size = newValue;
        newState.register(new HistoryItemIntervalAnchorSizeStateObject(interval, newValue));
        this.notify(newState.interval, anchoredRun.anchoredObjectID, newState, subDocument);
        return oldState;
    }
    restoreValue(subDocument, state) {
        var stateValue = state.lastObject;
        var run = subDocument.getRunByPosition(stateValue.interval.start);
        var anchoredRun = run;
        anchoredRun.size = stateValue.value;
        this.notify(state.interval, anchoredRun.anchoredObjectID, state, subDocument);
    }
}
export class AnchorTextBoxSizeManipulator extends AnchorSizeManipulatorBase {
    setValue(subDocument, interval, newValue) {
        return super.setValue(subDocument, interval, newValue);
    }
    notify(interval, objectId, newState, subDocument) {
        this.modelManipulator.notifyModelChanged(new AnchoredTextBoxSizeChangedSubDocumentChange(subDocument.id, objectId, interval.start, newState));
    }
}
export class AnchorPictureSizeManipulator extends AnchorSizeManipulatorBase {
    setValue(subDocument, interval, newValue) {
        return super.setValue(subDocument, interval, newValue);
    }
    notify(interval, objectId, newState, subDocument) {
        this.modelManipulator.notifyModelChanged(new AnchoredPictureSizeChangedSubDocumentChange(subDocument.id, objectId, interval.start, newState));
    }
}
