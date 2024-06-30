import { NumberingFormat } from '../../../../core/model/numbering-lists/list-level-properties';
export class PageNumberingInfo {
    constructor() {
        this.chapterSeparator = "";
        this.numberingFormat = NumberingFormat.None;
        this.firstPageNumber = -1;
        this.continueNumbering = true;
    }
    copyFrom(obj) {
        this.chapterSeparator = obj.chapterSeparator;
        this.chapterHeaderStyle = obj.chapterHeaderStyle;
        this.numberingFormat = obj.numberingFormat;
        this.firstPageNumber = obj.firstPageNumber;
        this.continueNumbering = obj.continueNumbering;
    }
}
