import { ModelChangeType } from '../../enums';
export class NumberingListAddedModelChange {
    constructor(index) {
        this.index = index;
        this.type = ModelChangeType.NumberingListAdded;
    }
}
