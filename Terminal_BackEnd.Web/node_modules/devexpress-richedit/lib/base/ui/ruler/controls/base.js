import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../../../canvas/renderes/common/document-renderer';
export class RulerModelState {
    constructor(modelValue, enabled) {
        this.modelValue = modelValue;
        this.enabled = enabled;
    }
    clone() {
        return new RulerModelState(this.modelValue, this.enabled);
    }
}
export class RulerBase {
    constructor(modelData, controls) {
        this._visible = true;
        this.modelData = modelData;
        this.controls = controls;
        this.rootElement = DocumentRenderer.renderContainer(this.getRootClassName());
    }
    get visible() { return this._visible; }
    dispose() {
        DomUtils.hideNode(this.rootElement);
        this.rootElement = null;
    }
    setVisible(visible) {
        if (this._visible != visible) {
            this._visible = visible;
            this.rootElement.style.display = visible ? 'block' : 'none';
        }
    }
}
