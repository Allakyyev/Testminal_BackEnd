import { RulerBase, RulerModelState } from '../base';
import { RulerLineDisplayType } from '../vertical-line';
export const RulerMinDistanceBetweenMargins = 50;
export class RulerBaseMarginControl extends RulerBase {
    constructor() {
        super(...arguments);
        this.viewState = 0;
    }
    updateModelState() {
        this.currModelState = this.getModelState();
        this.prevModelState = this.currModelState.clone();
    }
    updateView() {
        const newViewState = this.getViewState();
        if (newViewState != this.viewState) {
            this.viewState = newViewState;
            for (let element of [this.marginPanelElement, this.handlePanelElement])
                this.setViewStateToElement(element);
        }
    }
    canHandle(source) {
        return source == this.handlePanelElement && !this.controls.tables.currModelState.columnSeparators.hasItems &&
            (this.modelData.selection.activeSubDocument.isMain() || this.modelData.selection.activeSubDocument.isHeaderFooter());
    }
    onMouseDown(source, _evt) {
        if (!this.canHandle(source) || !this.currModelState.enabled)
            return false;
        this.controls.lineControl.show(RulerLineDisplayType.Normal);
        this.lineControlSetPosition();
        return true;
    }
    onMouseMove(distance, _source) {
        this.calculateNewModelState(distance);
        this.controls.columns.marginsChanged(this.currModelState.modelValue - this.prevModelState.modelValue);
        this.updateView();
        this.lineControlSetPosition();
    }
    onMouseUp() {
        this.modelData.commandManager.getCommand(this.commandType).execute(this.modelData.commandManager.isPublicApiCall, this.currModelState.modelValue);
        this.finishHandle();
    }
    onEscPress() {
        this.currModelState = this.prevModelState.clone();
        this.finishHandle();
    }
    getModelState() {
        const state = this.modelData.commandManager.getCommand(this.commandType).getState();
        return new RulerModelState(state.value, state.enabled);
    }
    finishHandle() {
        this.controls.lineControl.hide();
    }
}
