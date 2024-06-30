import { HistoryItem } from '../base/history-item';
export class SwitchTextBoxSubDocumentsStateHistoryItem extends HistoryItem {
    constructor(modelManipulator, oldSubDocument, textBoxParentSubDocument, position) {
        super(modelManipulator);
        this.oldSubDocument = oldSubDocument;
        this.textBoxParentSubDocument = textBoxParentSubDocument;
        this.position = position;
    }
    redo() {
        this.oldSubDocument = this.oldSubDocument.getActualSubDocument();
        const newRun = this.textBoxParentSubDocument.getRunAndIndexesByPosition(this.position).run;
        this.newSubDocument = this.modelManipulator.model.subDocuments[newRun.subDocId];
        this.modelManipulator.model.subDocumentsCollection.replace(this.oldSubDocument.id, this.newSubDocument.id);
        this.copyPropertiesToLastParagraph(this.oldSubDocument, this.newSubDocument);
    }
    undo() {
        this.modelManipulator.model.subDocumentsCollection.replace(this.newSubDocument.id, this.oldSubDocument.id);
    }
    copyPropertiesToLastParagraph(sourceSubDocument, targetSubDocument) {
        const newParagraph = targetSubDocument.paragraphs[targetSubDocument.paragraphs.length - 1];
        const oldParagraph = sourceSubDocument.paragraphs[targetSubDocument.paragraphs.length - 1];
        this.modelManipulator.paragraph.applyParagraphProperties(newParagraph, oldParagraph, false, oldParagraph.getParagraphBundleFull(sourceSubDocument.documentModel));
    }
}
