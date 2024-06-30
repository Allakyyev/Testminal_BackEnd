import { RendererClassNames } from '../../../../core/canvas/renderer-class-names';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { BaseRenderer } from './base-renderer';
export class FloatingPictureRenderer extends BaseRenderer {
    handlePageHide(_pageIndex) {
        return true;
    }
    handlePageRender(pageIndex, _force) {
        const cacheElement = this.renderer.cache[pageIndex];
        const layoutPage = this.renderer.layout.pages[pageIndex];
        if (!cacheElement || !layoutPage)
            return false;
        const subDocumentId = this.newSubDocumentInfo.subDocumentId;
        NumberMapUtils.forEach(cacheElement.anchoredPicture, (ancPicNode, picId) => {
            const belongsTo = layoutPage.anchoredObjectHolder.getObjById(picId).belongsToSubDocId;
            if (belongsTo == subDocumentId ||
                (this.newSubDocumentInfo.isTextBox && this.newSubDocumentInfo.parentSubDocumentId == belongsTo))
                DomUtils.removeClassName(ancPicNode, RendererClassNames.BLACKOUT);
            else
                DomUtils.addClassName(ancPicNode, RendererClassNames.BLACKOUT);
        });
        return true;
    }
}
