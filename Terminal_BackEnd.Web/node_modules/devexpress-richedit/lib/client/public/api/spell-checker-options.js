export class SpellCheckerOptionsApi {
    constructor(_control) {
        this._control = _control;
    }
    get isEnabled() {
        return this._control.modelManager.richOptions.spellChecker.isEnabled;
    }
    set isEnabled(value) {
        if (value == this.isEnabled)
            return;
        if (!value) {
            this._control.modelManager.model.mainSubDocument.spellCheckerIntervalsManager.reset();
            this._control.spellChecker.updateMisspelledBoxes();
        }
        this._control.modelManager.richOptions.spellChecker.isEnabled = value;
        if (value)
            this._control.spellChecker.check();
    }
}
