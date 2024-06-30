import { AttributeUtils } from '../../base/rich-utils/attribute-utils';
import { Browser } from '@devexpress/utils/lib/browser';
import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class FullScreenHelper {
    constructor(element) {
        this.fullScreenTempVars = {};
        this.zIndex = '1001';
        this.element = element;
    }
    get shouldChangeNativeFullscreen() {
        return window.self !== window.top;
    }
    prepareFullScreenMode() {
        const mainElement = this.getMainElement();
        AttributeUtils.changeElementStyleAttribute(mainElement, Browser.IE ? "borderTopWidth" : "border-top-width", "0px");
        AttributeUtils.changeElementStyleAttribute(mainElement, Browser.IE ? "borderLeftWidth" : "border-left-width", "0px");
        AttributeUtils.changeElementStyleAttribute(mainElement, Browser.IE ? "borderRightWidth" : "border-right-width", "0px");
        AttributeUtils.changeElementStyleAttribute(mainElement, Browser.IE ? "borderBottomWidth" : "border-bottom-width", "0px");
        this.fullScreenTempVars.scrollTop = DomUtils.getDocumentScrollTop();
        this.fullScreenTempVars.scrollLeft = DomUtils.getDocumentScrollLeft();
        AttributeUtils.changeElementStyleAttribute(mainElement, "position", "fixed");
        AttributeUtils.changeElementStyleAttribute(mainElement, "top", "0px");
        AttributeUtils.changeElementStyleAttribute(mainElement, "left", "0px");
        AttributeUtils.changeElementStyleAttribute(mainElement, Browser.IE ? "zIndex" : "z-index", this.zIndex);
        AttributeUtils.changeElementStyleAttribute(document.documentElement, "position", "static");
        AttributeUtils.changeElementStyleAttribute(document.documentElement, "overflow", "hidden");
        this.fullScreenTempVars.bodyMargin = document.body.style.margin;
        document.body.style.margin = "0";
        this.fullScreenTempVars.width = mainElement.style.width;
        this.fullScreenTempVars.height = mainElement.style.height;
        if (this.shouldChangeNativeFullscreen)
            this.requestFullScreen(document.body);
    }
    setNormalMode() {
        if (this.shouldChangeNativeFullscreen)
            this.cancelFullScreen(document);
        var mainElement = this.getMainElement();
        AttrUtils.restoreElementStyleAttribute(mainElement, "left");
        AttrUtils.restoreElementStyleAttribute(mainElement, "top");
        AttrUtils.restoreElementStyleAttribute(document.documentElement, "overflow");
        AttrUtils.restoreElementStyleAttribute(document.documentElement, "position");
        AttrUtils.restoreElementStyleAttribute(mainElement, Browser.IE ? "zIndex" : "z-index");
        document.body.style.margin = this.fullScreenTempVars.bodyMargin;
        AttrUtils.restoreElementStyleAttribute(mainElement, "position");
        AttrUtils.restoreElementStyleAttribute(mainElement, Browser.IE ? "borderTopWidth" : "border-top-width");
        AttrUtils.restoreElementStyleAttribute(mainElement, Browser.IE ? "borderLeftWidth" : "border-left-width");
        AttrUtils.restoreElementStyleAttribute(mainElement, Browser.IE ? "borderRightWidth" : "border-right-width");
        AttrUtils.restoreElementStyleAttribute(mainElement, Browser.IE ? "borderBottomWidth" : "border-bottom-width");
        this.setHeight(this.fullScreenTempVars.height);
        this.setWidth(this.fullScreenTempVars.width);
        document.documentElement.scrollTop = this.fullScreenTempVars.scrollTop;
        document.documentElement.scrollLeft = this.fullScreenTempVars.scrollLeft;
    }
    getMainElement() {
        return this.element;
    }
    setWidth(width) {
        const mainElement = this.getMainElement();
        const isNumber = !isNaN(parseFloat(width)) && isFinite(width);
        mainElement.style.width = isNumber ? width + "px" : width;
    }
    setHeight(height) {
        const mainElement = this.getMainElement();
        const isNumber = !isNaN(parseFloat(height)) && isFinite(height);
        mainElement.style.height = isNumber ? height + "px" : height;
    }
    requestFullScreen(element) {
        if (element.requestFullscreen)
            element.requestFullscreen();
        else if (element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
            element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen)
            element.msRequestFullscreen();
    }
    cancelFullScreen(document) {
        if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        else if (document.exitFullscreen)
            document.exitFullscreen();
    }
}
