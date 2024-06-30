import { HtmlTagImporterBase } from './base';
export class HtmlTbodyTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "TBODY";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
