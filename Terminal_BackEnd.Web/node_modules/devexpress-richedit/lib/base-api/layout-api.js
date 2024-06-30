import { RichEditClientCommand } from '../base/commands/client-command';
export class RichEditLayoutApi {
    constructor(core) {
        this._core = core;
    }
    get showHiddenSymbols() {
        return this._core.innerClientProperties.showHiddenSymbols;
    }
    set showHiddenSymbols(value) {
        const command = this._core.commandManager.getCommand(RichEditClientCommand.ToggleShowWhitespace);
        command.execute(true, value);
    }
    get showTableGridLines() {
        return this._core.innerClientProperties.showTableGridLines;
    }
    set showTableGridLines(value) {
        const command = this._core.commandManager.getCommand(RichEditClientCommand.ToggleShowTableGridLines);
        command.execute(true, value);
    }
}
