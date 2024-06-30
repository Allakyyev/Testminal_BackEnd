import { EventDispatcher } from '../../base-utils/event-dispatcher';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
export class ScrollFormatter extends BatchUpdatableObject {
    constructor(selection) {
        super();
        this.onScrollLayoutChanged = new EventDispatcher();
        this.selection = selection;
    }
    NotifyPagesReady(_pageChanges) {
        this.process();
    }
    NotifyFullyFormatted(_pageCount) {
        this.process();
    }
    ;
    NotifyScrollChanged() {
        this.process();
    }
    onUpdateUnlocked(_occurredEvents) {
        this.process();
    }
    process() {
        const modelState = this.selection.scrollManager.state;
        if (modelState) {
            this.canvasState = modelState.getCanvasState(this.selection.layout);
            if (this.canvasState || this.selection.layout.isFullyFormatted)
                this.selection.scrollManager.init();
        }
        if (this.isUpdateLocked())
            return;
        if (this.canvasState) {
            this.raiseScrollChanged();
            this.canvasState = null;
        }
    }
    raiseScrollChanged() {
        this.onScrollLayoutChanged.listeners.forEach(listener => listener.NotifyScrollPositionChanged(this.canvasState));
    }
}
