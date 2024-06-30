import { CodePages } from '../encoding/code-pages';
import { RtfCharset } from './character/enums';
import { RtfColorIndexCollection } from './color-collections';
export class RtfDocumentProperties {
    constructor() {
        this.charset = RtfCharset.Ansi;
        this.defaultCodePage = CodePages.default;
        this.colorIndexes = new RtfColorIndexCollection();
        this.listTable = [];
        this.listOverrideTable = [];
    }
}
