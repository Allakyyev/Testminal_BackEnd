import { ModelChangeType } from '../../enums';
export class ListLevelPropertyChangedModelChange {
    constructor(property, newState) {
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.ListLevelPropertyChanged;
    }
}
