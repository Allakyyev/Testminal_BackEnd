import dxSelectBox from 'devextreme/ui/select_box';
import { ToolbarDropDownItemTemplateCreator } from './base-types';
export class SelectBoxToolbarItemTemplateCreator extends ToolbarDropDownItemTemplateCreator {
    constructor(options) {
        super();
        this.options = options;
    }
    createTemplate() {
        const result = super.createTemplate();
        result.widget = 'dxSelectBox';
        const widgetOptions = this.getWidgetOptions();
        if (this.shouldCreateTextContentTemplate(this.options.itemOptions.textOptions))
            result.template = this.createTextContentTemplate(this.options.itemOptions.textOptions, widgetOptions, dxSelectBox);
        else
            result.options = widgetOptions;
        return result;
    }
    getOnCustomItemCreating(itemOptions) {
        return itemOptions.acceptCustomValue && itemOptions.onCustomItemCreating ? itemOptions.onCustomItemCreating :
            function (e) { if (!e.customItem) {
                e.customItem = e.text;
            } };
    }
    getWidgetOptions() {
        const itemOptions = this.options.itemOptions;
        return {
            placeholder: itemOptions.placeholder,
            stylingMode: 'filled',
            searchEnabled: true,
            acceptCustomValue: itemOptions.acceptCustomValue,
            dataSource: itemOptions.dataSource,
            width: itemOptions.width,
            displayExpr: itemOptions.displayExpr,
            valueExpr: itemOptions.valueExpr,
            value: itemOptions.value,
            showClearButton: itemOptions.showClearButton,
            onValueChanged: this.options.onValueChanged,
            onInitialized: this.options.onInitialized,
            onFocusOut: super.getOnFocusOut(),
            onKeyDown: super.getOnKeyDown(),
            onCustomItemCreating: this.getOnCustomItemCreating(itemOptions),
            elementAttr: { class: this.getCssClass() }
        };
    }
}
