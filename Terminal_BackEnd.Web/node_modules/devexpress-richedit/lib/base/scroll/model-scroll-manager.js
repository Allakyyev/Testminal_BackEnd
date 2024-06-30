import { EventDispatcher } from '../../base-utils/event-dispatcher';
export class ModelScrollManager {
    constructor() {
        this.onChanged = new EventDispatcher();
        this.init();
    }
    setScroll(state) {
        this.state = state;
    }
    init() {
        this.state = null;
    }
    raiseOnChanged() {
        this.onChanged.listeners.forEach(listener => listener.NotifyScrollChanged());
    }
}
ModelScrollManager.StandartScrollPosition = -1;
ModelScrollManager.DontChangeScrollPosition = -2;
