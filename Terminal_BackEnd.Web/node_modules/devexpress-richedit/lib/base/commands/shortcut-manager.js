import { Browser } from '@devexpress/utils/lib/browser';
import { Errors } from '@devexpress/utils/lib/errors';
import { KeyCode, ModifierKey } from '@devexpress/utils/lib/utils/key';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from './client-command';
import { ClipboardCommand } from './text/clipboard-commands';
export class ShortcutManager {
    constructor(commandManager, control) {
        this.knownNonCommandShortcuts = {};
        this.control = control;
        this.init(commandManager);
    }
    init(commandManager) {
        this.knownNonCommandShortcuts = {};
        this.knownNonCommandShortcuts[KeyCode.Esc] = true;
        this.shortcuts = {};
        this.createShortcut(commandManager, RichEditClientCommand.ClearFormatting, [ModifierKey.Ctrl | KeyCode.Space], [ModifierKey.Ctrl | KeyCode.Space]);
        this.createShortcut(commandManager, RichEditClientCommand.CopySelection, [ModifierKey.Ctrl | KeyCode.Key_c], [ModifierKey.Meta | KeyCode.Key_c, KeyCode.F3]);
        this.createShortcut(commandManager, RichEditClientCommand.CreateField, [ModifierKey.Ctrl | KeyCode.F9], [ModifierKey.Meta | KeyCode.F9]);
        this.createShortcut(commandManager, RichEditClientCommand.CutSelection, [ModifierKey.Ctrl | KeyCode.Key_x], [ModifierKey.Meta | KeyCode.Key_x, KeyCode.F2]);
        this.createShortcut(commandManager, RichEditClientCommand.DecreaseIndent, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Key_m], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Key_m]);
        this.createShortcut(commandManager, RichEditClientCommand.DocumentEnd, [ModifierKey.Ctrl | KeyCode.End], [ModifierKey.Meta | KeyCode.End]);
        this.createShortcut(commandManager, RichEditClientCommand.DocumentStart, [ModifierKey.Ctrl | KeyCode.Home], [ModifierKey.Meta | KeyCode.Home]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendDocumentEnd, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.End], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.End]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendDocumentStart, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Home], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Home]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToEndParagraph, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Down], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Down]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToNextWord, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Right], [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Right]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToPrevWord, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Left], [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Left]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToStartParagraph, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Up], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Up]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendLineDown, [ModifierKey.Shift | KeyCode.Down], [ModifierKey.Shift | KeyCode.Down]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendLineEnd, [ModifierKey.Shift | KeyCode.End], [ModifierKey.Shift | KeyCode.End]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendLineStart, [ModifierKey.Shift | KeyCode.Home], [ModifierKey.Shift | KeyCode.Home]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendLineUp, [ModifierKey.Shift | KeyCode.Up], [ModifierKey.Shift | KeyCode.Up]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendNextCharacter, [ModifierKey.Shift | KeyCode.Right], [ModifierKey.Shift | KeyCode.Right]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendNextPage, [ModifierKey.Shift | KeyCode.PageDown], [ModifierKey.Shift | KeyCode.PageDown]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendPreviousCharacter, [ModifierKey.Shift | KeyCode.Left], [ModifierKey.Shift | KeyCode.Left]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendPreviousPage, [ModifierKey.Shift | KeyCode.PageUp], [ModifierKey.Shift | KeyCode.PageUp]);
        this.createShortcut(commandManager, RichEditClientCommand.FullScreen, [KeyCode.F11, ModifierKey.Ctrl | KeyCode.F10], [KeyCode.F11]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToEndParagraph, [ModifierKey.Ctrl | KeyCode.Down], [ModifierKey.Meta | KeyCode.Down]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToNextWord, [ModifierKey.Ctrl | KeyCode.Right], [ModifierKey.Meta | KeyCode.Right]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToPrevWord, [ModifierKey.Ctrl | KeyCode.Left], [ModifierKey.Meta | KeyCode.Left]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToStartParagraph, [ModifierKey.Ctrl | KeyCode.Up], [ModifierKey.Meta | KeyCode.Up]);
        this.createShortcut(commandManager, RichEditClientCommand.IncreaseIndent, [ModifierKey.Ctrl | KeyCode.Key_m], [ModifierKey.Meta | KeyCode.Key_m]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertColumnBreak, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Enter], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Enter]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertLineBreak, [ModifierKey.Shift | KeyCode.Enter], [ModifierKey.Shift | KeyCode.Enter]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertPageBreak, [ModifierKey.Ctrl | KeyCode.Enter], [ModifierKey.Meta | KeyCode.Enter]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertParagraph, [KeyCode.Enter], [KeyCode.Enter]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertShiftTabMark, [ModifierKey.Shift | KeyCode.Tab], [ModifierKey.Shift | KeyCode.Tab]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertSpace, [KeyCode.Space], [KeyCode.Space, ModifierKey.Shift | KeyCode.Space]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertTabMark, [KeyCode.Tab], [KeyCode.Tab]);
        this.createShortcut(commandManager, RichEditClientCommand.LineDown, [KeyCode.Down], [KeyCode.Down]);
        this.createShortcut(commandManager, RichEditClientCommand.LineEnd, [KeyCode.End], [KeyCode.End]);
        this.createShortcut(commandManager, RichEditClientCommand.LineStart, [KeyCode.Home], [KeyCode.Home]);
        this.createShortcut(commandManager, RichEditClientCommand.LineUp, [KeyCode.Up], [KeyCode.Up]);
        this.createShortcut(commandManager, RichEditClientCommand.NextCharacter, [KeyCode.Right], [KeyCode.Right]);
        this.createShortcut(commandManager, RichEditClientCommand.NextPage, [KeyCode.PageDown], [KeyCode.PageDown]);
        this.createShortcut(commandManager, RichEditClientCommand.PasteSelection, [ModifierKey.Ctrl | KeyCode.Key_v, ModifierKey.Shift | KeyCode.Insert], [ModifierKey.Meta | KeyCode.Key_v, KeyCode.F4]);
        this.createShortcut(commandManager, RichEditClientCommand.PreviousCharacter, [KeyCode.Left], [KeyCode.Left]);
        this.createShortcut(commandManager, RichEditClientCommand.PreviousPage, [KeyCode.PageUp], [KeyCode.PageUp]);
        this.createShortcut(commandManager, RichEditClientCommand.Redo, [ModifierKey.Ctrl | KeyCode.Key_y], [ModifierKey.Meta | KeyCode.Key_y]);
        this.createShortcut(commandManager, RichEditClientCommand.SelectAll, [ModifierKey.Ctrl | KeyCode.Key_a], [ModifierKey.Meta | KeyCode.Key_a]);
        this.createShortcut(commandManager, RichEditClientCommand.SetDoubleParagraphSpacing, [ModifierKey.Ctrl | KeyCode.Key_2], [ModifierKey.Meta | KeyCode.Key_2]);
        this.createShortcut(commandManager, RichEditClientCommand.SetSesquialteralParagraphSpacing, [ModifierKey.Ctrl | KeyCode.Key_5], [ModifierKey.Meta | KeyCode.Key_5]);
        this.createShortcut(commandManager, RichEditClientCommand.SetSingleParagraphSpacing, [ModifierKey.Ctrl | KeyCode.Key_1], [ModifierKey.Meta | KeyCode.Key_1]);
        this.createShortcut(commandManager, RichEditClientCommand.ShowFontForm, [ModifierKey.Ctrl | KeyCode.Key_d], [ModifierKey.Meta | KeyCode.Key_d]);
        this.createShortcut(commandManager, RichEditClientCommand.ShowHyperlinkForm, [ModifierKey.Ctrl | KeyCode.Key_k], [ModifierKey.Meta | KeyCode.Key_k]);
        this.createShortcut(commandManager, RichEditClientCommand.Find, [ModifierKey.Ctrl | KeyCode.Key_f], [ModifierKey.Meta | KeyCode.Key_f]);
        this.createShortcut(commandManager, RichEditClientCommand.Replace, [ModifierKey.Ctrl | KeyCode.Key_h], [ModifierKey.Meta | KeyCode.Key_h]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleAllFields, [ModifierKey.Alt | KeyCode.F9], [ModifierKey.Alt | KeyCode.F9]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleBackspaceKey, [KeyCode.Backspace], [KeyCode.Backspace]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleDeleteKey, [KeyCode.Delete], [KeyCode.Delete]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFieldCodes, [ModifierKey.Shift | KeyCode.F9], [ModifierKey.Shift | KeyCode.F9]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFontItalic, [ModifierKey.Ctrl | KeyCode.Key_i], [ModifierKey.Meta | KeyCode.Key_i]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFontSubscript, [ModifierKey.Ctrl | KeyCode.Equals], [ModifierKey.Meta | KeyCode.Equals]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFontSuperscript, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Equals], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.Equals]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFontUnderline, [ModifierKey.Ctrl | KeyCode.Key_u], [ModifierKey.Meta | KeyCode.Key_u]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleParagraphAlignmentCenter, [ModifierKey.Ctrl | KeyCode.Key_e], [ModifierKey.Meta | KeyCode.Key_e]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleParagraphAlignmentJustify, [ModifierKey.Ctrl | KeyCode.Key_j], [ModifierKey.Meta | KeyCode.Key_j]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleParagraphAlignmentLeft, [ModifierKey.Ctrl | KeyCode.Key_l], [ModifierKey.Meta | KeyCode.Key_l]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleParagraphAlignmentRight, [ModifierKey.Ctrl | KeyCode.Key_r], [ModifierKey.Meta | KeyCode.Key_r]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleShowWhitespace, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Key_8], [ModifierKey.Meta | KeyCode.Key_8]);
        this.createShortcut(commandManager, RichEditClientCommand.Undo, [ModifierKey.Ctrl | KeyCode.Key_z], [ModifierKey.Meta | KeyCode.Key_z, KeyCode.F1]);
        this.createShortcut(commandManager, RichEditClientCommand.UpdateField, [KeyCode.F9], [KeyCode.F9]);
        this.createShortcut(commandManager, RichEditClientCommand.ToggleFontBold, [ModifierKey.Ctrl | KeyCode.Key_b], [ModifierKey.Meta | KeyCode.Key_b]);
        this.createShortcut(commandManager, RichEditClientCommand.InsertNonBreakingSpace, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Space], [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Space]);
        this.createShortcut(commandManager, RichEditClientCommand.RemoveHyperlinks, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.F9], [ModifierKey.Meta | ModifierKey.Shift | KeyCode.F9]);
        this.createShortcut(commandManager, RichEditClientCommand.CreateDateField, [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Key_d], [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Key_d]);
        this.createShortcut(commandManager, RichEditClientCommand.CreatePageField, [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Key_p], [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Key_p]);
        this.createShortcut(commandManager, RichEditClientCommand.CreateTimeField, [ModifierKey.Alt | ModifierKey.Shift | KeyCode.Key_t], [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.Key_t]);
        this.createShortcut(commandManager, RichEditClientCommand.SwitchTextCase, [ModifierKey.Shift | KeyCode.F3], [ModifierKey.Shift | KeyCode.F3]);
        this.createShortcut(commandManager, RichEditClientCommand.ShowSpellCheckerForm, [KeyCode.F7], [KeyCode.F7]);
        this.createShortcut(commandManager, RichEditClientCommand.RemoveNextWord, [ModifierKey.Ctrl | KeyCode.Delete], [ModifierKey.Ctrl | KeyCode.Delete]);
        this.createShortcut(commandManager, RichEditClientCommand.RemovePrevWord, [ModifierKey.Ctrl | KeyCode.Backspace], [ModifierKey.Ctrl | KeyCode.Backspace]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToStartNextPage, [ModifierKey.Ctrl | KeyCode.PageDown], [ModifierKey.Ctrl | KeyCode.PageDown]);
        this.createShortcut(commandManager, RichEditClientCommand.GoToStartPrevPage, [ModifierKey.Ctrl | KeyCode.PageUp], [ModifierKey.Ctrl | KeyCode.PageUp]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToStartNextPage, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.PageDown], [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.PageDown]);
        this.createShortcut(commandManager, RichEditClientCommand.ExtendGoToStartPrevPage, [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.PageUp], [ModifierKey.Ctrl | ModifierKey.Shift | KeyCode.PageUp]);
    }
    createShortcut(commandManager, commandId, winShortcuts, macOSShortcuts) {
        ListUtils.forEach(Browser.MacOSPlatform ? (macOSShortcuts ? macOSShortcuts : []) : (winShortcuts ? winShortcuts : []), (keyCode) => this.shortcuts[keyCode] = new CommandHolder(commandManager.getCommand(commandId)));
    }
    processShortcut(keyCode) {
        const commandHolder = this.shortcuts[keyCode];
        if (!commandHolder || this.denyThisTabKeyCode(keyCode))
            return false;
        commandHolder.executeCommand(this);
        return true;
    }
    isKnownShortcut(keyCode) {
        return (!!this.shortcuts[keyCode] || this.knownNonCommandShortcuts[keyCode]) && !this.denyThisTabKeyCode(keyCode);
    }
    isClipboardCommandShortcut(keyCode) {
        const commandHolder = this.shortcuts[keyCode];
        return commandHolder ? commandHolder.isClipboardCommand() : false;
    }
    assignShortcut(keyCode, callback) {
        this.shortcuts[keyCode] = new UserDefinedFunctionHolder(callback);
    }
    denyThisTabKeyCode(keyCode) {
        return !this.control.modelManager.richOptions.control.acceptsTab && ShortcutManager.pressTabKeyCode(keyCode);
    }
    static pressTabKeyCode(keyCode) {
        return keyCode === KeyCode.Tab || keyCode === (ModifierKey.Shift | KeyCode.Tab);
    }
}
export class CommandHolderBase {
    executeCommand(shortcutManager) {
        shortcutManager.lastCommandExecutedByShortcut = true;
        this.callExecuteCommand();
        shortcutManager.lastCommandExecutedByShortcut = false;
    }
    callExecuteCommand() {
        throw new Error(Errors.NotImplemented);
    }
    isClipboardCommand() {
        throw new Error(Errors.NotImplemented);
    }
}
export class CommandHolder extends CommandHolderBase {
    constructor(command) {
        super();
        this.command = command;
    }
    callExecuteCommand() {
        this.command.execute(false);
    }
    isClipboardCommand() {
        return this.command instanceof ClipboardCommand;
    }
}
export class UserDefinedFunctionHolder extends CommandHolderBase {
    constructor(userCommandCallback) {
        super();
        this.userCommandCallback = userCommandCallback;
    }
    callExecuteCommand() {
        this.userCommandCallback();
    }
    isClipboardCommand() {
        return false;
    }
}
