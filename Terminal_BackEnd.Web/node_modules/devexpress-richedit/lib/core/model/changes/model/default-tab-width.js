import { ModelChangeType } from '../enums';
export class DefaultTabWidthModelChange {
    constructor(newDefaultTabWidth) {
        this.newDefaultTabWidth = newDefaultTabWidth;
        this.type = ModelChangeType.DefaultTabWidth;
    }
}
