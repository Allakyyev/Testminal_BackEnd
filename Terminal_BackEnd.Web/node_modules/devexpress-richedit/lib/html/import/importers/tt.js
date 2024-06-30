import { HtmlTagImporterBase } from './base';
export class HtmlTtTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "TT";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
