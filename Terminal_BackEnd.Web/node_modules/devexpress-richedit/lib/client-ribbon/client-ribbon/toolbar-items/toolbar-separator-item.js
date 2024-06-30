import { ToolbarItemBase } from './toolbar-item-base';
import { SeparatorToolbarItemTemplateCreator } from './toolbar-item-template-creators/separator-toolbar-item-template-creator';
export class ToolbarSeparatorItem extends ToolbarItemBase {
    static prepareElement(element) {
        const resolvedElement = element.classList ? element : element[0];
        if (!resolvedElement)
            return;
        const containerElement = resolvedElement.querySelector('.dx-toolbar-item-content');
        if (containerElement)
            containerElement.classList.add(ToolbarSeparatorItem.SeparatorContainerClassName);
    }
    getBuildTemplateStrategy() {
        return new SeparatorToolbarItemTemplateCreator();
    }
}
ToolbarSeparatorItem.SeparatorContainerClassName = 'dx-r-separator-container';
