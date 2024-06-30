import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
import { RtfBoundsCalculatorBase } from './rtf-bounds-calculator-base';
export class RtfTopmostShapeBoundsCalculator extends RtfBoundsCalculatorBase {
    constructor(shapePropertiesInfo) {
        super(shapePropertiesInfo);
    }
    get bottomKeyword() {
        return RtfDrawingKeywords.ShapeBottom;
    }
    get leftKeyword() {
        return RtfDrawingKeywords.ShapeLeft;
    }
    get rightKeyword() {
        return RtfDrawingKeywords.ShapeRight;
    }
    get topKeyword() {
        return RtfDrawingKeywords.ShapeTop;
    }
    get flipHKeyword() {
        return RtfDrawingKeywords.FlipH;
    }
    get flipVKeyword() {
        return RtfDrawingKeywords.FlipV;
    }
    getPositionCore(value) {
        return value;
    }
}
