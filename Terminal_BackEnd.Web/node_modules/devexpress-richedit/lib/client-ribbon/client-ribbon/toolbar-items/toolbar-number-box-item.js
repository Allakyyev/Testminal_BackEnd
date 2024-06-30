import { ToolbarInteractiveItem } from './toolbar-interactive-item';
import { NumberBoxToolbarItemTemplateCreator } from './toolbar-item-template-creators/number-box-toolbar-item-template-creator';
export class ToolbarNumberBoxItem extends ToolbarInteractiveItem {
    getBuildTemplateStrategy() {
        return new NumberBoxToolbarItemTemplateCreator({
            itemOptions: this.options,
            onInitialized: this.getOnInitializedHandler(),
            onValueChanged: this.getOnValueChangedHandler()
        });
    }
    setValue(value) {
        this.widget.option('value', value);
    }
    getOnValueChangedHandler() {
        return this.onCommandExecuted ? (e) => {
            if (!e.event)
                return;
            this.onCommandExecuted({
                item: this,
                parameter: e.value
            });
        } : undefined;
    }
}
