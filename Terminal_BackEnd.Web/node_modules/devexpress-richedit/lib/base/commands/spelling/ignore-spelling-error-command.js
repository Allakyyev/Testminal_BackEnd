import { SpellingCommandBase } from './spelling-command-base';
export class IgnoreSpellingErrorCommand extends SpellingCommandBase {
    executeCore(state, _options) {
        let selectedMisspelledInterval = state.value;
        this.control.spellChecker.ignore(selectedMisspelledInterval);
        return true;
    }
}
