import { ClientPublicUiChangesListener } from '../public/commands/ui-changes-listener';
export class ClientBarHolder {
    constructor(ribbon, contextMenu, raiseUpdatePublicUi) {
        this.ribbon = ribbon;
        this.contextMenu = contextMenu;
        this.publicUiChangesListener = new ClientPublicUiChangesListener(raiseUpdatePublicUi);
    }
    initialize(core) {
        var _a;
        (_a = this.ribbon) === null || _a === void 0 ? void 0 : _a.initialize(core);
        this.contextMenu.initialize(core);
    }
    updateItemsState(queryCommands) {
        var _a;
        (_a = this.ribbon) === null || _a === void 0 ? void 0 : _a.updateItemsState(queryCommands);
        this.contextMenu.updateItemsState(queryCommands);
        this.publicUiChangesListener.forceUpdate(queryCommands);
    }
    setEnabled(_value) { }
    removeRibbonBar() {
        var _a;
        (_a = this.ribbon) === null || _a === void 0 ? void 0 : _a.dispose();
        this.ribbon = null;
    }
    dispose() {
        var _a;
        this.contextMenu.dispose();
        (_a = this.ribbon) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    forceUpdate(queryCommands) {
        var _a;
        (_a = this.ribbon) === null || _a === void 0 ? void 0 : _a.forceUpdate(queryCommands);
        this.contextMenu.forceUpdate(queryCommands);
        this.horizontalRuler.forceUpdate(queryCommands);
        this.publicUiChangesListener.forceUpdate(queryCommands);
    }
    enableUpdate(value) {
        if (this.ribbon)
            this.ribbon.updateEnabled = value;
        this.contextMenu.updateEnabled = value;
        this.horizontalRuler.updateEnabled = value;
        this.publicUiChangesListener.updateEnabled = value;
    }
}
