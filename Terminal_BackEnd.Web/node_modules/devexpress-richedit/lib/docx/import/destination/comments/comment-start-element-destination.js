import { CommentElementDestination } from './comment-element-destination';
export class CommentStartElementDestination extends CommentElementDestination {
    assignCommentPosition(comment) {
        if (comment.start == -1)
            comment.start = this.data.subDocumentInfo.positionImporter.currPosition;
    }
}
