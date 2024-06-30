import { BookmarkEndElementDestination } from '../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../bookmark/bookmark-start-element-destination';
import { CommentEndElementDestination } from '../comments/comment-end-element-destination';
import { CommentStartElementDestination } from '../comments/comment-start-element-destination';
import { CustomXmlDestination, ElementDestination, EmptyDestination } from '../destination';
import { RangePermissionEndElementDestination } from '../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../runs/inserted-run-content-destination';
import { StructuredDocumentDestination } from '../structured-document-destination';
export class BodyDestinationBase extends ElementDestination {
    static onBookmarkStart(data, _reader) {
        return new BookmarkStartElementDestination(data);
    }
    static onBookmarkEnd(data, _reader) {
        return new BookmarkEndElementDestination(data);
    }
    static onRangePermissionStart(data, _reader) {
        return new RangePermissionStartElementDestination(data);
    }
    static onRangePermissionEnd(data, _reader) {
        return new RangePermissionEndElementDestination(data);
    }
    static onCommentStart(data, _reader) {
        return new CommentStartElementDestination(data);
    }
    static onCommentEnd(data, _reader) {
        return new CommentEndElementDestination(data);
    }
    static onStructuredDocument(data, _reader) {
        return new StructuredDocumentDestination(data);
    }
    static onCustomXml(data, _reader) {
        return new CustomXmlDestination(data);
    }
    static onDeleted(data, _reader) {
        return data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data);
    }
    static onInserted(data, _reader) {
        return data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data);
    }
}
