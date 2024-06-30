import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { SpellingCommandBase } from './spelling-command-base';
export class IgnoreAllSpellingErrorsCommand extends SpellingCommandBase {
    isVisible(selectedMisspelledInterval) {
        return super.isVisible(selectedMisspelledInterval) && selectedMisspelledInterval.errorInfo.errorType == SpellingErrorType.Misspelling;
    }
    executeCore(state, _options) {
        let selectedMisspelledInterval = state.value;
        this.control.spellChecker.ignoreAll(selectedMisspelledInterval);
        return true;
    }
}
