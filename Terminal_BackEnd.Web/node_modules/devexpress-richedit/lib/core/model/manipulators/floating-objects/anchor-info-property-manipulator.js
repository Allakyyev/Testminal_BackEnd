import { AnchorInfoPropertyChangedSubDocumentChange } from '../../changes/sub-document/anchor/anchor-info-property-changed';
import { HistoryItemIntervalState } from '../../history/states/history-item-state';
import { HistoryItemIntervalStateObject } from '../../history/states/history-item-state-object';
import { RunType } from '../../runs/run-type';
import { BaseManipulator } from '../base-manipulator';
export class AnchorInfoPropertyManipulator extends BaseManipulator {
    constructor(manipulator, jsonAnchorInfoProperty, setPropertyValue, getPropertyValue) {
        super(manipulator);
        this.jsonAnchorInfoProperty = jsonAnchorInfoProperty;
        this.setPropertyValue = setPropertyValue;
        this.getPropertyValue = getPropertyValue;
    }
    setValue(subDocument, interval, newValue) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var run = subDocument.getRunByPosition(interval.start);
        var anchoredRun = run.getType() == RunType.AnchoredPictureRun ? run : run;
        var anchorInfo = anchoredRun.anchorInfo.clone();
        oldState.register(new HistoryItemIntervalStateObject(interval, this.getPropertyValue(anchorInfo)));
        this.setPropertyValue(anchorInfo, newValue);
        anchoredRun.anchorInfo = anchorInfo;
        newState.register(new HistoryItemIntervalStateObject(interval, newValue));
        this.modelManipulator.notifyModelChanged(new AnchorInfoPropertyChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, this.jsonAnchorInfoProperty, newState));
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (state.isEmpty())
            return;
        var stateValue = state.lastObject;
        var run = subDocument.getRunByPosition(stateValue.interval.start);
        var anchoredRun = run.getType() == RunType.AnchoredPictureRun ? run : run;
        this.setPropertyValue(anchoredRun.anchorInfo, stateValue.value);
        this.modelManipulator.notifyModelChanged(new AnchorInfoPropertyChangedSubDocumentChange(subDocument.id, anchoredRun.anchoredObjectID, this.jsonAnchorInfoProperty, state));
    }
}
