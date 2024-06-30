import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
export class RtfDrawingTextBodyPropertiesHelper {
    constructor(shapePropertiesInfo) {
        this.shapePropertiesInfo = shapePropertiesInfo;
    }
    applyProperties(properties) {
        this.processInsetLeft(properties);
        this.processInsertRight(properties);
        this.processInsertTop(properties);
        this.processInsetBottom(properties);
        this.processFitShapeToText(properties);
        this.processWrapText(properties);
    }
    processInsetLeft(properties) {
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.TextLeft, value => properties.leftMargin = UnitConverter.emuToTwips(value));
    }
    processInsertRight(properties) {
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.TextRight, value => properties.rightMargin = UnitConverter.emuToTwips(value));
    }
    processInsertTop(properties) {
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.TextTop, value => properties.topMargin = UnitConverter.emuToTwips(value));
    }
    processInsetBottom(properties) {
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.TextBottom, value => properties.bottomMargin = UnitConverter.emuToTwips(value));
    }
    processFitShapeToText(properties) {
        const fitShapeToText = this.shapePropertiesInfo.getPropertyOrNull(RtfDrawingKeywords.FitShapeToText);
        if (isDefined(fitShapeToText))
            properties.resizeShapeToFitText = fitShapeToText != 0;
        else
            properties.resizeShapeToFitText = false;
    }
    processWrapText(properties) {
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.WrapText, value => properties.wrapText = value);
    }
}
