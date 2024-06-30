export class RulerMultiControl {
    constructor(modelData, controls) {
        this.subControls = [];
        this.handleControlIndex = -1;
        this.viewState = [];
        this.modelData = modelData;
        this.controls = controls;
    }
    get activeSubControl() { return this.subControls[this.handleControlIndex]; }
    dispose() {
        for (let elem of this.subControls)
            elem.dispose();
        this.subControls = [];
    }
    update() {
        this.updateModelState();
        this.updateView();
    }
    updateModelState() {
        this.currModelState = this.getModelState();
        this.prevModelState = this.currModelState.clone();
    }
    onMouseMove(distance, _source) {
        this.calculateNewModelState(distance);
        this.updateView();
        this.activeSubControl.lineControlSetPosition();
    }
    onEscPress() {
        this.currModelState = this.prevModelState.clone();
        this.finishHandle();
    }
    finishHandle() {
        this.controls.lineControl.hide();
        const activeSubControl = this.activeSubControl;
        if (activeSubControl)
            activeSubControl.hideShadow();
    }
    setCount(count) {
        let diff = this.subControls.length - count;
        if (diff > 0)
            while (diff--)
                this.subControls.pop().dispose();
        else {
            diff = Math.abs(diff);
            while (diff--)
                this.subControls.push(this.createSubControl());
        }
    }
}
