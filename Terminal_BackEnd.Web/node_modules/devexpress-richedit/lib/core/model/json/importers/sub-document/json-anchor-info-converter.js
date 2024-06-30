import { Point } from '@devexpress/utils/lib/geometry/point';
import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { AnchorInfo } from '../../../floating-objects/anchor-info';
import { JSONAnchorInfoProperty } from '../../enums/json-floating-enums';
export class JSONAnchorInfoConverter {
    static convertFromJSON(obj) {
        const result = new AnchorInfo();
        result.allowOverlap = !!obj[JSONAnchorInfoProperty.AllowOverlap];
        result.hidden = !!obj[JSONAnchorInfoProperty.Hidden];
        result.layoutTableCell = !!obj[JSONAnchorInfoProperty.LayoutTableCell];
        result.locked = !!obj[JSONAnchorInfoProperty.Locked];
        result.isBehindDoc = !!obj[JSONAnchorInfoProperty.IsBehindDoc];
        result.leftDistance = obj[JSONAnchorInfoProperty.LeftDistance];
        result.rightDistance = obj[JSONAnchorInfoProperty.RightDistance];
        result.topDistance = obj[JSONAnchorInfoProperty.TopDistance];
        result.bottomDistance = obj[JSONAnchorInfoProperty.BottomDistance];
        result.zOrder = obj[JSONAnchorInfoProperty.ZOrder];
        result.wrapType = obj[JSONAnchorInfoProperty.WrapType];
        result.wrapSide = obj[JSONAnchorInfoProperty.WrapSide];
        result.horizontalPositionType = obj[JSONAnchorInfoProperty.HorizontalPositionType];
        result.horizontalPositionAlignment = obj[JSONAnchorInfoProperty.HorizontalPositionAlignment];
        result.verticalPositionType = obj[JSONAnchorInfoProperty.VerticalPositionType];
        result.verticalPositionAlignment = obj[JSONAnchorInfoProperty.VerticalPositionAlignment];
        result.offset = new Point(obj[JSONAnchorInfoProperty.OffsetX], obj[JSONAnchorInfoProperty.OffsetY]);
        result.percentOffset = new Point(obj[JSONAnchorInfoProperty.PercentOffsetX], obj[JSONAnchorInfoProperty.PercentOffsetY]);
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONAnchorInfoProperty.AllowOverlap] = boolToInt(source.allowOverlap);
        result[JSONAnchorInfoProperty.Hidden] = boolToInt(source.hidden);
        result[JSONAnchorInfoProperty.LayoutTableCell] = boolToInt(source.layoutTableCell);
        result[JSONAnchorInfoProperty.Locked] = boolToInt(source.locked);
        result[JSONAnchorInfoProperty.IsBehindDoc] = boolToInt(source.isBehindDoc);
        result[JSONAnchorInfoProperty.LeftDistance] = source.leftDistance;
        result[JSONAnchorInfoProperty.RightDistance] = source.rightDistance;
        result[JSONAnchorInfoProperty.TopDistance] = source.topDistance;
        result[JSONAnchorInfoProperty.BottomDistance] = source.bottomDistance;
        result[JSONAnchorInfoProperty.ZOrder] = source.zOrder;
        result[JSONAnchorInfoProperty.WrapType] = source.wrapType;
        result[JSONAnchorInfoProperty.WrapSide] = source.wrapSide;
        result[JSONAnchorInfoProperty.HorizontalPositionType] = source.horizontalPositionType;
        result[JSONAnchorInfoProperty.HorizontalPositionAlignment] = source.horizontalPositionAlignment;
        result[JSONAnchorInfoProperty.VerticalPositionType] = source.verticalPositionType;
        result[JSONAnchorInfoProperty.VerticalPositionAlignment] = source.verticalPositionAlignment;
        result[JSONAnchorInfoProperty.OffsetX] = source.offset.x;
        result[JSONAnchorInfoProperty.OffsetY] = source.offset.y;
        result[JSONAnchorInfoProperty.PercentOffsetX] = source.percentOffset.x;
        result[JSONAnchorInfoProperty.PercentOffsetY] = source.percentOffset.y;
        return result;
    }
}
