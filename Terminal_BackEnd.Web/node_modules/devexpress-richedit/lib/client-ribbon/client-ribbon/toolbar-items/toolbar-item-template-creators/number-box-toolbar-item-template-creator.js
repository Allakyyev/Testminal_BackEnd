import { ToolbarItemTemplateCreator } from './base-types';
export class NumberBoxToolbarItemTemplateCreator extends ToolbarItemTemplateCreator {
    constructor(options) {
        super();
        this.options = options;
    }
    createTemplate() {
        const result = super.createTemplate();
        result['widget'] = 'dxNumberBox';
        result.options = this.getWidgetOptions();
        return result;
    }
    getWidgetOptions() {
        const optionsFormat = this.options.itemOptions.format;
        const format = optionsFormat == undefined || optionsFormat == null ? `${this.options.itemOptions.text} #0.#` : optionsFormat;
        return {
            placeholder: '',
            focusStateEnabled: false,
            hint: this.options.itemOptions.text,
            stylingMode: 'filled',
            format: format,
            value: this.options.itemOptions.value,
            width: this.options.itemOptions.width,
            showSpinButtons: true,
            min: this.options.itemOptions.min,
            max: this.options.itemOptions.max,
            step: this.options.itemOptions.step,
            onValueChanged: this.options.onValueChanged,
            onInitialized: this.options.onInitialized,
            elementAttr: { class: this.getCssClass() }
        };
    }
}
