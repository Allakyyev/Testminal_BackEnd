import { DocumentRenderer } from './document-renderer';
export class PrintLayoutRenderer extends DocumentRenderer {
    renderPageContentGetFloatingObjects(page) {
        return page.anchoredObjectHolder.getObjectsForRenderer(this.viewManager.layout.anchorObjectsPositionInfo);
    }
}
