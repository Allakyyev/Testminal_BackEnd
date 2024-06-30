import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export var ViewType;
(function (ViewType) {
    ViewType[ViewType["Simple"] = 0] = "Simple";
    ViewType[ViewType["PrintLayout"] = 1] = "PrintLayout";
})(ViewType || (ViewType = {}));
const DEFAULT_BORDERS_WIDTH = 1;
const DEFAULT_PAGE_MARGINS = 15;
export class RenderPageVertivalInfo {
    constructor() {
        this.topPageBorderWidth = DEFAULT_BORDERS_WIDTH;
        this.bottomPageBorderWidth = DEFAULT_BORDERS_WIDTH;
        this.topMargin = DEFAULT_PAGE_MARGINS;
        this.bottomMargin = DEFAULT_PAGE_MARGINS;
    }
    get betweenPageSpacing() { return this.topPageBorderWidth + this.bottomPageBorderWidth + Math.max(this.topMargin, this.bottomMargin); }
    init(pageElementStyle) {
        this.topPageBorderWidth = DomUtils.pxToFloat(pageElementStyle.borderTopWidth);
        this.bottomPageBorderWidth = DomUtils.pxToFloat(pageElementStyle.borderBottomWidth);
        this.topMargin = DomUtils.pxToFloat(pageElementStyle.marginTop);
        this.bottomMargin = DomUtils.pxToFloat(pageElementStyle.marginBottom);
    }
    clone() {
        const obj = new RenderPageVertivalInfo();
        obj.copyFrom(this);
        return obj;
    }
    copyFrom(obj) {
        if (!obj)
            return;
        this.topPageBorderWidth = obj.topPageBorderWidth;
        this.bottomPageBorderWidth = obj.bottomPageBorderWidth;
        this.topMargin = obj.topMargin;
        this.bottomMargin = obj.bottomMargin;
    }
    equals(obj) {
        return this.topMargin == obj.topMargin &&
            this.bottomMargin == obj.bottomMargin &&
            this.topPageBorderWidth == obj.topPageBorderWidth &&
            this.bottomPageBorderWidth == obj.bottomPageBorderWidth;
    }
}
export class ViewSettings {
    constructor() {
        this.viewType = ViewType.PrintLayout;
        this.paddings = new Margins(15, 15, 15, 15);
        this.pageVerticalInfo = new RenderPageVertivalInfo();
        this.showHorizontalRuler = true;
    }
    get isFixedWidthMode() { return this.fixedWidth !== undefined && this.fixedWidth !== null; }
    set widthOfPage(val) { this._widthOfPage = val; }
    get widthOfPage() {
        return Math.max(50, this.isFixedWidthMode ? this.fixedWidth : this._widthOfPage);
    }
    get widthOfContent() {
        return Math.max(50, this.widthOfPage - this.paddings.horizontal);
    }
    get isSimpleView() { return this.viewType == ViewType.Simple; }
    get isPrintLayoutView() { return this.viewType == ViewType.PrintLayout; }
    copyFrom(obj) {
        this.paddings = new Margins(obj.paddings.left, obj.paddings.right, obj.paddings.top, obj.paddings.bottom);
        this.viewType = obj.viewType;
        this._widthOfPage = obj._widthOfPage;
        this.fixedWidth = obj.fixedWidth;
        this.showHorizontalRuler = obj.showHorizontalRuler;
        this.pageVerticalInfo.copyFrom(obj.pageVerticalInfo);
    }
}
