import { HtmlTagImporterBase } from './base';
export class HtmlCiteTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "CITE";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
