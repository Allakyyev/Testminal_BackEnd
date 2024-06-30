import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { Browser } from '@devexpress/utils/lib/browser';
import { DomEventHandlersHolder } from '@devexpress/utils/lib/class/event-handlers-holder';
import { KeyCode, KeyUtils } from '@devexpress/utils/lib/utils/key';
import { TouchUtils } from '@devexpress/utils/lib/utils/touch';
export class RulerMouseEventsManager {
    constructor() {
        this.canMouseMoveHandle = false;
        this.touchID = -1;
        this.listeners = [];
        this.evtHandlersHolder = new DomEventHandlersHolder();
    }
    dispose() {
        this.evtHandlersHolder.removeAllListeners();
        this.listener = null;
    }
    addListener(rulerControl) {
        if (this.listeners.length == 0)
            this.init();
        this.listeners.push(rulerControl);
    }
    removeListener(rulerControl) {
        const ind = this.listeners.indexOf(rulerControl);
        if (ind >= 0)
            this.listeners.splice(ind, 1);
        if (this.listeners.length == 0)
            this.dispose();
    }
    init() {
        this.evtHandlersHolder.addListener(document.documentElement, TouchUtils.touchMouseDownEventName, this.onMouseDown.bind(this));
        this.evtHandlersHolder.addListener(document.documentElement, TouchUtils.touchMouseMoveEventName, this.onMouseMove.bind(this));
        this.evtHandlersHolder.addListener(document.documentElement, TouchUtils.touchMouseUpEventName, this.onMouseUp.bind(this));
        this.evtHandlersHolder.addListener(document.documentElement, "dblclick", this.onDoubleClick.bind(this));
        if (!Browser.TouchUI)
            this.evtHandlersHolder.addListener(document.documentElement, "keydown", this.onKeyBoardEvent.bind(this));
    }
    onDoubleClick(evt) {
        this.listener = this.getCurrentListener(evt);
        if (this.listener && this.listener.canHandle(EvtUtils.getEventSource(evt)))
            this.listener.onDoubleClick(evt);
        this.listener = null;
    }
    onKeyBoardEvent(evt) {
        if (this.canMouseMoveHandle && KeyUtils.getEventKeyCode(evt) == KeyCode.Esc) {
            this.listener.onEscPress();
            this.reset();
        }
    }
    onMouseDown(evt) {
        if (Browser.TouchUI)
            this.touchID = this.getChangedTouchesIdentifier(evt);
        this.startX = EvtUtils.getEventX(evt);
        this.listener = this.getCurrentListener(evt);
        if (EvtUtils.isLeftButtonPressed(evt) && this.listener) {
            this.canMouseMoveHandle = true;
            this.listener.onMouseDown(evt);
            EvtUtils.preventEventAndBubble(evt);
        }
    }
    onMouseMove(evt) {
        if (!this.listener || Browser.TouchUI && this.touchID != this.getChangedTouchesIdentifier(evt))
            return;
        if (this.canMouseMoveHandle) {
            this.listener.onMouseMove(EvtUtils.getEventX(evt) - this.startX, EvtUtils.getEventSource(evt));
            EvtUtils.preventEventAndBubble(evt);
        }
    }
    onMouseUp(_evt) {
        if (this.listener) {
            this.listener.onMouseUp();
            this.reset();
        }
    }
    reset() {
        this.listener = null;
        this.canMouseMoveHandle = false;
        this.touchID = -1;
    }
    getCurrentListener(evt) {
        for (let listener of this.listeners)
            if (listener.canHandle(EvtUtils.getEventSource(evt)))
                return listener;
        return null;
    }
    getChangedTouchesIdentifier(evt) {
        return !Browser.MSTouchUI ? evt.changedTouches[0].identifier : this.touchID;
    }
}
