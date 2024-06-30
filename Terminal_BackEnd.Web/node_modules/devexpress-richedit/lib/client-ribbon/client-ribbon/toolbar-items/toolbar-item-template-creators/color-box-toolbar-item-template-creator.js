import dxColorBox from 'devextreme/ui/color_box';
import { ToolbarItemTemplateCreator } from './base-types';
export class ColorBoxToolbarItemTemplateCreator extends ToolbarItemTemplateCreator {
    constructor(options) {
        super();
        this.options = options;
    }
    createTemplate() {
        const result = super.createTemplate();
        result.widget = 'dxColorBox';
        const widgetOptions = this.getWidgetOptions();
        if (this.shouldCreateTextContentTemplate(this.options.itemOptions.textOptions))
            result.template = this.createTextContentTemplate(this.options.itemOptions.textOptions, widgetOptions, dxColorBox);
        else
            result.options = widgetOptions;
        return result;
    }
    getWidgetOptions() {
        return {
            placeholder: '',
            focusStateEnabled: false,
            acceptCustomValue: false,
            stylingMode: 'filled',
            hint: this.options.itemOptions.text,
            value: this.options.itemOptions.value,
            width: 75,
            onValueChanged: this.options.onValueChanged,
            onInitialized: this.options.onInitialized,
            onContentReady: (e) => {
                const element = e.element.querySelector ? e.element : e.element[0];
                element.querySelector('.dx-colorbox-color-result-preview')
                    .addEventListener('click', () => {
                    this.options.onValueChanged({
                        component: e.component,
                        element: element,
                        model: e.model,
                        value: e.component.option('value')
                    });
                });
            },
            onOpened: this.options.onOpened,
            onClosed: this.options.onClosed,
            elementAttr: { class: this.getCssClass() }
        };
    }
}
