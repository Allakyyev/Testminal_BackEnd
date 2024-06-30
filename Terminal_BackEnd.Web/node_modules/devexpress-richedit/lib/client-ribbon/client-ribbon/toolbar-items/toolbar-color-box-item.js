import { ToolbarInteractiveItem } from './toolbar-interactive-item';
import { ColorBoxToolbarItemTemplateCreator } from './toolbar-item-template-creators/color-box-toolbar-item-template-creator';
export class ToolbarColorBoxItem extends ToolbarInteractiveItem {
    constructor(options, onCommandExecuted, onOpened, onClosed) {
        super(options, onCommandExecuted);
        this.onOpened = onOpened;
        this.onClosed = onClosed;
    }
    getBuildTemplateStrategy() {
        return new ColorBoxToolbarItemTemplateCreator({
            itemOptions: this.options,
            onInitialized: this.getOnInitializedHandler(),
            onValueChanged: this.getOnValueChangedHandler(),
            onOpened: this.getOnOpenedHandler(),
            onClosed: this.getOnClosedHandler(),
        });
    }
    setValue(value) {
        this.widget.option('value', value);
    }
    getOnOpenedHandler() {
        return this.onOpened ? () => {
            this.onOpened({
                item: this
            });
        } : undefined;
    }
    getOnClosedHandler() {
        return this.onClosed ? () => {
            this.onClosed({
                item: this
            });
        } : undefined;
    }
    getOnValueChangedHandler() {
        return this.onCommandExecuted ? (e) => {
            this.onCommandExecuted({
                item: this,
                parameter: e.value
            });
        } : undefined;
    }
}
