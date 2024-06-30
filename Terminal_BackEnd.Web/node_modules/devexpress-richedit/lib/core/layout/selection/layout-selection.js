import { LayoutPageFlags } from '../main-structures/layout-page';
import { LayoutSelectionInfo } from './layout-selection-info';
export class LayoutSelection {
    constructor(subDocumentInfo, pageIndex, innerClientProperties) {
        this.subDocumentInfo = null;
        this.pageIndex = -1;
        this.firstPageIndexWithSelection = 0;
        this.lastPageIndexWithSelection = 0;
        this.selectionInfo = new LayoutSelectionInfo(LayoutPageFlags.IsSelectionRendered, innerClientProperties);
        this.searchInfo = new LayoutSelectionInfo(LayoutPageFlags.IsSearchSelectionRendered, innerClientProperties);
        this.misspelledInfo = new LayoutSelectionInfo(LayoutPageFlags.IsMisspelledSelectionRendered, innerClientProperties);
        this.rangePermissionInfo = new LayoutSelectionInfo(LayoutPageFlags.IsRangePermissionsRendered, innerClientProperties);
        this.subDocumentInfo = subDocumentInfo;
        this.pageIndex = pageIndex;
    }
    updatePageIndexWithSelection() {
        this.firstPageIndexWithSelection = -1;
        this.lastPageIndexWithSelection = 0;
        for (let pageIndex = 0, pageInfo; pageInfo = this.selectionInfo.pageInfos[pageIndex]; pageIndex++) {
            if (pageInfo.oldItems.length) {
                if (this.firstPageIndexWithSelection < 0)
                    this.firstPageIndexWithSelection = pageIndex;
                this.lastPageIndexWithSelection = pageIndex;
            }
        }
    }
}
