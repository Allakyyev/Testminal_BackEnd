import { SubDocumentInterval } from '../../../core/model/sub-document';
import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SpellingCommandBase } from './spelling-command-base';
export class DeleteRepeatedWordCommand extends SpellingCommandBase {
    isVisible(selectedMisspelledInterval) {
        return super.isVisible(selectedMisspelledInterval) && selectedMisspelledInterval.errorInfo.errorType == SpellingErrorType.Repeating;
    }
    executeCore(state, _options) {
        let selectedMisspelledInterval = state.value;
        let deletingInterval = FixedInterval.fromPositions(selectedMisspelledInterval.start - 1, selectedMisspelledInterval.end);
        this.history.beginTransaction();
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(deletingInterval.start)));
        this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, deletingInterval), false, false);
        this.history.endTransaction();
        return true;
    }
}
