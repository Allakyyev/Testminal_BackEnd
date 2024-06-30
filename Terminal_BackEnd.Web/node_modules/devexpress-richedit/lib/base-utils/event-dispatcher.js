import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class EventDispatcher {
    constructor() {
        this.listeners = [];
    }
    clear() {
        ListUtils.clear(this.listeners);
    }
    add(listener) {
        if (!ListUtils.unsafeAnyOf(this.listeners, currListener => currListener === listener))
            this.listeners.push(listener);
    }
    remove(listener) {
        for (let i = 0, currListener; currListener = this.listeners[i]; i++) {
            if (currListener === listener) {
                this.listeners.splice(i, 1);
                break;
            }
        }
    }
    dispose() {
        const listeners = this.listeners;
        this.listeners = [];
        listeners.forEach(listener => { var _a; return (_a = listener.dispose) === null || _a === void 0 ? void 0 : _a.call(listener); });
    }
}
