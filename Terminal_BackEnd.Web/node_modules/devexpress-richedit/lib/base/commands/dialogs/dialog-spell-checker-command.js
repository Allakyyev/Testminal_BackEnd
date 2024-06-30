import { SpellingErrorType } from '../../../core/spelling/spell-checker';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogSpellCheckerCommand extends ShowDialogCommandBase {
    getState() {
        let selectedMisspelledInterval = this.control.spellChecker.getSelectedMisspelledInterval(this.selection.intervals);
        let state = new SimpleCommandState(this.isEnabled(), selectedMisspelledInterval);
        state.visible = selectedMisspelledInterval !== null;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && this.control.spellChecker.settings.isEnabled;
    }
    createParameters(_options) {
        var parameters = new SpellCheckerDialogParameters();
        parameters.controller = new SpellCheckerDialogController(this.control, this.control.spellChecker);
        return parameters;
    }
    applyParameters(_state, _newParameters) {
        return true;
    }
    getDialogName() {
        return "Spelling";
    }
}
export class SpellCheckerDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.controller = obj.controller;
    }
    clone() {
        const newInstance = new SpellCheckerDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
export class SpellCheckerDialogController {
    constructor(control, spellChecker) {
        this.control = control;
        this.spellChecker = spellChecker;
    }
    get isRepeatingError() { return this.misspelledInterval.errorInfo.errorType == SpellingErrorType.Repeating; }
    get canAddToDictionary() { return this.control.commandManager.getCommand(RichEditClientCommand.AddWordToDictionary).getState().enabled; }
    get suggestions() { return this.misspelledInterval.errorInfo.suggestions; }
    tryFindNextError() {
        this.misspelledInterval = this.spellChecker.findNextMisspelledInterval(this.control.selection.intervals[0].start);
        if (this.misspelledInterval) {
            this.control.selection.deprecatedSetSelection(this.misspelledInterval.start, this.misspelledInterval.end, false, -1, true);
            return true;
        }
        else {
            this.control.commandManager.getCommand(RichEditClientCommand.ShowSpellingCheckCompletedMessage).execute(this.control.commandManager.isPublicApiCall);
            return false;
        }
    }
    getContext() {
        return this.misspelledInterval.errorInfo.word;
    }
    ignoreOnce() {
        this.control.commandManager.getCommand(RichEditClientCommand.IgnoreSpellingError).execute(this.control.commandManager.isPublicApiCall);
    }
    ignoreAll() {
        this.control.commandManager.getCommand(RichEditClientCommand.IgnoreAllSpellingErrors).execute(this.control.commandManager.isPublicApiCall);
    }
    addToDictionary() {
        this.control.commandManager.getCommand(RichEditClientCommand.AddWordToDictionary).execute(this.control.commandManager.isPublicApiCall);
    }
    delete() {
        this.control.commandManager.getCommand(RichEditClientCommand.DeleteRepeatedWord).execute(this.control.commandManager.isPublicApiCall);
    }
    change(text) {
        this.control.commandManager.getCommand(RichEditClientCommand.ChangeSpellingError).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, text));
    }
    changeAll(text) {
        this.control.commandManager.getCommand(RichEditClientCommand.ChangeAllSpellingErrors).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, text));
    }
}
