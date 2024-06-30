import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { ChangeSpellingErrorCommandBase } from './change-spelling-error-command-base';
export class ChangeAllSpellingErrorsCommand extends ChangeSpellingErrorCommandBase {
    isEnabled() {
        let selectedMisspelledInterval = this.control.spellChecker.getSelectedMisspelledInterval(this.selection.intervals);
        let suggestions = selectedMisspelledInterval ? selectedMisspelledInterval.errorInfo.suggestions : null;
        return super.isEnabled() && suggestions && suggestions.length > 0;
    }
    isVisible(selectedMisspelledInterval) {
        return super.isVisible(selectedMisspelledInterval) && selectedMisspelledInterval.errorInfo.errorType == SpellingErrorType.Misspelling;
    }
    executeCore(state, options) {
        const selectedMisspelledInterval = state.value;
        const intervalsWithErrorByWord = this.control.spellChecker.getIntervalsWithErrorByWord(selectedMisspelledInterval.errorInfo.word);
        this.history.beginTransaction();
        for (var i = 0, interval; interval = intervalsWithErrorByWord[i]; i++) {
            this.changeSpellingError(options, interval.start, interval.length);
        }
        this.history.endTransaction();
        return true;
    }
}
