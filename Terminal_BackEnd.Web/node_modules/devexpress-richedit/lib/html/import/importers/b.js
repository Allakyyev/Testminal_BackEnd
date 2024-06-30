import { HtmlTagImporterBase } from './base';
export class HtmlBTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "B";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
