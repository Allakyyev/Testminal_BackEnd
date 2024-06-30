import { HeaderFooterType } from '../../section/enums';
import { HeaderFooterSubDocumentInfoBase } from '../../sub-document-infos';
import { ContentInsertedSubDocumentChange } from '../change-base';
import { ModelChangeType } from '../enums';
export declare class HeaderFooterCreatedModelChange extends ContentInsertedSubDocumentChange {
    isHeader: boolean;
    headerFooterType: HeaderFooterType;
    subDocumentInfo: HeaderFooterSubDocumentInfoBase;
    readonly type = ModelChangeType.HeaderFooterCreated;
    constructor(isHeader: boolean, headerFooterType: HeaderFooterType, subDocumentInfo: HeaderFooterSubDocumentInfoBase);
}
//# sourceMappingURL=header-created.d.ts.map