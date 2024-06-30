import { LoadingPanelManagerBase } from '../../base/loading-panel/manager';
import { ClientLoadingPanel } from './panel';
import { ClientStatusBarLoadingPanel } from './status-bar-panel';
export class ClientLoadingPanelManager extends LoadingPanelManagerBase {
    constructor(canvas) {
        super();
        this.loadingPanel = new ClientLoadingPanel(canvas);
        this.statusBarLoadingPanel = new ClientStatusBarLoadingPanel();
    }
}
