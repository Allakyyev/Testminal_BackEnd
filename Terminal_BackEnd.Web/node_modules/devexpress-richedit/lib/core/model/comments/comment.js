import { BookmarkBase } from '../bookmarks';
export class Comment extends BookmarkBase {
    constructor(positionManager, interval) {
        super(positionManager, interval);
    }
}
Comment.minCommentDate = new Date(1900, 1, 1);
