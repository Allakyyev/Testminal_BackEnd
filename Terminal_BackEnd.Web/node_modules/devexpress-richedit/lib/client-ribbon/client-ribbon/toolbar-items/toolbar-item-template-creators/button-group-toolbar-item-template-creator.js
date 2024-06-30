import { DxtUtils } from '../../../../dxt-utils/dxt-utils/dxt-utils';
import { ToolbarItemTemplateCreator } from './base-types';
export class ButtonGroupToolbarItemTemplateCreator extends ToolbarItemTemplateCreator {
    constructor(options) {
        super();
        this.options = options;
    }
    createTemplate() {
        const result = super.createTemplate();
        result.widget = 'dxButtonGroup';
        result.showText = !this.options.itemOptions.items[0] || !this.options.itemOptions.items[0].icon || this.options.itemOptions.alwaysShowText
            ? 'always'
            : 'inMenu';
        result.options = this.getButtonGroupOptions();
        return result;
    }
    getButtonGroupOptions() {
        return {
            focusStateEnabled: false,
            onInitialized: this.options.onInitialized,
            items: this.options.itemOptions.items.map(i => {
                const correctedItem = i;
                correctedItem.icon = correctedItem.icon ? DxtUtils.correctIconName(correctedItem.icon) : correctedItem.icon;
                return correctedItem;
            })
        };
    }
}
