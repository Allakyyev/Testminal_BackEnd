import { DrawingValueConstants } from '../../../../../core/model/drawing/drawing-value-constants';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
export class RtfBoundsCalculatorBase {
    constructor(shapePropertiesInfo) {
        this.shapePropertiesInfo = shapePropertiesInfo;
    }
    applyTransform2DAndGetActualSize(anchorInfo, size) {
        const left = this.getPosition(this.leftKeyword, 0);
        const top = this.getPosition(this.topKeyword, 0);
        const right = this.getPosition(this.rightKeyword, 0);
        const bottom = this.getPosition(this.bottomKeyword, 0);
        const result = new Size(Math.max(0, right - left), Math.max(0, bottom - top));
        anchorInfo.offset.x = left;
        anchorInfo.offset.y = top;
        this.shapePropertiesInfo.trySetProperty(RtfDrawingKeywords.Rotation, value => size.rotation = UnitConverter.fdToTwips(value));
        this.checkRotationAndSwapBox(anchorInfo, result, size.rotation);
        return result;
    }
    getPositionCore(_value) { throw new Error('not implemented'); }
    getPosition(keyword, defaultValue) {
        const position = this.shapePropertiesInfo.getPropertyOrNull(keyword);
        if (position)
            return this.getPositionCore(position);
        return defaultValue;
    }
    checkRotationAndSwapBox(anchorInfo, size, rotation) {
        if (!this.needToSwap(rotation))
            return;
        const currentCx = size.width;
        const currentCy = size.height;
        const deltaEmu = (UnitConverter.twipsToEmu(currentCy) - UnitConverter.twipsToEmu(currentCx)) / 2;
        const delta = UnitConverter.emuToTwips(deltaEmu);
        anchorInfo.offset.x += delta;
        anchorInfo.offset.y -= delta;
        size.width = currentCy;
        size.height = currentCx;
    }
    needToSwap(rotation) {
        let angle0To180 = rotation % (180 * DrawingValueConstants.OnePositiveFixedAngle);
        if (angle0To180 < 0)
            angle0To180 += 180 * DrawingValueConstants.OnePositiveFixedAngle;
        return angle0To180 >= 45 * DrawingValueConstants.OnePositiveFixedAngle && angle0To180 < 135 * DrawingValueConstants.OnePositiveFixedAngle;
    }
}
