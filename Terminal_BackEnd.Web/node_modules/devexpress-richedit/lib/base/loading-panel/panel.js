import { DelayedActionManager } from '@devexpress/utils/lib/class/delayed-manager';
export class ShowLoadingPanelDelayedManager extends DelayedActionManager {
    constructor(action, hidePanelAction) {
        super(action);
        this.hidePanelAction = hidePanelAction;
    }
    hidePanel() {
        this.stop();
        this.hidePanelAction();
    }
}
export class LoadingPanelBase {
    constructor() {
        this.enabled = true;
    }
    showPanelDelayed(timeout) {
        const manager = new ShowLoadingPanelDelayedManager(() => this.setVisible(true), () => this.setVisible(false));
        manager.start(timeout);
        return manager;
    }
    dispose() {
        if (this.customPanel)
            if (this.customPanel.dispose)
                this.customPanel.dispose();
        this.loadingPanel.dispose();
    }
    setVisible(visible) {
        if (this.customPanel)
            this.setPanelVisible(this.customPanel, visible);
        else
            this.setPanelVisible(this.loadingPanel, visible);
    }
    setPanelVisible(panel, visible) {
        const currState = panel.visible;
        if (visible) {
            if (this.enabled && (currState === false || currState === undefined))
                panel.show();
        }
        else {
            if (currState === true || currState === undefined)
                panel.hide();
        }
    }
}
