import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
export class RtfDrawingObjectRunPropertiesHelper {
    constructor(shapeProperties) {
        this.shapeProperties = shapeProperties;
    }
    applyProperties(anchorInfo) {
        this.applyTextWrap(anchorInfo);
    }
    applyTextWrap(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.ShapeWrapTextType, value => anchorInfo.wrapType = value);
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.ShapeWrapTextSide, value => anchorInfo.wrapSide = value);
    }
}
