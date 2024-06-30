import { StyleBase } from '../style-base';
export class NumberingListStyle extends StyleBase {
    constructor(styleName, localizedName, deleted, hidden, semihidden, isDefault, numberingListIndex, id) {
        super(styleName, localizedName, deleted, hidden, semihidden, isDefault, id);
        this.numberingListIndex = numberingListIndex;
    }
    clone() {
        return new NumberingListStyle(this.styleName, this.localizedName, this.deleted, this.hidden, this.semihidden, this.isDefault, this.numberingListIndex, this.id);
    }
}
