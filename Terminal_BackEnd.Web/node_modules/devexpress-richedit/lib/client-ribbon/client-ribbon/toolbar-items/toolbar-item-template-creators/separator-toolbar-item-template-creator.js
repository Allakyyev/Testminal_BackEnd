import { DxtThemeCssClasses } from '../../../../dxt-utils/dxt-utils/dxt-theme-css-classes';
import { ToolbarItemTemplateCreator } from './base-types';
export class SeparatorToolbarItemTemplateCreator extends ToolbarItemTemplateCreator {
    createTemplate() {
        const result = super.createTemplate();
        result.disabled = true;
        result.dxIsSeparator = true;
        result.template = () => {
            const element = document.createElement('div');
            element.classList.add(SeparatorToolbarItemTemplateCreator.SeparatorClassName);
            element.classList.add(DxtThemeCssClasses.BorderColor);
            return element;
        };
        return result;
    }
}
SeparatorToolbarItemTemplateCreator.SeparatorClassName = 'dx-r-separator';
