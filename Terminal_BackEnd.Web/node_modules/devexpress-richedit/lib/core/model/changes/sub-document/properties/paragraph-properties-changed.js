import { ModelChangeType } from '../../enums';
export class ParagraphPropertiesChangedSubDocumentChange {
    constructor(subDocumentId, paragraphIndex, paragraphInterval, properties, style, tabs, listInfo) {
        this.subDocumentId = subDocumentId;
        this.paragraphIndex = paragraphIndex;
        this.paragraphInterval = paragraphInterval;
        this.properties = properties;
        this.style = style;
        this.tabs = tabs;
        this.listInfo = listInfo;
        this.type = ModelChangeType.ParagraphPropertiesChanged;
    }
}
