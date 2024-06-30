import { Size } from '@devexpress/utils/lib/geometry/size';
import { AnchorInfo } from '../../floating-objects/anchor-info';
import { PictureSize } from '../../floating-objects/sizes';
import { Shape } from '../../shapes/shape';
import { NonVisualDrawingObjectInfo } from './non-visual-drawing-object-info';
export class BasePictureInfo {
    constructor(size, shape, containerProperties, drawingProperties) {
        this.size = size;
        this.shape = shape;
        this.containerProperties = containerProperties;
        this.nonVisualDrawingProperties = drawingProperties;
    }
    get cacheInfo() { return this.size.cacheInfo; }
}
export class InlinePictureInfo extends BasePictureInfo {
    constructor(size, shape, publicAPIID, containerProperties, drawingProperties) {
        super(size, shape, containerProperties, drawingProperties);
        this.publicAPIID = publicAPIID;
    }
    clone() {
        return new InlinePictureInfo(this.size.clone(), this.shape.clone(), this.publicAPIID, this.containerProperties.clone(), this.nonVisualDrawingProperties.clone());
    }
    cloneToNewSubDocument(subDocument) {
        return new InlinePictureInfo(this.size.cloneToNewSubDocument(subDocument), this.shape.clone(), this.publicAPIID, this.containerProperties.clone(), this.nonVisualDrawingProperties.clone());
    }
    static defaultInfo(cacheInfo, scale = new Size(100, 100)) {
        return new InlinePictureInfo(new PictureSize(true, 0, cacheInfo, scale), new Shape(), -1, new NonVisualDrawingObjectInfo(), new NonVisualDrawingObjectInfo());
    }
}
export class AnchorPictureInfo extends BasePictureInfo {
    constructor(size, shape, anchorInfo, containerProperties, drawingProperties) {
        super(size, shape, containerProperties, drawingProperties);
        this.anchorInfo = anchorInfo;
    }
    clone() {
        return new AnchorPictureInfo(this.size.clone(), this.shape.clone(), this.anchorInfo.clone(), this.containerProperties.clone(), this.nonVisualDrawingProperties.clone());
    }
    cloneToNewSubDocument(subDocument) {
        return new AnchorPictureInfo(this.size.cloneToNewSubDocument(subDocument), this.shape.clone(), this.anchorInfo.clone(), new NonVisualDrawingObjectInfo(), new NonVisualDrawingObjectInfo());
    }
    static defaultInfo(cacheInfo, scale = new Size(100, 100)) {
        return new AnchorPictureInfo(new PictureSize(true, 0, cacheInfo, scale), new Shape(), new AnchorInfo(), new NonVisualDrawingObjectInfo(), new NonVisualDrawingObjectInfo());
    }
}
