import { LoadingPanelBase } from '../../base/loading-panel/panel';
export class ClientBuiltinStatusBarLoadingPanel {
    constructor() {
        this.visible = false;
    }
    dispose() { }
    show() { }
    hide() { }
}
export class ClientStatusBarLoadingPanel extends LoadingPanelBase {
    constructor() {
        super(...arguments);
        this.loadingPanel = new ClientBuiltinStatusBarLoadingPanel();
    }
}
