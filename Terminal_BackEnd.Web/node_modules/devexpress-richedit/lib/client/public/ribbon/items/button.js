import { RibbonItemBase, RibbonItemType } from './base';
export class RibbonButtonItem extends RibbonItemBase {
    constructor(id, text, options = {}) {
        super(id, options.beginGroup);
        this.type = RibbonItemType.Button;
        this.text = text;
        this.icon = options.icon;
        this.localizationId = options.localizationId;
        this.showText = options.showText === undefined ? false : options.showText;
        this.toggleMode = options.toggleMode === undefined ? false : options.toggleMode;
        this.selected = options.selected === undefined ? false : options.selected;
    }
}
