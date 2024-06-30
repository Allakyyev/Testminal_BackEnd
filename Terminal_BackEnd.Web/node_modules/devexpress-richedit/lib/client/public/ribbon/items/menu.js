import { RibbonItemBase, RibbonItemType } from './base';
export class RibbonMenuItem extends RibbonItemBase {
    constructor(id, text, items, options = {}) {
        super(id, options.beginGroup);
        this.type = RibbonItemType.Menu;
        this.showText = false;
        this.text = text;
        this.items = items;
        this.icon = options.icon;
        this.localizationId = options.localizationId;
        this.showText = options.showText === undefined ? false : options.showText;
    }
}
