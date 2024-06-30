import { ModelChangeType } from '../enums';
export class DifferentOddAndEvenPagesModelChange {
    constructor(newValue) {
        this.newValue = newValue;
        this.type = ModelChangeType.DifferentOddAndEvenPages;
    }
}
