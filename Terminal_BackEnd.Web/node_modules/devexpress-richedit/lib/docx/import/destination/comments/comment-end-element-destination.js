import { CommentElementDestination } from './comment-element-destination';
export class CommentEndElementDestination extends CommentElementDestination {
    assignCommentPosition(comment) {
        const position = this.data.subDocumentInfo.positionImporter.currPosition;
        if (comment.start != position && comment.end == -1)
            comment.end = position;
    }
}
