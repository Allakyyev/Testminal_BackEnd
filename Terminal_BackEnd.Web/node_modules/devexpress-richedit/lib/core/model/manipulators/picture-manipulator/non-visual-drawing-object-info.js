export class NonVisualDrawingObjectInfo {
    copyFrom(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.title = obj.title;
        this.description = obj.description;
    }
    clone() {
        const result = new NonVisualDrawingObjectInfo();
        result.copyFrom(this);
        return result;
    }
}
