import { ModelChangeType } from '../../enums';
export class AbstractNumberingListDeletedModelChange {
    constructor(index) {
        this.index = index;
        this.type = ModelChangeType.AbstractNumberingListDeleted;
    }
}
