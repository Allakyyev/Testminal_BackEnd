import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class ParagraphInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, position, paragraph) {
        super(subDocumentId, position, 1);
        this.paragraph = paragraph;
        this.type = ModelChangeType.ParagraphInserted;
    }
}
