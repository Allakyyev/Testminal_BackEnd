import { ModelChangeType } from '../../enums';
export class HyperlinkInfoChangedSubDocumentChange {
    constructor(subDocumentId, fieldResultInterval, fieldCodeInterval, newHyperlinkInfo) {
        this.subDocumentId = subDocumentId;
        this.fieldResultInterval = fieldResultInterval;
        this.fieldCodeInterval = fieldCodeInterval;
        this.newHyperlinkInfo = newHyperlinkInfo;
        this.type = ModelChangeType.HyperlinkInfoChanged;
    }
}
