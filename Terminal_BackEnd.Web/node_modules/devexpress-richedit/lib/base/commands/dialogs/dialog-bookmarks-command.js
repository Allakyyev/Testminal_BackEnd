import { ConstBookmark } from '../../../core/model/bookmarks';
import { ControlOptions } from '../../../core/model/options/control';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ReadOnlyMode } from '../../interfaces/i-rich-edit-core';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogBookmarksCommand extends ShowDialogCommandBase {
    getState() {
        const state = new SimpleCommandState(this.isEnabled());
        state.visible = ControlOptions.isVisible(this.control.modelManager.richOptions.control.bookmarks);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.bookmarks) && this.selection.intervals.length === 1;
    }
    createParameters(_options) {
        const parameters = new BookmarksDialogParameters();
        parameters.bookmarks = ListUtils.map(this.control.modelManager.model.getAllBookmarks(false), (bm) => new BookmarkDialogInfo(bm.name, bm.start));
        parameters.allowedEditBookmarks = this.control.readOnly != ReadOnlyMode.Persistent;
        const selectedBookmarks = this.control.selection.activeSubDocument.findBookmarkByInterval(this.control.selection.intervals, false);
        parameters.selectedBookmarkName = selectedBookmarks.length ? selectedBookmarks[selectedBookmarks.length - 1].name : null;
        return parameters;
    }
    applyParameters(_state, newParams) {
        if (newParams.newBookmarkName) {
            this.control.commandManager.getCommand(RichEditClientCommand.CreateBookmark)
                .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, new ConstBookmark(this.selection.intervals[0], newParams.newBookmarkName)));
        }
        else if (newParams.deletedBookmarkNames.length > 0)
            this.control.commandManager.getCommand(RichEditClientCommand.DeleteBookmarks).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, newParams.deletedBookmarkNames));
        return true;
    }
    getDialogName() {
        return "Bookmarks";
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class BookmarkDialogInfo {
    constructor(name, start) {
        this.name = name;
        this.start = start;
    }
}
export class BookmarksDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.bookmarks = obj.bookmarks;
        this.deletedBookmarkNames = obj.deletedBookmarkNames;
        this.newBookmarkName = obj.newBookmarkName;
        this.allowedEditBookmarks = obj.allowedEditBookmarks;
    }
    clone() {
        const newInstance = new BookmarksDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
