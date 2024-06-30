import { RtfDrawingKeywords } from '../../../translation-table/rtf-drawing-keywords';
import { RtfShapePropertiesInfo } from '../../model/shape/shape-properties-info';
import { DestinationType } from '../utils/destination-type';
import { ShapeDestinationBase } from './shape-destination-base';
export class ShapeDestination extends ShapeDestinationBase {
    get destinationType() { return DestinationType.ShapeDestination; }
    constructor(importer, shapeProperties = new RtfShapePropertiesInfo()) {
        super(importer, shapeProperties);
    }
    createClone() {
        return new ShapeDestination(this.importer, this.shapeProperties);
    }
    beforePopRtfState() {
        super.beforePopRtfState();
        const imageInfo = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.PictureBinaryData);
        if (imageInfo && imageInfo.base64) {
            this.importer.importers.image.insertImageShape(imageInfo, this.shapeProperties, false);
        }
        else {
            this.importer.importers.shape.insertShape(this.importer, this.shapeProperties);
        }
    }
}
