import { FloatingPictureRenderer } from './floating-picture-renderer';
import { HeaderFooterLabelsRenderer } from './header-footer-labels-renderer';
import { HeaderFooterRenderer, MainRenderer } from './main-header-footer-renderer';
import { TextBoxRenderer } from './text-box-renderer';
export class RendererManager {
    constructor(viewManager, stringResources) {
        this.viewManager = viewManager;
        this.renderers = [
            new FloatingPictureRenderer(this),
            new TextBoxRenderer(this),
            new HeaderFooterRenderer(this),
            new MainRenderer(this),
            new HeaderFooterLabelsRenderer(this, stringResources.headerFooter),
        ];
    }
    get cache() { return this.viewManager.cache; }
    ;
    get canvas() { return this.viewManager.canvas; }
    ;
    get layout() { return this.viewManager.layout; }
    ;
    get scroll() { return this.viewManager.scroll; }
    ;
    get canvasScrollManager() { return this.viewManager.canvasScrollManager; }
    ;
    init() {
        for (let r of this.renderers)
            r.init();
    }
    update(layoutSelection) {
        const pageIndex = layoutSelection.pageIndex;
        const currSubDocInfo = layoutSelection.subDocumentInfo;
        for (let r of this.renderers)
            r.update(currSubDocInfo, pageIndex);
    }
    updatePage(layoutSelection, whatPageIndexUpdate) {
        const pageIndex = layoutSelection.pageIndex;
        const currSubDocInfo = layoutSelection.subDocumentInfo;
        for (let r of this.renderers)
            r.updatePage(whatPageIndexUpdate, currSubDocInfo, pageIndex);
    }
}
