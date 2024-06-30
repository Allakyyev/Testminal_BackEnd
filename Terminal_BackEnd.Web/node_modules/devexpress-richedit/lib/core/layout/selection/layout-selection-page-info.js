export class LayoutSelectionPageInfo {
    constructor() {
        this.oldItems = [];
        this.newItems = [];
        this.isChanged = false;
    }
    beforeRecreatePageSelection() {
        this.newItems = [];
        this.isChanged = this.oldItems.length > 0;
    }
    changesCollected() {
        if (this.isChanged) {
            this.oldItems = this.newItems;
            this.newItems = [];
            this.isChanged = false;
        }
    }
}
