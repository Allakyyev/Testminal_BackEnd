export class LoadingPanelManagerBase {
    dispose() {
        this.loadingPanel.dispose();
        this.statusBarLoadingPanel.dispose();
    }
}
