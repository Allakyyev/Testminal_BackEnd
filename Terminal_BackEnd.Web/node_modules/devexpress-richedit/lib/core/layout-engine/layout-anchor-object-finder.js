import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class LayoutAnchorObjectFinder {
    constructor(layout, pos, subDocId, findOnlyOnPage) {
        let pageIndex;
        let pageIndexEnd;
        if (findOnlyOnPage === undefined) {
            pageIndex = 0;
            pageIndexEnd = layout.validPageCount;
        }
        else {
            pageIndex = findOnlyOnPage;
            pageIndexEnd = Math.min(findOnlyOnPage + 1, layout.validPageCount);
        }
        for (let page; (page = layout.pages[pageIndex]) && pageIndex < pageIndexEnd; pageIndex++) {
            const obj = NumberMapUtils.elementBy(page.anchoredObjectHolder.objects, obj => layout.anchorObjectsPositionInfo.getPosition(obj.objectId) == pos && obj.belongsToSubDocId === subDocId);
            if (obj) {
                this.page = page;
                this.obj = obj;
                return;
            }
        }
    }
}
