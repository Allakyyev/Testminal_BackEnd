import { ToolbarItemBase } from './toolbar-item-base';
export class ToolbarInteractiveItem extends ToolbarItemBase {
    constructor(options, onCommandExecuted) {
        super();
        this.options = options;
        this.onCommandExecuted = onCommandExecuted;
        this.name = options.name;
    }
    setEnabled(enabled) {
        this.widget.option('disabled', !enabled);
    }
    setVisible(visible) {
        this.widget.option('visible', visible);
    }
    getOnInitializedHandler() {
        return e => this.applyWidget(e);
    }
    applyWidget(e) {
        this.widget = e.component;
    }
}
