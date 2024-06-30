import { RendererClassNames } from '../../../../core/canvas/renderer-class-names';
import { zIndexCssClassType, ZIndexHelper } from '../../../../core/canvas/renderes/z-index-helper';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { BaseRenderer } from './base-renderer';
export class TextBoxRenderer extends BaseRenderer {
    handlePageHide(_pageIndex) {
        return true;
    }
    handlePageRender(pageIndex) {
        const cacheElement = this.renderer.cache[pageIndex];
        const layoutPage = this.renderer.layout.pages[pageIndex];
        if (!cacheElement || !layoutPage)
            return false;
        const activeSubDocumentId = this.newSubDocumentInfo.subDocumentId;
        NumberMapUtils.forEach(cacheElement.otherAreas, (paNode, textBoxSubDocId) => {
            const obj = layoutPage.anchoredObjectHolder.getTextBoxByInternalSubDocId(textBoxSubDocId);
            if (obj) {
                const isTextBoxActive = textBoxSubDocId == activeSubDocumentId;
                const bgNode = cacheElement.textBoxBgElements[textBoxSubDocId];
                const renderLevel = layoutPage.renderLevelCalculator.getRenderLevel(layoutPage.anchoredObjectHolder.getTextBoxByInternalSubDocId(textBoxSubDocId).rendererLevel);
                if (isTextBoxActive) {
                    if (obj.rotationInRadians == 0)
                        DomUtils.removeClassName(paNode, ZIndexHelper.getClassName(renderLevel, zIndexCssClassType.TextBox));
                    else
                        DomUtils.addClassName(paNode, ZIndexHelper.getClassName(renderLevel, zIndexCssClassType.TextBox));
                    DomUtils.addClassName(paNode, RendererClassNames.SELECTED_TEXTBOX);
                    DomUtils.addClassName(bgNode, RendererClassNames.SELECTED_TEXTBOX);
                }
                else {
                    DomUtils.removeClassName(paNode, RendererClassNames.SELECTED_TEXTBOX);
                    DomUtils.removeClassName(bgNode, RendererClassNames.SELECTED_TEXTBOX);
                    DomUtils.addClassName(paNode, ZIndexHelper.getClassName(renderLevel, zIndexCssClassType.TextBox));
                }
                if (isTextBoxActive || obj.belongsToSubDocId == activeSubDocumentId ||
                    (this.newSubDocumentInfo.isTextBox &&
                        this.newSubDocumentInfo.parentSubDocumentId == obj.belongsToSubDocId))
                    DomUtils.removeClassName(paNode, RendererClassNames.BLACKOUT);
                else
                    DomUtils.addClassName(paNode, RendererClassNames.BLACKOUT);
            }
        });
        return true;
    }
}
