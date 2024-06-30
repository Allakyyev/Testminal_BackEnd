import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { DocumentRenderer } from '../../../../canvas/renderes/common/document-renderer';
import { RichEditClientCommand } from '../../../../commands/client-command';
import { RULER_CLASS_NAME, RULLER_NUMBER_CORRECTION } from '../../settings';
import { SnapTo } from '../vertical-line';
import { RulerBaseMarginControl } from './base';
export const RulerMinDistanceBetweenMargins = 50;
const DIVISION_MARGIN_LEFT_CURSOR_CLASS_NAME = RULER_CLASS_NAME + "MarginLeftHandlePanel";
const DIVISION_MARGIN_LEFT_CLASS_NAME = RULER_CLASS_NAME + "MarginLeftPanel";
export class RulerLeftMarginDragHandle extends RulerBaseMarginControl {
    constructor(modelData, controls, maxPageWidth) {
        super(modelData, controls);
        this.initialLeft = -(Math.ceil(maxPageWidth) - RULLER_NUMBER_CORRECTION);
        this.marginPanelElement = DocumentRenderer.renderContainer(DIVISION_MARGIN_LEFT_CLASS_NAME);
        this.handlePanelElement = DocumentRenderer.renderContainer(DIVISION_MARGIN_LEFT_CURSOR_CLASS_NAME);
        this.marginPanelElement.style.width = maxPageWidth + "px";
        this.handlePanelElement.style.width = maxPageWidth + "px";
        this.handlePanelElement.title = this.modelData.settings.titles.marginLeft;
        this.controls.ruler.rootElement.appendChild(this.marginPanelElement);
        this.controls.ruler.rootElement.appendChild(this.handlePanelElement);
    }
    getRootClassName() { return ''; }
    ;
    get commandType() { return RichEditClientCommand.RulerSectionMarginLeft; }
    setViewStateToElement(element) {
        element.style.left = this.viewState + this.initialLeft + "px";
    }
    getViewState() {
        if (this.controls.tables.currModelState.columnSeparators.hasItems)
            return this.controls.leftMargin.currModelState.modelValue + this.controls.columns.currModelState.activeColumn.leftPos +
                this.controls.tables.currModelState.columnSeparators.items[0].position;
        else
            return this.controls.leftMargin.currModelState.modelValue;
    }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState, SnapTo.LeftSide);
    }
    calculateNewModelState(distance) {
        this.currModelState.modelValue = this.controls.chooseClosestAnchorPosition(this.prevModelState.modelValue + distance, [this.prevModelState.modelValue], new MinMaxNumber(0, Math.max(0, this.controls.rightMargin.viewStateRelativeLeft - RulerMinDistanceBetweenMargins)));
    }
}
