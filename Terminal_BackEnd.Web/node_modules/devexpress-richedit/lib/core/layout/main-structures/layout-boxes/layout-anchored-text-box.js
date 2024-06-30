import { Errors } from '@devexpress/utils/lib/errors';
import { LayoutAnchoredObjectBox } from './layout-anchored-object-box';
import { LayoutBoxType } from './layout-box';
export class LayoutAnchoredTextBox extends LayoutAnchoredObjectBox {
    constructor(characterProperties, colorInfo, belongsToSubDocId, anchorInfo, shape, objectId, rotationInRadians, internalSubDocId, textBoxProperties) {
        super(characterProperties, colorInfo, belongsToSubDocId, anchorInfo, shape, objectId, rotationInRadians);
        this.internalSubDocId = internalSubDocId;
        this.textBoxProperties = textBoxProperties;
    }
    getType() {
        return LayoutBoxType.AnchorTextBox;
    }
    clone() {
        const newObject = new LayoutAnchoredTextBox(this.characterProperties, this.colorInfo, this.belongsToSubDocId, this.anchorInfo, this.shape, this.objectId, this.rotationInRadians, this.internalSubDocId, this.textBoxProperties);
        newObject.copyFrom(this);
        return newObject;
    }
    renderGetContent(_renderer) {
        throw Error(Errors.NotImplemented);
    }
}
