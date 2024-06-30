import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { SpellingCommandBase } from './spelling-command-base';
export class AddWordToDictionary extends SpellingCommandBase {
    isEnabled() {
        return super.isEnabled() && this.control.spellChecker.settings.canAddWord;
    }
    isVisible(selectedMisspelledInterval) {
        return super.isVisible(selectedMisspelledInterval) && selectedMisspelledInterval.errorInfo.errorType == SpellingErrorType.Misspelling;
    }
    executeCore(state, _options) {
        let selectedMisspelledInterval = state.value;
        this.control.spellChecker.addWord(selectedMisspelledInterval);
        return true;
    }
}
