import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentRenderer } from '../../../../canvas/renderes/common/document-renderer';
import { RichEditClientCommand } from '../../../../commands/client-command';
import { RULER_CLASS_NAME, RULLER_NUMBER_CORRECTION } from '../../settings';
import { SnapTo } from '../vertical-line';
import { RulerBaseMarginControl } from './base';
import { RulerMinDistanceBetweenMargins } from './left';
const DIVISION_MARGIN_RIGHT_CLASS_NAME = RULER_CLASS_NAME + "MarginRightPanel";
const DIVISION_MARGIN_RIGHT_CURSOR_CLASS_NAME = RULER_CLASS_NAME + "MarginRightHandlePanel";
export class RulerRightMarginDragHandle extends RulerBaseMarginControl {
    get viewStateRelativeLeft() { return this.controls.ruler.pageWidth - this.viewState; }
    getRootClassName() { return ''; }
    ;
    get commandType() { return RichEditClientCommand.RulerSectionMarginRight; }
    constructor(modelData, controls, maxPageWidth) {
        super(modelData, controls);
        this.marginPanelElement = DocumentRenderer.renderContainer(DIVISION_MARGIN_RIGHT_CLASS_NAME);
        this.handlePanelElement = DocumentRenderer.renderContainer(DIVISION_MARGIN_RIGHT_CURSOR_CLASS_NAME);
        this.marginPanelElement.style.width = maxPageWidth + "px";
        this.handlePanelElement.style.width = maxPageWidth + "px";
        this.handlePanelElement.title = this.modelData.settings.titles.marginRight;
        this.controls.ruler.rootElement.appendChild(this.marginPanelElement);
        this.controls.ruler.rootElement.appendChild(this.handlePanelElement);
    }
    setViewStateToElement(element) {
        element.style.width = this.viewState + RULLER_NUMBER_CORRECTION + "px";
    }
    getViewState() {
        const colSeps = this.controls.tables.currModelState.columnSeparators;
        if (colSeps.hasItems) {
            const rightTablePos = this.controls.leftMargin.currModelState.modelValue + this.controls.columns.currModelState.activeColumn.leftPos +
                ListUtils.last(colSeps.items).position;
            return this.controls.ruler.pageWidth - rightTablePos;
        }
        else
            return this.currModelState.modelValue;
    }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState, SnapTo.RightSide);
    }
    calculateNewModelState(distance) {
        this.currModelState.modelValue = this.controls.ruler.pageWidth -
            this.controls.chooseClosestAnchorPosition(this.controls.ruler.pageWidth - this.prevModelState.modelValue + distance, [this.controls.ruler.pageWidth - this.prevModelState.modelValue], new MinMaxNumber(Math.max(0, this.controls.leftMargin.viewState + RulerMinDistanceBetweenMargins), this.controls.ruler.pageWidth));
    }
}
