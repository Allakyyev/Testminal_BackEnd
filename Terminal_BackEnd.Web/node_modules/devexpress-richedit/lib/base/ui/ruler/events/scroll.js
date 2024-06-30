import { DomEventHandlersHolder } from '@devexpress/utils/lib/class/event-handlers-holder';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class RulerViewElementScrollManager {
    constructor() {
        this.controls = [];
        this.evtHandlersHolder = new DomEventHandlersHolder();
    }
    dispose() {
        this.evtHandlersHolder.removeAllListeners();
    }
    addListener(owner, viewElement) {
        let listenerObj = ListUtils.elementBy(this.controls, control => control.view == viewElement);
        if (!listenerObj) {
            listenerObj = new ListenerScrollStruct(viewElement);
            this.evtHandlersHolder.addListener(listenerObj.view, "scroll", (_evt) => this.onScroll(this.controls.length - 1));
            this.controls.push(listenerObj);
        }
        listenerObj.listeners.push(owner);
    }
    removeListener(owner, viewElement) {
        const indOfControl = ListUtils.indexBy(this.controls, control => control.view == viewElement);
        if (indOfControl >= 0) {
            const control = this.controls[indOfControl];
            const indOfListner = control.listeners.indexOf(owner);
            if (indOfListner >= 0)
                control.listeners.splice(indOfListner, 1);
            if (control.listeners.length == 0)
                this.controls.splice(indOfControl, 1);
        }
        if (this.controls.length == 0)
            this.dispose();
    }
    onScroll(index) {
        this.controls[index].listeners.forEach(listener => listener.onScroll());
    }
}
class ListenerScrollStruct {
    constructor(view) {
        this.listeners = [];
        this.view = view;
    }
}
