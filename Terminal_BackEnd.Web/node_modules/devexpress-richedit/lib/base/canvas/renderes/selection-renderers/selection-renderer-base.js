import { ZIndexHelper } from '../../../../core/canvas/renderes/z-index-helper';
import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { LayoutSelectionItem } from '../../../../core/layout/selection/layout-selection-items';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../common/document-renderer';
export class SelectionRendererBase {
    constructor(cache, layoutSelection) {
        this.cache = cache;
        this.layoutSelection = layoutSelection;
    }
    closeDocument() { }
    applySelectionChanges(layout) {
        for (let pageChange of this.getLayoutSelectionInfo().changes) {
            const layoutPage = layout.pages[pageChange.index];
            if (!layoutPage || !layoutPage.flags.get(LayoutPageFlags.ContentRendered))
                continue;
            layoutPage.flags.set(this.layoutPageFlag, true);
            for (let areaChange of pageChange.areaChanges)
                DocumentRenderer.applyChange(this.cache[pageChange.index].page, areaChange, this.getContainer, () => this.renderItem(areaChange.selection, layoutPage));
        }
        this.getLayoutSelectionInfo().changesApplied();
    }
    renderAllPageSelection(layout, pageIndex, force) {
        const pageCache = this.cache[pageIndex];
        if (!pageCache)
            return;
        const container = this.getContainer(pageCache.page);
        const pageInfo = this.getLayoutSelectionInfo().pageInfos[pageIndex];
        const layoutPage = layout.pages[pageIndex];
        if (!container || (!force && container.childNodes.length != 0) || !pageInfo || !layoutPage)
            return;
        layoutPage.flags.set(this.layoutPageFlag, true);
        if (force)
            DomUtils.clearInnerHtml(container);
        for (let item of pageInfo.oldItems)
            container.appendChild(this.renderItem(item, layoutPage));
    }
    renderItem(item, layoutPage) {
        const ancObjHolder = layoutPage.anchoredObjectHolder;
        let level;
        switch (item.floatingObjectId) {
            case LayoutSelectionItem.mainPageAreaSelection:
                level = layoutPage.renderLevelCalculator.renderMainPageAreaLevel;
                break;
            case LayoutSelectionItem.headerFooterPageAreaSelection:
                level = layoutPage.renderLevelCalculator.renderHeaderFooterPageAreasLevel;
                break;
            default: level = layoutPage.renderLevelCalculator.getRenderLevel(ancObjHolder.getObjById(item.floatingObjectId).rendererLevel);
        }
        const selectionElement = DocumentRenderer.renderContainer(item.baseClassName + " " + ZIndexHelper.getClassName(level, item.zIndexClassType));
        DomUtils.setStyleSizeAndPosition(selectionElement.style, item);
        return selectionElement;
    }
}
