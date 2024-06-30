export class IdGenerator {
    constructor() {
        this.id = 0;
        this.documentRelationId = this.calcDocumentRelationId();
    }
    generateImageName(modelImageId) {
        return 'image' + modelImageId.toString();
    }
    generateImageRelationId(modelImageId) {
        return 'Image' + modelImageId.toString();
    }
    calcDocumentRelationId() {
        return `R${this.next().toString(16)}`;
    }
    calcCorePropertiesDocumentRelationId() {
        return 'core' + this.documentRelationId;
    }
    calcCustomPropertiesDocumentRelationId() {
        return 'custom' + this.documentRelationId;
    }
    next() {
        return this.id++;
    }
}
