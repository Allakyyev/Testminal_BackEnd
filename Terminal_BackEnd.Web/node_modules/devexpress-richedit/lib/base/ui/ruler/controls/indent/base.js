import { RulerBase } from '../base';
import { RulerShadow } from '../shadow';
import { RulerLineDisplayType, SnapTo } from '../vertical-line';
export const RulerMinDistanceBetweenIndents = 10;
export class RulerBaseIndentControl extends RulerBase {
    constructor() {
        super(...arguments);
        this.viewState = 0;
    }
    updateModelState() {
        this.currModelState = this.getModelState();
        this.prevModelState = this.currModelState.clone();
    }
    onMouseDown(source, _evt) {
        if (!this.canHandle(source) || !this.currModelState.enabled)
            return false;
        this.controls.lineControl.show(RulerLineDisplayType.Normal);
        this.lineControlSetPosition();
        this.shadow = new RulerShadow(this.rootElement);
        return true;
    }
    onMouseMove(distance, _source) {
        this.calculateNewModelState(distance);
        this.updateView();
        this.lineControlSetPosition();
    }
    onEscPress() {
        this.currModelState = this.prevModelState.clone();
        this.finishHandle();
    }
    finishHandle() {
        this.controls.lineControl.hide();
        this.shadow.dispose();
    }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState, SnapTo.LeftSide);
    }
}
