import { HtmlTagImporterBase } from './base';
export class HtmlFontTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "FONT";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
