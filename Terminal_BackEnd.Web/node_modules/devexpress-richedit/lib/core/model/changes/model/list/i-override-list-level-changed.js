import { ModelChangeType } from '../../enums';
export class IOverrideListLevelChangedModelChange {
    constructor(property, newState) {
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.IOverrideListLevelChanged;
    }
}
