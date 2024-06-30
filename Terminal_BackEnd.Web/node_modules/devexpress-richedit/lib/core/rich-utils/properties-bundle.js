import { NumberingList } from '../model/numbering-lists/numbering-list';
export class PropertiesBundle {
    constructor(properties, style) {
        this.props = properties;
        this.style = style;
    }
}
export class ParagraphListInfo {
    constructor(numbericListIndex, listLevelIndex) {
        this.numberingListIndex = numbericListIndex;
        this.listLevelIndex = listLevelIndex;
    }
    static get default() {
        return new ParagraphListInfo(NumberingList.NumberingListNotSettedIndex, -1);
    }
    clone() {
        return new ParagraphListInfo(this.numberingListIndex, this.listLevelIndex);
    }
}
export class MaskedCharacterPropertiesBundle extends PropertiesBundle {
}
export class MaskedParagraphPropertiesBundle extends PropertiesBundle {
}
export class MaskedParagraphPropertiesBundleFull extends PropertiesBundle {
    constructor(properties, style, listInfo, tabs) {
        super(properties, style);
        this.listInfo = listInfo;
        this.tabs = tabs;
    }
    static get notSetted() {
        return new MaskedParagraphPropertiesBundleFull(undefined, undefined, undefined, undefined);
    }
}
