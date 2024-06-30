import { LoadingPanelBase } from '../../base/loading-panel/panel';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class ClientBuiltinLoadingPanel {
    constructor(canvas) {
        this.visible = false;
        this.canvas = canvas;
    }
    dispose() {
        this.canvas = null;
        DomUtils.hideNode(this.panelElem);
        this.panelElem = null;
    }
    show() {
        this.getLoadingPanel().style.display = "block";
        this.visible = true;
    }
    hide() {
        this.getLoadingPanel().style.display = "none";
        this.visible = false;
    }
    getLoadingPanel() {
        if (!this.panelElem) {
            this.panelElem = document.createElement('div');
            this.panelElem.className = 'dxreLoadingPanel';
            const innerElement = document.createElement('div');
            innerElement.className = 'lp';
            this.panelElem.appendChild(innerElement);
            this.canvas.appendChild(this.panelElem);
        }
        return this.panelElem;
    }
}
export class ClientLoadingPanel extends LoadingPanelBase {
    constructor(canvas) {
        super();
        this.loadingPanel = new ClientBuiltinLoadingPanel(canvas);
    }
}
