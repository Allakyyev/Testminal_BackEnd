import { HtmlTagImporterBase } from './base';
export class HtmlCenterTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "CENTER";
    }
    importBefore() {
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
    }
}
