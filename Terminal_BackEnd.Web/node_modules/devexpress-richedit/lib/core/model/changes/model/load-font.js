import { ModelChangeType } from '../enums';
export class LoadFontInfoModelChange {
    constructor(fontInfo) {
        this.fontInfo = fontInfo;
        this.type = ModelChangeType.LoadFontInfo;
    }
}
