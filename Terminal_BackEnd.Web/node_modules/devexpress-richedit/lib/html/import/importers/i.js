import { HtmlTagImporterBase } from './base';
export class HtmlITagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "I";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
