import { ContentInsertedSubDocumentChange } from '../change-base';
import { ModelChangeType } from '../enums';
export class HeaderFooterCreatedModelChange extends ContentInsertedSubDocumentChange {
    constructor(isHeader, headerFooterType, subDocumentInfo) {
        super(subDocumentInfo.subDocumentId, 0, 1);
        this.isHeader = isHeader;
        this.headerFooterType = headerFooterType;
        this.subDocumentInfo = subDocumentInfo;
        this.type = ModelChangeType.HeaderFooterCreated;
    }
}
