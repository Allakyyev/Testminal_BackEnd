import { ToolbarInteractiveItem } from './toolbar-interactive-item';
import { ButtonGroupToolbarItemTemplateCreator } from './toolbar-item-template-creators/button-group-toolbar-item-template-creator';
export class ToolbarButtonGroupItem extends ToolbarInteractiveItem {
    getBuildTemplateStrategy() {
        return new ButtonGroupToolbarItemTemplateCreator({
            itemOptions: this.options,
            onInitialized: this.getOnInitializedHandler(),
            onClick: this.getOnClickHandler()
        });
    }
    setValue(_value) {
    }
    getOnClickHandler() {
        return this.onCommandExecuted ? () => {
            this.onCommandExecuted({
                item: this,
                parameter: null
            });
        } : undefined;
    }
}
ToolbarButtonGroupItem.ToggleStateClassName = 'dx-r-toggle';
ToolbarButtonGroupItem.ToggleButtonDataProperty = 'dx-ri-value';
