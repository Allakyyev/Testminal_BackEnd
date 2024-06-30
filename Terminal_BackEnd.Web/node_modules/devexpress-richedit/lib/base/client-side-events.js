export class ClientSideEvents {
    constructor(owner) {
        this.owner = owner;
    }
    raiseHyperlinkClick(evt, field) {
        return this.owner.raiseHyperlinkClick(evt, field);
    }
    raiseKeyDown(evt) {
        return this.owner.raiseKeyDown(evt);
    }
    raiseKeyUp(evt) {
        this.owner.raiseKeyUp(evt);
    }
    raisePointerDown(evt) {
        return this.owner.raisePointerDown(evt);
    }
    raisePointerUp(evt) {
        return this.owner.raisePointerUp(evt);
    }
    raiseContentInserted(subDocumentId, interval) {
        this.owner.raiseContentInserted(subDocumentId, interval);
    }
    raiseContentRemoved(subDocumentId, interval, removedText) {
        this.owner.raiseContentRemoved(subDocumentId, interval, removedText);
    }
    raiseCharacterPropertiesChanged(subDocumentId, interval) {
        this.owner.raiseCharacterPropertiesChanged(subDocumentId, interval);
    }
    raiseParagraphPropertiesChanged(subDocumentId, paragraphIndex) {
        this.owner.raiseParagraphPropertiesChanged(subDocumentId, paragraphIndex);
    }
    raiseAutoCorrect(text, interval) {
        return this.owner.raiseAutoCorrect(text, interval);
    }
    raiseDocumentChanged() {
        this.owner.raiseDocumentChanged();
    }
    raiseDocumentFormatted(pageCount) {
        this.owner.raiseDocumentFormatted(pageCount);
    }
    raiseActiveSubDocumentChanged() {
        this.owner.raiseActiveSubDocumentChanged();
    }
    raiseSelectionChanged() {
        this.owner.raiseSelectionChanged();
    }
    raiseDocumentLoaded() {
        this.owner.raiseDocumentLoaded();
    }
    raiseGotFocus() {
        this.owner.raiseGotFocus();
    }
    raiseLostFocus() {
        this.owner.raiseLostFocus();
    }
}
