import { RendererClassNames } from '../../../../core/canvas/renderer-class-names';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { DocumentRenderer } from '../common/document-renderer';
import { BaseRenderer } from './base-renderer';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class MainHeaderFooterRenderer extends BaseRenderer {
    handlePageHide(_pageIndex) {
        return true;
    }
    activateElement(pageAreaElement) {
        if (!pageAreaElement)
            return false;
        DomUtils.removeClassName(pageAreaElement, RendererClassNames.BLACKOUT);
        return true;
    }
    deactivateElement(pageAreaElement) {
        DomUtils.addClassName(pageAreaElement, RendererClassNames.BLACKOUT);
    }
}
export class HeaderFooterRenderer extends MainHeaderFooterRenderer {
    handlePageRender(pageIndex, _force) {
        const cacheElement = this.renderer.cache[pageIndex];
        const layoutPage = this.renderer.layout.pages[pageIndex];
        if (!cacheElement || !layoutPage)
            return false;
        NumberMapUtils.forEach(cacheElement.otherAreas, (paElement, elemSubDocId) => {
            const pa = layoutPage.otherPageAreas[elemSubDocId];
            if (pa && pa.subDocument.isHeaderFooter())
                if (this.isHeaderFooterActive(layoutPage))
                    this.activateElement(paElement);
                else
                    this.deactivateElement(paElement);
        });
    }
}
export class MainRenderer extends MainHeaderFooterRenderer {
    handlePageRender(pageIndex, _force) {
        const cacheElement = this.renderer.cache[pageIndex];
        return cacheElement &&
            this.applyToMainPageAreas(cacheElement, this.isActive() ? this.activateElement : this.deactivateElement);
    }
    applyToMainPageAreas(cacheElement, applier) {
        if (!DocumentRenderer.isPageElementConsiderAllContainers(cacheElement.page))
            return false;
        const mainPageAreasElements = DocumentRenderer.getMainPageAreaContainerCore(cacheElement.page).childNodes;
        for (let paIndex = 0, paNode; paNode = mainPageAreasElements[paIndex]; paIndex++)
            applier.call(this, paNode);
        return true;
    }
    isActive() {
        if (this.newSubDocumentInfo.isMain)
            return true;
        if (!this.newSubDocumentInfo.isTextBox)
            return false;
        return this.newSubDocumentInfo.parentSubDocumentId == 0;
    }
}
