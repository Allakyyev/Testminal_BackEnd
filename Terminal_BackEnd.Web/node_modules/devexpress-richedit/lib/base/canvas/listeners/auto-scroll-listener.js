import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../renderes/common/document-renderer';
export class AutoScrollListener {
    constructor(serviceContainer) {
        this.serviceContainer = serviceContainer;
        this.baseFrame = DocumentRenderer.renderContainer(RendererClassNames.AUTO_SCROLL);
        this.top = DocumentRenderer.renderContainer(RendererClassNames.AUTO_SCROLL_CURSOR);
        this.center = DocumentRenderer.renderContainer(RendererClassNames.AUTO_SCROLL_CURSOR);
        this.bottom = DocumentRenderer.renderContainer(RendererClassNames.AUTO_SCROLL_CURSOR);
        DomUtils.addClassName(this.top, RendererClassNames.AUTO_SCROLL_CURSOR_N);
        DomUtils.addClassName(this.center, RendererClassNames.AUTO_SCROLL_CURSOR_NS);
        DomUtils.addClassName(this.bottom, RendererClassNames.AUTO_SCROLL_CURSOR_S);
    }
    NotifyHide() {
        DomUtils.hideNode(this.baseFrame);
        DomUtils.hideNode(this.top);
        DomUtils.hideNode(this.center);
        DomUtils.hideNode(this.bottom);
    }
    NotifyShow(_pageIndex, bounds, _tip, _isTextBox, _isAnchoredObject, _rotation) {
        DomUtils.setStyleSizeAndPosition(this.baseFrame.style, bounds);
        this.top.style.top = "0px";
        this.top.style.height = `${bounds.y}px`;
        this.center.style.top = `${bounds.y}px`;
        this.center.style.height = `${bounds.height}px`;
        this.bottom.style.top = `${bounds.bottom}px`;
        this.bottom.style.height = "100%";
        this.serviceContainer.appendChild(this.baseFrame);
        this.serviceContainer.appendChild(this.top);
        this.serviceContainer.appendChild(this.center);
        this.serviceContainer.appendChild(this.bottom);
    }
}
AutoScrollListener.HALF_SIZE = 10;
