import { Browser } from '@devexpress/utils/lib/browser';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { TouchUtils } from '@devexpress/utils/lib/utils/touch';
import { DocumentRenderer } from '../../../canvas/renderes/common/document-renderer';
import { RULLER_NUMBER_CORRECTION } from '../settings';
import { RulerBase } from './base';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class RulerControl extends RulerBase {
    constructor(modelData, controls) {
        super(modelData, controls);
        this.canHandleScroll = false;
        this.initialMarginLeftElement = 0;
        this.currPageWidth = 0;
        this.prevPageWidth = 0;
        this.rootElement = DocumentRenderer.renderContainer(this.modelData.settings.styles.control.className);
        if (Browser.MSTouchUI)
            DomUtils.addClassName(this.rootElement, TouchUtils.msTouchDraggableClassName);
        this.controls.wrapper.rootElement.appendChild(this.rootElement);
    }
    getRootClassName() { return this.modelData.settings.styles.control.className; }
    ;
    get pageWidth() { return this.currPageWidth; }
    ;
    init() {
        this.rootElement.style.height = this.controls.divisions.height + "px";
        this.setPaddings();
    }
    setPaddings() {
        this.rootElement.style.paddingBottom = this.controls.leftIndent.heightOfProtrudingPart + "px";
        this.rootElement.style.paddingTop = this.controls.firstLineIndent.heightOfProtrudingPart + "px";
    }
    updateModelState() {
        this.currPageWidth = UnitConverter.twipsToPixelsF(this.modelData.inputPosition.getMergedSectionPropertiesRaw().pageSize.width);
    }
    updateView() {
        if (this.prevPageWidth != this.currPageWidth) {
            this.prevPageWidth = this.currPageWidth;
            this.rootElement.style.width = this.pageWidth + RULLER_NUMBER_CORRECTION * 2 + "px";
            this.adjust();
        }
    }
    adjust() {
        const viewWidth = this.controls.canvas.clientWidth;
        if (viewWidth > this.controls.ruler.pageWidth)
            this.initialMarginLeftElement = (viewWidth - this.pageWidth - RULLER_NUMBER_CORRECTION * 2) / 2;
        else {
            const paddingLeft = DomUtils.pxToInt(DomUtils.getCurrentStyle(this.controls.canvas).paddingLeft);
            const pageAreaBorderWidth = (this.controls.canvas.scrollWidth - paddingLeft - this.pageWidth) / 2;
            this.initialMarginLeftElement = paddingLeft + pageAreaBorderWidth - RULLER_NUMBER_CORRECTION;
        }
        this.rootElement.style.left = this.calculateLeftOffset();
        this.setPaddings();
        this.canHandleScroll = this.controls.canvas.scrollWidth > this.controls.canvas.offsetWidth;
    }
    onScroll() {
        if (this.canHandleScroll)
            this.rootElement.style.left = this.calculateLeftOffset();
    }
    calculateLeftOffset() {
        return Math.round(this.initialMarginLeftElement - this.controls.canvas.scrollLeft) + "px";
    }
}
