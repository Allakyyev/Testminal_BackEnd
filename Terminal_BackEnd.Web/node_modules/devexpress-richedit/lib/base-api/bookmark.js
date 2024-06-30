import { RichEditClientCommand } from '../base/commands/client-command';
import { CommandSimpleOptions } from '../base/commands/command-base';
import { BookmarkApi } from '../model-api/bookmark';
export class BookmarkBaseApi extends BookmarkApi {
    constructor(core, subDocument, bookmark) {
        super(core, subDocument, bookmark);
        this._core = core;
    }
    goTo() {
        const command = this._core.commandManager.getCommand(RichEditClientCommand.GoToBookmark);
        const options = new CommandSimpleOptions(this._core, this._bookmark.name);
        command.execute(true, options);
    }
}
