import { RibbonItemBase, RibbonItemType } from './base';
export class RibbonNumberBoxItem extends RibbonItemBase {
    constructor(id, text, options = {}) {
        super(id, options.beginGroup);
        this.type = RibbonItemType.NumberBox;
        this.text = text;
        this.min = options.min;
        this.max = options.max;
        this.step = options.step === undefined ? 1 : options.step;
        this.width = options.width;
        this.localizationId = options.localizationId;
        this.format = options.format;
        this.value = options.value;
    }
}
