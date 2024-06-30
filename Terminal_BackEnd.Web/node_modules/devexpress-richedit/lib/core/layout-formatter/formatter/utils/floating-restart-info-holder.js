import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class FloatingRestartInfoHolder {
    constructor() {
        this.anchorRestartFromPageIndex = -1;
        this.oldAnchorObjectsFromPage = {};
        this.oldOtherTextBoxPageAreas = {};
        this.init();
    }
    init() {
        this.anchorRestartFromPageIndex = -1;
        this.oldAnchorObjectsFromPage = {};
        this.oldOtherTextBoxPageAreas = {};
    }
    storeInfo(lp) {
        this.anchorRestartFromPageIndex = lp.pageIndex;
        this.oldAnchorObjectsFromPage = lp.page.anchoredObjectHolder.objects;
        this.oldOtherTextBoxPageAreas = NumberMapUtils.reducedMap(lp.page.otherPageAreas, (pa) => pa.subDocument.isTextBox() ? pa : null);
        this.oldTableAnchorObjects = lp.page.tableAnchoredObjectsHolder.holder;
    }
    get isRestartByAnchorObjects() {
        return this.anchorRestartFromPageIndex != -1;
    }
    setCalculatedObjects(lp) {
        if (this.isRestartByAnchorObjects) {
            if (this.anchorRestartFromPageIndex == lp.pageIndex) {
                lp.page.anchoredObjectHolder.objects = this.oldAnchorObjectsFromPage;
                NumberMapUtils.forEach(this.oldOtherTextBoxPageAreas, (textBoxPA) => lp.page.otherPageAreas[textBoxPA.subDocument.id] = textBoxPA);
                lp.page.tableAnchoredObjectsHolder.holder = this.oldTableAnchorObjects;
            }
            this.init();
        }
    }
}
