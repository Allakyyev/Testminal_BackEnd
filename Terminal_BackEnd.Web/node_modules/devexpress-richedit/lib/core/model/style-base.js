export class StyleBase {
    constructor(styleName, localizedName, deleted, hidden, semihidden, isDefault, base64EncodedImage, id) {
        this.styleName = styleName;
        this.deleted = deleted;
        this.localizedName = localizedName;
        this.hidden = hidden;
        this.semihidden = semihidden;
        this.isDefault = isDefault;
        this.base64EncodedImage = base64EncodedImage ? base64EncodedImage : null;
        this.id = id;
    }
    equalsByName(obj) {
        return this.styleName == obj.styleName;
    }
}
