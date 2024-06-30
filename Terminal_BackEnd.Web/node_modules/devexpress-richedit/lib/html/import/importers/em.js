import { HtmlTagImporterBase } from './base';
export class HtmlEmTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "EM";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
