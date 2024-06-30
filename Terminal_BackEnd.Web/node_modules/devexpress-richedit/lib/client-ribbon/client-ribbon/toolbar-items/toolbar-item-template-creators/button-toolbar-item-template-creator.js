import { DxtUtils } from '../../../../dxt-utils/dxt-utils/dxt-utils';
import { ToolbarItemTemplateCreator } from './base-types';
export class ButtonToolbarItemTemplateCreator extends ToolbarItemTemplateCreator {
    constructor(options) {
        super();
        this.options = options;
    }
    createTemplate() {
        const result = super.createTemplate();
        result.widget = 'dxButton';
        result.showText = !this.options.itemOptions.icon || this.options.itemOptions.alwaysShowText ? 'always' : 'inMenu';
        result.options = this.getButtonOptions();
        return result;
    }
    getButtonOptions() {
        return {
            text: this.options.itemOptions.text,
            icon: this.options.itemOptions.icon ? DxtUtils.correctIconName(this.options.itemOptions.icon) : undefined,
            hint: this.options.itemOptions.text,
            stylingMode: 'text',
            focusStateEnabled: false,
            onInitialized: this.options.onInitialized,
            onClick: this.options.onClick
        };
    }
}
