import { ModelWordPositionHelper } from '../../core/spelling/helpers';
export class SpellCheckerSelectionChangesListener {
    constructor(spellChecker) {
        this.spellChecker = spellChecker;
    }
    dispose() {
        clearTimeout(this.updBoxesTimerId);
    }
    NotifySelectionChanged(selection) {
        if (!this.spellChecker.settings.isEnabled)
            return;
        if (selection.prevState.intervalsInfo.subDocument != selection.currState.intervalsInfo.subDocument) {
            this.spellChecker.initialize(selection.activeSubDocument);
            this.spellChecker.check();
            this.updBoxesTimerId = setTimeout(() => this.spellChecker.updateMisspelledBoxes(), 0);
        }
        let startPosition = selection.anchorPosition;
        if (this.lastStartPosition === startPosition)
            return;
        this.lastStartPosition = startPosition;
        let wordStartPosition = ModelWordPositionHelper.getWordStartPosition(selection.activeSubDocument, startPosition);
        if (this.lastWordStartPosition === wordStartPosition)
            return;
        if (startPosition == wordStartPosition && startPosition - this.lastWordStartPosition == 1) {
            this.lastWordStartPosition = wordStartPosition;
            return;
        }
        this.lastWordStartPosition = wordStartPosition;
        this.spellChecker.onCurrentSelectedWordChanged();
    }
}
