import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ChangeSpellingErrorCommandBase } from './change-spelling-error-command-base';
export class ChangeSpellingErrorCommand extends ChangeSpellingErrorCommandBase {
    isEnabled() {
        let selectedMisspelledInterval = this.control.spellChecker.getSelectedMisspelledInterval(this.selection.intervals);
        let suggestions = selectedMisspelledInterval ? selectedMisspelledInterval.errorInfo.suggestions : null;
        return super.isEnabled() && suggestions && suggestions.length > 0;
    }
    isVisible(selectedMisspelledInterval) {
        return super.isVisible(selectedMisspelledInterval) && selectedMisspelledInterval.errorInfo.errorType == SpellingErrorType.Misspelling;
    }
    executeCore(state, options) {
        const misspelledInterval = state.value;
        this.changeSpellingError(options, misspelledInterval.start, misspelledInterval.length);
        return true;
    }
}
export class NoSpellingSuggestionsCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        return true;
    }
}
