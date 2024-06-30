import { Bookmark } from '../../core/model/bookmarks';
import { CreateBookmarkHistoryItem, DeleteBookmarkHistoryItem } from '../../core/model/history/items/bookmark-history-items';
import { BookmarksManipulator } from '../../core/model/manipulators/bookmarks-manipulator';
import { ControlOptions } from '../../core/model/options/control';
import { RelativePosition, ScrollState } from '../scroll/model-states';
import { SetSelectionParams } from '../selection/set-selection-params';
import { RichEditClientCommand } from './client-command';
import { CommandBase, CommandOptions, CommandSimpleOptions } from './command-base';
import { SimpleCommandState } from './command-states';
export class CreateBookmarkCommandParameter extends CommandOptions {
    constructor(control, bkmTemplate) {
        super(control);
        this.bkmTemplate = bkmTemplate;
    }
}
export class BookmarkCommandBase extends CommandBase {
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.bookmarks);
    }
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
}
export class CreateBookmarkCommand extends BookmarkCommandBase {
    executeCore(_state, parameter) {
        const bkmTemplate = parameter.param;
        const subDocument = parameter.subDocument;
        if (!Bookmark.isValidName(bkmTemplate.name, true))
            return false;
        this.history.beginTransaction();
        const bkmInfo = BookmarksManipulator.findBookmark(this.control.modelManager.model.subDocuments, bkmTemplate.name);
        if (bkmInfo)
            this.history.addAndRedo(new DeleteBookmarkHistoryItem(this.modelManipulator, bkmInfo.subDocument, bkmInfo.bookmark.constBookmark));
        this.history.addAndRedo(new CreateBookmarkHistoryItem(this.modelManipulator, subDocument, bkmTemplate));
        this.history.endTransaction();
        return true;
    }
}
export class DeleteBookmarksCommand extends BookmarkCommandBase {
    executeCore(_state, parameter) {
        const bookmarkNames = parameter.param;
        this.history.beginTransaction();
        let changed = false;
        for (let name of bookmarkNames) {
            const bookmarkInfo = BookmarksManipulator.findBookmark(this.control.modelManager.model.subDocuments, name);
            if (!bookmarkInfo)
                continue;
            this.history.addAndRedo(new DeleteBookmarkHistoryItem(this.modelManipulator, bookmarkInfo.subDocument, bookmarkInfo.bookmark.constBookmark));
            changed = true;
        }
        this.history.endTransaction();
        return changed;
    }
}
export class GoToBookmarkCommand extends BookmarkCommandBase {
    executeCore(_state, parameter) {
        const obj = BookmarksManipulator.findBookmark(this.control.modelManager.model.subDocuments, parameter.param);
        if (!obj)
            return false;
        const selection = this.selection;
        const subDocument = obj.subDocument;
        const bookmark = obj.bookmark;
        this.changeSubDocument(subDocument);
        selection.setSelection(new SetSelectionParams()
            .setInterval(bookmark.interval)
            .setEndOfLine(false)
            .setCorrectIntervalDueToFields(true)
            .setCorrectIntervalDueToTables(true));
        selection.scrollManager.setScroll(new ScrollState().byModelPosition(selection)
            .setModelPosition(bookmark.start)
            .setRelativePosition(RelativePosition.Top)
            .setVerticalOffset((sizes) => -Math.ceil(sizes.getVisibleAreaHeight(false) / 4)));
        return true;
    }
    changeSubDocument(subDocument) {
        if (this.selection.activeSubDocument == subDocument)
            return;
        if (subDocument.isMain())
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain)
                .execute(this.control.commandManager.isPublicApiCall);
        else
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterBySubDocument)
                .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, subDocument));
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
