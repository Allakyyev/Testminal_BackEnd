import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class AssignShortcutCommandOptions extends CommandOptions {
    constructor(control, keyCode, callback) {
        super(control);
        this.keyCode = keyCode;
        this.callback = callback;
    }
}
export class AssignShortcutCommand extends CommandBase {
    isEnabled() {
        return super.isEnabled();
    }
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    executeCore(_state, options) {
        this.control.shortcutManager.assignShortcut(options.keyCode, options.callback);
        return true;
    }
}
