import { ModelChangeType } from '../enums';
export class PageColorModelChange {
    constructor(newColor) {
        this.newColor = newColor;
        this.type = ModelChangeType.PageColor;
    }
}
