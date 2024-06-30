import { ModelChangeType } from '../../enums';
export class AbstractNumberingListAddedModelChange {
    constructor(index) {
        this.index = index;
        this.type = ModelChangeType.AbstractNumberingListAdded;
    }
}
