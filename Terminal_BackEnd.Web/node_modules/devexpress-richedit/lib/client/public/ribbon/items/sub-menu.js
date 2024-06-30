import { RibbonItemBase, RibbonItemType } from './base';
import { RibbonButtonItem } from './button';
export class RibbonSubMenuItem extends RibbonItemBase {
    constructor(id, text, items = [], options = {}) {
        super(id, options.beginGroup);
        this.type = RibbonItemType.SubMenu;
        this.text = text;
        this.items = items;
        this.icon = options.icon;
        this.localizationId = options.localizationId;
    }
    convertToButton() {
        return new RibbonButtonItem(this.id, this.text, {
            showText: true,
            toggleMode: false,
            icon: this.icon,
            beginGroup: false,
            localizationId: this.localizationId,
        });
    }
}
