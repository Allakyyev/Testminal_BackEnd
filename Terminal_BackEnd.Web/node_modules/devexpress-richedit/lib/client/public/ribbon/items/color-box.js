import { RibbonItemBase, RibbonItemType } from './base';
export class RibbonColorBoxItem extends RibbonItemBase {
    constructor(id, text, value, options = {}) {
        var _a;
        super(id, options.beginGroup);
        this.type = RibbonItemType.ColorBox;
        this.text = text;
        this.value = value;
        this.localizationId = options.localizationId;
        this.textOptions = (_a = options.textOptions) !== null && _a !== void 0 ? _a : {};
    }
}
