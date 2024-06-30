import { HtmlTagImporterBase } from './base';
export class HtmlDivTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "DIV";
    }
    importBefore() {
        if (!this.importer.prevRunIsParagraph && this.importer.importStarted)
            this.importer.addParagraphRun(null, this.element);
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
        if (!this.importer.prevRunIsParagraph)
            this.importer.addParagraphRun(null, this.element);
    }
}
