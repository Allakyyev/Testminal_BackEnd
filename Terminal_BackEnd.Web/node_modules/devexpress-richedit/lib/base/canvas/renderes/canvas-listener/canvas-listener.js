import { LayoutColumnChangesMerger, LayoutPageAreaChangesMerger, LayoutParagraphFrameChangesMerger, LayoutRowChangesMerger, LayoutTableChangesMerger } from '../../../../core/layout-formatter/changes/engine/changes-merger';
export class CanvasListener {
    constructor(viewManager, renderer) {
        this.viewManager = viewManager;
        this.renderer = renderer;
    }
    get layout() { return this.viewManager.layout; }
    closeDocument() {
    }
    static mergeInnerPageChanges(pageChange) {
        pageChange.mainPageAreaChanges = new LayoutPageAreaChangesMerger().merge(pageChange.mainPageAreaChanges);
        for (let pageAreaChange of pageChange.mainPageAreaChanges) {
            pageAreaChange.columnChanges = new LayoutColumnChangesMerger().merge(pageAreaChange.columnChanges);
            for (let columnChanges of pageAreaChange.columnChanges) {
                columnChanges.rowChanges = new LayoutRowChangesMerger().merge(columnChanges.rowChanges);
                columnChanges.tableChanges = new LayoutTableChangesMerger().merge(columnChanges.tableChanges);
                columnChanges.paragraphFrameChanges = new LayoutParagraphFrameChangesMerger().merge(columnChanges.paragraphFrameChanges);
            }
        }
    }
}
