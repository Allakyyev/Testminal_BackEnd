import { ModelChangeType } from '../../enums';
export class ShapePropertyChangedSubDocumentChange {
    constructor(subDocumentId, objectId, property, newState) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.ShapePropertyChanged;
    }
}
