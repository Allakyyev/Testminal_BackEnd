import { ToolbarInteractiveItem } from './toolbar-interactive-item';
import { SelectBoxToolbarItemTemplateCreator } from './toolbar-item-template-creators/select-box-toolbar-item-template-creator';
export class ToolbarSelectBoxItem extends ToolbarInteractiveItem {
    getBuildTemplateStrategy() {
        return new SelectBoxToolbarItemTemplateCreator({
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
