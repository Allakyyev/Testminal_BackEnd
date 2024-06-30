import { Browser } from '@devexpress/utils/lib/browser';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentRenderer } from '../common/document-renderer';
export class TouchSelectionCircleElementsManager {
    constructor(cache, layoutSelection) {
        this.firstElement = DocumentRenderer.renderContainer(TouchSelectionCircleElementsManager.BAR_CLASS_NAME);
        this.secondElement = DocumentRenderer.renderContainer(TouchSelectionCircleElementsManager.BAR_CLASS_NAME);
        this.layoutSelection = layoutSelection;
        this.cache = cache;
    }
    getSecondElement() {
        return this.secondElement;
    }
    update() {
        if (!Browser.TouchUI || this.layoutSelection.firstPageIndexWithSelection < 0 || !this.cache.length)
            return;
        if (!this.isCreated()) {
            let serviceContainer = DocumentRenderer.getServiceContainerCore(this.cache[this.layoutSelection.firstPageIndexWithSelection].page);
            serviceContainer.appendChild(this.firstElement);
            serviceContainer.appendChild(this.secondElement);
            this.radius = this.firstElement.offsetWidth / 2;
        }
        const firstSelectionItem = this.layoutSelection.selectionInfo.pageInfos[this.layoutSelection.firstPageIndexWithSelection].oldItems[0];
        DomUtils.setStylePosition(this.firstElement.style, new Point(firstSelectionItem.x - this.radius, firstSelectionItem.bottom));
        const lastSelectionItem = ListUtils.last(this.layoutSelection.selectionInfo.pageInfos[this.layoutSelection.lastPageIndexWithSelection].oldItems);
        DomUtils.setStylePosition(this.secondElement.style, new Point(lastSelectionItem.right - this.radius, lastSelectionItem.bottom));
    }
    setVisibilityTouchBars(visible) {
        this.setFirstTouchBarVisibility(visible);
        this.setSecondTouchBarVisibility(visible);
    }
    setFirstTouchBarVisibility(visible) {
        this.setVisible(this.firstElement, visible);
    }
    setSecondTouchBarVisibility(visible) {
        this.setVisible(this.secondElement, visible);
    }
    setVisible(element, visible) {
        if (this.isElementVisible(element) != visible)
            element.style.display = visible ? "" : "none";
    }
    isElementVisible(element) {
        return element.style.display != "none";
    }
    isCreated() {
        let serviceContainer = DocumentRenderer.getServiceContainerCore(this.cache[this.layoutSelection.firstPageIndexWithSelection].page);
        return !!DomUtils.getChildNodesByClassName(serviceContainer, TouchSelectionCircleElementsManager.BAR_CLASS_NAME).length;
    }
}
TouchSelectionCircleElementsManager.BAR_CLASS_NAME = "dxreSelBar";
