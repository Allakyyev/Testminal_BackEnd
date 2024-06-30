import { HistoryItem } from '../../../../core/model/history/base/history-item';
import { Flag } from '@devexpress/utils/lib/class/flag';
import { HistoryItemDirection } from './history-item-direction';
export class ScrollHistoryItem extends HistoryItem {
    constructor(modelManipulator, selection, oldState, newState, directionValue = HistoryItemDirection.OnRedoAndUndo) {
        super(modelManipulator);
        this.selection = selection;
        this.newState = newState;
        this.oldState = oldState;
        this.directionFlag = new Flag(directionValue);
    }
    canBeMerged() {
        return true;
    }
    redo() {
        if (this.directionFlag.get(HistoryItemDirection.OnRedo))
            this.selection.scrollManager.setScroll(this.newState);
    }
    undo() {
        if (this.directionFlag.get(HistoryItemDirection.OnUndo))
            this.selection.scrollManager.setScroll(this.oldState);
    }
}
