import { Browser } from '@devexpress/utils/lib/browser';
export class FocusManager {
    constructor(canvasManager, owner, inputController, eventManager) {
        this.canvasManager = canvasManager;
        this.owner = owner;
        this.inputController = inputController;
        this.eventManager = eventManager;
    }
    set isInFocus(focused) {
        if (this.isFocus !== focused) {
            this.isFocus = focused;
            this.canvasManager.focusChanged(focused);
        }
    }
    get isInFocus() {
        return this.isFocus;
    }
    captureFocus() {
        if (this.owner.canCaptureFocus()) {
            this.owner.onCaptureFocus();
            if (!Browser.MacOSMobilePlatform || this.owner.isInitialized ||
                Browser.MacOSMobilePlatform && window.self !== window.top)
                this.inputController.captureFocus();
            this.eventManager.onFocusIn();
        }
    }
}
