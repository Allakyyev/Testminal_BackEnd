import { ModelChangeType } from '../../enums';
export class ListLevelCharacterPropertyChangedModelChange {
    constructor(property, newState) {
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.ListLevelCharacterPropertyChanged;
    }
}
