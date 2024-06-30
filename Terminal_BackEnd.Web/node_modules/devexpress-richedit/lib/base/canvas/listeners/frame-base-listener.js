import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../renderes/common/document-renderer';
import { CanvasUtils } from '../utils';
export class FrameBaseListener {
    constructor(rendererCache, stringResources, fieldOptions) {
        this.rendererCache = rendererCache;
        this.stringResources = stringResources;
        this.fieldOptions = fieldOptions;
        this.initFrameElement();
    }
    initFrameElement() {
        if (this.baseFrame)
            this.NotifyHide();
        this.baseFrame = DocumentRenderer.renderContainer(this.baseFrameClassName());
    }
    NotifyHide() {
        DomUtils.hideNode(this.baseFrame);
    }
    NotifyShow(pageIndex, bounds, tip, isTextBox, isAnchoredObject, rotation) {
        DomUtils.setStyleSizeAndPosition(this.baseFrame.style, bounds);
        if (tip)
            this.baseFrame.title = CanvasUtils.buildHyperlinkTipString(tip, this.stringResources.commonLabels.clickToFollowHyperlink, this.fieldOptions);
        this.toggleClass(DocumentRenderer.setRotationInRadians(this.baseFrame, rotation), FrameBaseListener.CLASSNAMES.IS_BOX_ROTATED);
        this.toggleClass(isTextBox, FrameBaseListener.CLASSNAMES.TEXTBOX_AREA);
        this.toggleClass(isAnchoredObject, FrameBaseListener.CLASSNAMES.ANCHORED_OBJECT);
        DocumentRenderer.getServiceContainerCore(this.rendererCache[pageIndex].page).appendChild(this.baseFrame);
    }
    toggleClass(shouldBeEnabled, className) {
        if (shouldBeEnabled)
            DomUtils.addClassName(this.baseFrame, className);
        else
            DomUtils.removeClassName(this.baseFrame, className);
    }
}
FrameBaseListener.CLASSNAMES = {
    CONTAINER: "dxreResBox",
    CORNER_ELEM_PREFIX: "dxreResBoxCornerElem",
    CORNER_LINE_PREFIX: "dxreResBoxCornerLine",
    CORNER_TOUCH_POSTFIX: "Touch",
    ROTATION_BOX: "dxreResBoxRotation",
    ROTATION_LINE: "dxreResBoxRotationLine",
    ANCHORED_OBJECT: "dxreResBoxAnchored",
    TEXTBOX_AREA: "dxreResBoxTextBoxArea",
    IS_BOX_ROTATED: "dxreResBoxRotated",
};
