import { HistoryItem } from '../base/history-item';
export class BookmarkHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, boundSubDocument, bkmTemplate) {
        super(modelManipulator);
        this.bkmTemplate = bkmTemplate;
        this.boundSubDocument = boundSubDocument;
    }
}
export class CreateBookmarkHistoryItem extends BookmarkHistoryItemBase {
    redo() {
        this.modelManipulator.bookmark.createBookmark(this.boundSubDocument, this.bkmTemplate, true);
    }
    undo() {
        this.modelManipulator.bookmark.deleteBookmark(this.boundSubDocument, this.bkmTemplate);
    }
}
export class DeleteBookmarkHistoryItem extends BookmarkHistoryItemBase {
    redo() {
        this.modelManipulator.bookmark.deleteBookmark(this.boundSubDocument, this.bkmTemplate);
    }
    undo() {
        this.modelManipulator.bookmark.createBookmark(this.boundSubDocument, this.bkmTemplate, true);
    }
}
