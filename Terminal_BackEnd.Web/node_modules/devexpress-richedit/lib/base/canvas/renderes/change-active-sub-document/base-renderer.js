import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class BaseRenderer {
    constructor(renderer) {
        this.renderer = renderer;
        this.init();
    }
    init() {
        this.pageIndex = -2;
        this.subDocumentInfo = null;
        this.handledPages = {};
    }
    update(newSubDocumentInfo, newPageIndex) {
        this.innerUpdate(newSubDocumentInfo, newPageIndex, () => {
            const renderedPages = this.renderer.scroll.renderPageIndexInterval();
            const useCache = this.pageIndex == this.newPageIndex &&
                this.subDocumentInfo.subDocumentId == this.newSubDocumentInfo.subDocumentId;
            const handledPages = useCache ? this.handledPages : {};
            this.handledPages = {};
            NumberMapUtils.forEach(handledPages, (handledPageIndex) => {
                if (!renderedPages.contains(handledPageIndex))
                    if (!this.handlePageHide(handledPageIndex))
                        this.handledPages[handledPageIndex] = handledPageIndex;
            });
            ListUtils.forEachOnInterval(renderedPages, (renderedPageIndex) => {
                if (handledPages[renderedPageIndex] === undefined)
                    if (this.handlePageRender(renderedPageIndex, false))
                        this.handledPages[renderedPageIndex] = renderedPageIndex;
            });
        });
    }
    updatePage(pageIndex, newSubDocumentInfo, newPageIndex) {
        this.innerUpdate(newSubDocumentInfo, newPageIndex, () => {
            if (this.handlePageRender(pageIndex, true))
                this.handledPages[pageIndex] = pageIndex;
        });
    }
    innerUpdate(newSubDocumentInfo, newPageIndex, action) {
        if (newSubDocumentInfo) {
            this.newSubDocumentInfo = newSubDocumentInfo;
            this.newPageIndex = newPageIndex;
            action();
            this.subDocumentInfo = newSubDocumentInfo;
            this.pageIndex = newPageIndex;
        }
    }
    isHeaderFooterActive(layoutPage) {
        if (this.newSubDocumentInfo.isHeaderFooter)
            return true;
        if (!this.newSubDocumentInfo.isTextBox)
            return false;
        const paSdId = this.newSubDocumentInfo.parentSubDocumentId;
        const pa = layoutPage.otherPageAreas[paSdId];
        return pa && pa.subDocument.isHeaderFooter();
    }
}
