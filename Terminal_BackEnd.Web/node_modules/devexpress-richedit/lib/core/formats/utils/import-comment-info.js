import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Comment } from '../../model/comments/comment';
import { ImportBookmarkInfoCore } from './import-bookmark-info-core';
export class ImportCommentInfo extends ImportBookmarkInfoCore {
    constructor(subDocument) {
        super();
        this.comment = new Comment(subDocument.positionManager, new FixedInterval(0, 0));
        this.comment.date = Comment.minCommentDate;
    }
}
