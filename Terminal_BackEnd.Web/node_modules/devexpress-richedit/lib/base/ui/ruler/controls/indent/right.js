import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { RichEditClientCommand } from '../../../../commands/client-command';
import { RULLER_NUMBER_CORRECTION } from '../../settings';
import { RulerModelState } from '../base';
import { RulerTemplateManager } from '../template-manager';
import { SnapTo } from '../vertical-line';
import { RulerBaseIndentControl, RulerMinDistanceBetweenIndents } from './base';
const RulerMinDistanceBetweenIndentsOnView = 5;
export class RulerRightIndentDragHandle extends RulerBaseIndentControl {
    constructor(modelData, controls) {
        super(modelData, controls);
        const template = RulerTemplateManager.getRightIndentElementTemplate();
        if (template)
            this.rootElement.innerHTML = template;
        this.rootElement.title = this.modelData.settings.titles.rightIndent;
        this.controls.ruler.rootElement.appendChild(this.rootElement);
        this.adjustByTop();
        this.leftCorrection = Math.round(this.rootElement.offsetWidth / 2);
    }
    get viewStateRelativeLeft() { return this.controls.ruler.pageWidth - this.viewState; }
    getRootClassName() {
        return this.modelData.settings.styles.rightIndentImage.spriteCssClass + " " +
            this.modelData.settings.styles.rightIndent.className;
    }
    adjustByTop() {
        const divisionsControlHeight = this.controls.divisions.height;
        this.rootElement.style.marginTop = divisionsControlHeight / 2 + "px";
    }
    getModelState() {
        const state = this.modelData.commandManager
            .getCommand(RichEditClientCommand.RulerParagraphRightIndent).getState();
        return new RulerModelState(state.value.hanging, state.enabled);
    }
    updateView() {
        const newViewState = this.correctRelativeLeftIndents(this.controls.ruler.pageWidth - this.controls.paragraphRightPosition + this.currModelState.modelValue);
        if (newViewState != this.viewState) {
            this.viewState = newViewState;
            if (this.modelData.settings.showRightIndent)
                this.rootElement.style.right = this.viewState + RULLER_NUMBER_CORRECTION - this.leftCorrection + "px";
            else
                this.setVisible(false);
        }
    }
    correctRelativeLeftIndents(viewState) {
        const maxOfLeftIndents = Math.max(this.controls.leftIndent.viewState, this.controls.firstLineIndent.viewState);
        return Math.min(this.controls.ruler.pageWidth - (maxOfLeftIndents + RulerMinDistanceBetweenIndentsOnView), viewState);
    }
    canHandle(source) { return source == this.rootElement; }
    onMouseUp() {
        this.modelData.commandManager.getCommand(RichEditClientCommand.RulerParagraphRightIndent)
            .execute(this.modelData.commandManager.isPublicApiCall, this.currModelState.modelValue);
        this.finishHandle();
    }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState, SnapTo.RightSide);
    }
    calculateNewModelState(distance) {
        const parRightPos = this.controls.paragraphRightPosition;
        const maxOfLeftIndent = Math.max(this.controls.leftIndent.viewState, this.controls.firstLineIndent.viewState);
        this.currModelState.modelValue = parRightPos -
            this.controls.chooseClosestAnchorPosition(parRightPos - this.prevModelState.modelValue + distance, [parRightPos - this.prevModelState.modelValue], new MinMaxNumber(Math.max(0, maxOfLeftIndent + RulerMinDistanceBetweenIndents), this.controls.ruler.pageWidth));
    }
}
