import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SpellingCommandBase extends CommandBase {
    getState() {
        let selectedMisspelledInterval = this.control.spellChecker.getSelectedMisspelledInterval(this.selection.intervals);
        let state = new SimpleCommandState(this.isEnabled());
        state.value = selectedMisspelledInterval;
        state.visible = this.isVisible(selectedMisspelledInterval);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && this.control.spellChecker.settings.isEnabled;
    }
    isVisible(selectedMisspelledInterval) {
        return selectedMisspelledInterval != null;
    }
}
