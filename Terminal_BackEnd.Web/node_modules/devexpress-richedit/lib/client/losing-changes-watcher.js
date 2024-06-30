import { DomEventHandlersHolder } from '@devexpress/utils/lib/class/event-handlers-holder';
export class LosingChangesWatcherSingleton {
    constructor() {
        this.watchers = [];
        LosingChangesWatcherSingleton.evtHandlersHolder.addListenerToWindow('beforeunload', this.onWindowBeforeUnload.bind(this));
    }
    static get instance() {
        if (!LosingChangesWatcherSingleton._instance)
            LosingChangesWatcherSingleton._instance = new this();
        return LosingChangesWatcherSingleton._instance;
    }
    add(watcher) {
        this.watchers.push(watcher);
    }
    remove(watcher) {
        const index = this.watchers.indexOf(watcher);
        if (index >= 0)
            this.watchers.splice(index, 1);
    }
    onWindowBeforeUnload(e) {
        const confirmMessage = this.getConfirmMessage();
        if (confirmMessage) {
            e.returnValue = !!confirmMessage;
            return confirmMessage;
        }
        return undefined;
    }
    getConfirmMessage() {
        const modifiedWatchers = this.getModifiedWatchers();
        return modifiedWatchers.length > 0 ? modifiedWatchers[0].getConfirmMessage() : '';
    }
    getModifiedWatchers() {
        return this.watchers.filter((watcher) => watcher.hasChanges());
    }
}
LosingChangesWatcherSingleton.evtHandlersHolder = new DomEventHandlersHolder();
export class LosingChangesWatcher {
    constructor(hasChangesCallback, confirmMessage) {
        this.hasChangesCallback = hasChangesCallback;
        this.confirmMessage = confirmMessage;
        LosingChangesWatcherSingleton.instance.add(this);
    }
    hasChanges() {
        return this.hasChangesCallback();
    }
    getConfirmMessage() {
        return this.confirmMessage;
    }
    confirm() {
        return this.hasChanges() ? confirm(this.confirmMessage) : true;
    }
    dispose() {
        this.hasChangesCallback = null;
        LosingChangesWatcherSingleton.instance.remove(this);
    }
}
