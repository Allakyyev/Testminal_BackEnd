import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { PageChangesCollector } from '../../changes/engine/page-changes-collector';
export class LayoutDependentRunCache {
    constructor(manager) {
        this.manager = manager;
        this.reset();
    }
    reset() {
        this.cache = {};
    }
    add(pageIndex, subDocId) {
        const val = this.cache[pageIndex];
        if (!val)
            this.cache[pageIndex] = [subDocId];
        else if (!ListUtils.unsafeAnyOf(val, (v) => v == subDocId))
            val.push(subDocId);
    }
    recalculateHeaderFooterPageAreas() {
        const pages = this.manager.layout.pages;
        NumberMapUtils.forEach(this.cache, (listOfSubDocId, pageIndex) => {
            const page = pages[pageIndex];
            if (!page)
                return;
            const oldPageAreas = NumberMapUtils.shallowCopy(page.otherPageAreas);
            ListUtils.forEach(listOfSubDocId, (subDocId) => {
                const pageArea = page.otherPageAreas[subDocId];
                if (!pageArea || !pageArea.subDocument.isHeaderFooter())
                    return;
                const section = this.manager.model.sections[page.startPageSectionIndex];
                this.manager.boundsCalculator.init(section);
                if (pageArea.subDocument.isHeader())
                    this.manager.otherPageAreaFormatter.formatHeaderPageArea(page, pageArea.subDocument.info);
                else
                    this.manager.otherPageAreaFormatter.formatFooterPageArea(page, pageArea.subDocument.info);
            });
            this.manager.changesManager.addPageChange(PageChangesCollector.collectHeaderFooterChanges(pageIndex, oldPageAreas, page.otherPageAreas));
        });
    }
}
