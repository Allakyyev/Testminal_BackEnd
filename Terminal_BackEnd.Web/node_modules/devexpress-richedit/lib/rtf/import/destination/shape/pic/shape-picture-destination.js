import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
import { ShapeTypeCode } from '../../../model/shape/shape-type-code';
import { DestinationBase } from '../../base/destination';
import { PictureDestination } from '../../picture/picture-destination';
import { DestinationType } from '../../utils/destination-type';
export class ShapePictureDestination extends DestinationBase {
    get destinationType() { return DestinationType.ShapePictureDestination; }
    get controlCharHT() { return null; }
    static onPictKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new PictureDestination(importer);
    }
    createClone() {
        return new ShapePictureDestination(this.importer);
    }
    nestedGroupFinished(nestedDestination) {
        if (nestedDestination instanceof PictureDestination) {
            this.imageInfo = nestedDestination.getImageInfo();
            this.shapeProperties = nestedDestination.info.properties;
        }
    }
    beforePopRtfState() {
        this.prepareInfo();
        this.importer.importers.image.insertImageShape(this.imageInfo, this.shapeProperties);
    }
    prepareInfo() {
        if (!this.imageInfo || !this.imageInfo.actualSize)
            return;
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeLeft, 0);
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeRight, this.imageInfo.actualSize.width);
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeTop, 0);
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeBottom, this.imageInfo.actualSize.height);
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeType, ShapeTypeCode.PictureFrame);
        this.shapeProperties.addProperty(RtfDrawingKeywords.PseudoInline, ShapePictureDestination.trueIntValue);
        this.shapeProperties.addProperty(RtfDrawingKeywords.PictureBinaryData, this.imageInfo);
    }
}
ShapePictureDestination.trueIntValue = 1;
