import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class RulerShadow {
    constructor(templateElement) {
        this.element = templateElement.cloneNode(true);
        this.element.style.opacity = '0.5';
        this.element.style.display = '';
        templateElement.parentNode.appendChild(this.element);
    }
    dispose() {
        DomUtils.hideNode(this.element);
    }
}
