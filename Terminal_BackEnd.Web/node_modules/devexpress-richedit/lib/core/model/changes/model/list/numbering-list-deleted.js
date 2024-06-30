import { ModelChangeType } from '../../enums';
export class NumberingListDeletedModelChange {
    constructor(index) {
        this.index = index;
        this.type = ModelChangeType.NumberingListDeleted;
    }
}
