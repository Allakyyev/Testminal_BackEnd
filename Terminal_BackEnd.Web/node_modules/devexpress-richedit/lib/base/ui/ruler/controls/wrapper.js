import { RulerBase } from './base';
export class RulerWrapper extends RulerBase {
    getRootClassName() { return this.modelData.settings.styles.wrapper.className; }
    ;
    constructor(modelData, controls) {
        super(modelData, controls);
        this.controls.canvas.parentElement.insertBefore(this.rootElement, this.controls.canvas);
    }
}
