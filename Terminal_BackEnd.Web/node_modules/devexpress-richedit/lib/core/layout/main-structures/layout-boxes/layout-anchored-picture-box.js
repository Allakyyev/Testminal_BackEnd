import { LayoutAnchoredObjectBox } from './layout-anchored-object-box';
import { LayoutBoxType } from './layout-box';
export class LayoutAnchoredPictureBox extends LayoutAnchoredObjectBox {
    constructor(characterProperties, colorInfo, belongsToSubDocId, anchorInfo, shape, objectId, rotationInRadians, cacheInfo) {
        super(characterProperties, colorInfo, belongsToSubDocId, anchorInfo, shape, objectId, rotationInRadians);
        this.cacheInfo = cacheInfo;
        this.isLoaded = this.cacheInfo.isLoaded;
    }
    getType() {
        return LayoutBoxType.AnchorPicture;
    }
    equals(obj) {
        return super.equals(obj) && this.cacheInfo.equals(obj.cacheInfo) && this.isLoaded == obj.isLoaded;
    }
    clone() {
        const newObject = new LayoutAnchoredPictureBox(this.characterProperties, this.colorInfo, this.belongsToSubDocId, this.anchorInfo, this.shape, this.objectId, this.rotationInRadians, this.cacheInfo);
        newObject.copyFrom(this);
        return newObject;
    }
    renderGetContent(renderer) {
        return renderer.renderPictureBoxContent(this.createSize(), this.cacheInfo, this.hyperlinkTip);
    }
}
