export class LoadingPanelApi {
    constructor(core) {
        this._core = core;
    }
    get enabled() { return this._core.loadingPanelManager.loadingPanel.enabled; }
    set enabled(value) { this._core.loadingPanelManager.loadingPanel.enabled = value; }
    get customPanel() { return this._core.loadingPanelManager.loadingPanel.customPanel; }
    set customPanel(value) { this._core.loadingPanelManager.loadingPanel.customPanel = value; }
    show() {
        this._core.loadingPanelManager.loadingPanel.setVisible(true);
    }
    hide() {
        this._core.loadingPanelManager.loadingPanel.setVisible(false);
    }
}
