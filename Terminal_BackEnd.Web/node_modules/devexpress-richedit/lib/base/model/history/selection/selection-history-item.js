import { HistoryItem } from '../../../../core/model/history/base/history-item';
import { Flag } from '@devexpress/utils/lib/class/flag';
import { HistoryItemDirection } from './history-item-direction';
export class SelectionHistoryItem extends HistoryItem {
    constructor(modelManipulator, selection, oldState, newState, directionValue = HistoryItemDirection.OnRedoAndUndo) {
        super(modelManipulator);
        this.selection = selection;
        this.oldState = oldState;
        this.newState = newState;
        this.directionFlag = new Flag(directionValue);
    }
    canBeMerged() {
        return true;
    }
    redo() {
        if (this.directionFlag.get(HistoryItemDirection.OnRedo))
            this.selection.setState(this.newState);
    }
    undo() {
        if (this.directionFlag.get(HistoryItemDirection.OnUndo))
            this.selection.setState(this.oldState);
    }
}
