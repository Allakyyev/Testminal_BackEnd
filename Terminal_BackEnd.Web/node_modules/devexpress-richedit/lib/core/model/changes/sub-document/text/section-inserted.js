import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class SectionInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, position, section, sectionIndex) {
        super(subDocumentId, position, 1);
        this.section = section;
        this.sectionIndex = sectionIndex;
        this.type = ModelChangeType.SectionInserted;
    }
}
