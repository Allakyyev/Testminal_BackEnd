import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../destination';
export class CommentElementDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = reader.getAttributeNS('id', this.data.constants.wordProcessingNamespaceConst);
            if (StringUtils.isNullOrEmpty(id))
                return;
            const comment = this.data.subDocumentInfo.commentsImporter.comments[id];
            if (comment)
                this.assignCommentPosition(comment);
        });
    }
}
