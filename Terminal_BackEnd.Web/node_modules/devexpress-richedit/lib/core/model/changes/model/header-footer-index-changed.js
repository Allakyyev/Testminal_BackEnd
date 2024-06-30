import { ModelChangeType } from '../enums';
export class HeaderFooterIndexChangedModelChange {
    constructor(sectionIndex, isHeader, headerFooterType, newIndex) {
        this.sectionIndex = sectionIndex;
        this.isHeader = isHeader;
        this.headerFooterType = headerFooterType;
        this.newIndex = newIndex;
        this.type = ModelChangeType.HeaderFooterIndexChanged;
    }
}
