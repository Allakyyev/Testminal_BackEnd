import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { AnchoredObjectLevelType } from '../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { CompatibilityMode } from '../document-model';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectTextWrapSide, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from './enums';
export class AnchorInfo {
    constructor() {
        this.allowOverlap = true;
        this.hidden = false;
        this.layoutTableCell = false;
        this.locked = false;
        this.isBehindDoc = false;
        this.leftDistance = 188;
        this.rightDistance = 188;
        this.topDistance = 72;
        this.bottomDistance = 72;
        this.zOrder = 0;
        this.wrapType = AnchorObjectTextWrapType.Square;
        this.wrapSide = AnchorObjectTextWrapSide.Both;
        this.horizontalPositionType = AnchorObjectHorizontalPositionType.Column;
        this.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.Center;
        this.verticalPositionType = AnchorObjectVerticalPositionType.Paragraph;
        this.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        this.offset = new Point(0, 0);
        this.percentOffset = new Point(0, 0);
    }
    get levelType() {
        return this.wrapType != AnchorObjectTextWrapType.None ? AnchoredObjectLevelType.InText :
            (this.isBehindDoc ? AnchoredObjectLevelType.BehindText : AnchoredObjectLevelType.BeforeText);
    }
    getLevelTypeForRendering(isInHeaderFooter, compatibilityMode) {
        return this.wrapType != AnchorObjectTextWrapType.None && (compatibilityMode >= CompatibilityMode.Word2013 || !isInHeaderFooter) ? AnchoredObjectLevelType.InText :
            (this.isBehindDoc ? AnchoredObjectLevelType.BehindText : AnchoredObjectLevelType.BeforeText);
    }
    clone() {
        const anchorInfo = new AnchorInfo();
        anchorInfo.allowOverlap = this.allowOverlap;
        anchorInfo.hidden = this.hidden;
        anchorInfo.layoutTableCell = this.layoutTableCell;
        anchorInfo.locked = this.locked;
        anchorInfo.isBehindDoc = this.isBehindDoc;
        anchorInfo.leftDistance = this.leftDistance;
        anchorInfo.rightDistance = this.rightDistance;
        anchorInfo.topDistance = this.topDistance;
        anchorInfo.bottomDistance = this.bottomDistance;
        anchorInfo.zOrder = this.zOrder;
        anchorInfo.wrapType = this.wrapType;
        anchorInfo.wrapSide = this.wrapSide;
        anchorInfo.horizontalPositionType = this.horizontalPositionType;
        anchorInfo.horizontalPositionAlignment = this.horizontalPositionAlignment;
        anchorInfo.verticalPositionType = this.verticalPositionType;
        anchorInfo.verticalPositionAlignment = this.verticalPositionAlignment;
        anchorInfo.offset = this.offset.clone();
        anchorInfo.percentOffset = this.percentOffset.clone();
        return anchorInfo;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.allowOverlap == obj.allowOverlap &&
            this.hidden == obj.hidden &&
            this.layoutTableCell == obj.layoutTableCell &&
            this.locked == obj.locked &&
            this.isBehindDoc == obj.isBehindDoc &&
            this.leftDistance == obj.leftDistance &&
            this.rightDistance == obj.rightDistance &&
            this.topDistance == obj.topDistance &&
            this.bottomDistance == obj.bottomDistance &&
            this.zOrder == obj.zOrder &&
            this.wrapType == obj.wrapType &&
            this.wrapSide == obj.wrapSide &&
            this.horizontalPositionType == obj.horizontalPositionType &&
            this.horizontalPositionAlignment == obj.horizontalPositionAlignment &&
            this.verticalPositionType == obj.verticalPositionType &&
            this.verticalPositionAlignment == obj.verticalPositionAlignment &&
            this.offset.equals(obj.offset) &&
            this.percentOffset.equals(obj.percentOffset);
    }
    isUsedHorizontalAlignment() {
        if (!this.horizontalPositionAlignment)
            return false;
        switch (this.horizontalPositionAlignment) {
            case AnchorObjectHorizontalPositionAlignment.Left:
            case AnchorObjectHorizontalPositionAlignment.Center:
            case AnchorObjectHorizontalPositionAlignment.Right:
                return true;
        }
        return false;
    }
    isUsedHorizontalBookLayout() {
        if (!this.horizontalPositionAlignment)
            return false;
        switch (this.horizontalPositionAlignment) {
            case AnchorObjectHorizontalPositionAlignment.Outside:
            case AnchorObjectHorizontalPositionAlignment.Inside:
                return true;
        }
        return false;
    }
    isUsedHorizontalAbsolutePosition() {
        return !this.horizontalPositionAlignment && !this.isUsedHorizontalRelativePosition();
    }
    isUsedHorizontalRelativePosition() {
        return this.percentOffset.x > 0;
    }
    isUsedVerticalAlignment() {
        return !!this.verticalPositionAlignment;
    }
    isUsedVerticalAbsolutePosition() {
        return !this.isUsedVerticalAlignment() && !this.isUsedVerticalRelativePosition();
    }
    isUsedVerticalRelativePosition() {
        return this.percentOffset.y > 0;
    }
    getRelativeOffsetX(width) {
        return width * this.percentOffset.x / AnchorInfo.RELATIVE_COEFF;
    }
    getRelativeOffsetY(width) {
        return width * this.percentOffset.y / AnchorInfo.RELATIVE_COEFF;
    }
    getDistanceMargins() {
        return new Margins(this.leftDistance, this.rightDistance, this.topDistance, this.bottomDistance)
            .applyConverter(UnitConverter.twipsToPixels);
    }
}
AnchorInfo.RELATIVE_COEFF = 100000;
