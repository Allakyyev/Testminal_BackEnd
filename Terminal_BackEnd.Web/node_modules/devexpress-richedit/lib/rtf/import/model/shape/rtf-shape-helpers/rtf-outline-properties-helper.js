import { ColorHelper } from '../../../../../core/model/color/color';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
export class RtfOutlinePropertiesHelper {
    constructor(shapePropertiesInfo) {
        this.shapePropertiesInfo = shapePropertiesInfo;
    }
    applyProperties(shape) {
        const fLine = this.shapePropertiesInfo.getPropertyOrNull(RtfDrawingKeywords.Line);
        if (!fLine)
            return;
        this.processOutlineWidth(shape);
        this.processOutlineFill(shape);
    }
    processOutlineWidth(shape) {
        shape.outlineWidth = UnitConverter.emuToTwips(this.shapePropertiesInfo.getProperty(RtfDrawingKeywords.LineWidth, 9525));
    }
    processOutlineFill(shape) {
        const outlineColor = this.shapePropertiesInfo.getNullableColorProperty(RtfDrawingKeywords.LineColor);
        if (outlineColor)
            shape.outlineColor = outlineColor;
        else
            shape.outlineColor = ColorHelper.BLACK_COLOR;
    }
}
