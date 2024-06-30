import { ModelChangeType } from '../../enums';
export class ListLevelParagraphPropertyChangedModelChange {
    constructor(property, newState) {
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.ListLevelParagraphPropertyChanged;
    }
}
