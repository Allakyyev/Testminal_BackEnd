import { EventDispatcher } from '../../../base-utils/event-dispatcher';
export class BaseVisualizer {
    constructor(control) {
        this.onChanged = new EventDispatcher();
        this.control = control;
        this.reset();
    }
    closeDocument() {
        this.reset();
        this.raiseHide();
    }
    reset() {
        this.pageIndex = -1;
        this.bounds = null;
        this.tip = null;
    }
    hide() {
        this.reset();
        this.raiseHide();
    }
    raiseShow() {
        this.onChanged.listeners.forEach(listener => listener.NotifyShow(this.pageIndex, this.bounds, this.tip, this.isTextBox, this.isAnchoredObject, this.rotation));
    }
    raiseHide() {
        this.onChanged.listeners.forEach(listener => listener.NotifyHide());
    }
}
