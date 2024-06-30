import { JSONAnchorInfoProperty } from '../../json/enums/json-floating-enums';
import { BaseManipulator } from '../base-manipulator';
import { AnchorInfoPropertyManipulator } from './anchor-info-property-manipulator';
export class AnchorInfoManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.allowOverlap = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.AllowOverlap, (prop, val) => prop.allowOverlap = val, (prop) => prop.allowOverlap);
        this.hidden = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.Hidden, (prop, val) => prop.hidden = val, (prop) => prop.hidden);
        this.layoutTableCell = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.LayoutTableCell, (prop, val) => prop.layoutTableCell = val, (prop) => prop.layoutTableCell);
        this.locked = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.Locked, (prop, val) => prop.locked = val, (prop) => prop.locked);
        this.isBehindDoc = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.IsBehindDoc, (prop, val) => prop.isBehindDoc = val, (prop) => prop.isBehindDoc);
        this.leftDistance = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.LeftDistance, (prop, val) => prop.leftDistance = val, (prop) => prop.leftDistance);
        this.rightDistance = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.RightDistance, (prop, val) => prop.rightDistance = val, (prop) => prop.rightDistance);
        this.topDistance = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.TopDistance, (prop, val) => prop.topDistance = val, (prop) => prop.topDistance);
        this.bottomDistance = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.BottomDistance, (prop, val) => prop.bottomDistance = val, (prop) => prop.bottomDistance);
        this.zOrder = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.ZOrder, (prop, val) => prop.zOrder = val, (prop) => prop.zOrder);
        this.wrapType = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.WrapType, (prop, val) => prop.wrapType = val, (prop) => prop.wrapType);
        this.wrapSide = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.WrapSide, (prop, val) => prop.wrapSide = val, (prop) => prop.wrapSide);
        this.horizontalPositionType = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.HorizontalPositionType, (prop, val) => prop.horizontalPositionType = val, (prop) => prop.horizontalPositionType);
        this.horizontalPositionAlignment = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.HorizontalPositionAlignment, (prop, val) => prop.horizontalPositionAlignment = val, (prop) => prop.horizontalPositionAlignment);
        this.verticalPositionType = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.VerticalPositionType, (prop, val) => prop.verticalPositionType = val, (prop) => prop.verticalPositionType);
        this.verticalPositionAlignment = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.VerticalPositionAlignment, (prop, val) => prop.verticalPositionAlignment = val, (prop) => prop.verticalPositionAlignment);
        this.offsetX = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.OffsetX, (prop, val) => prop.offset.x = val, (prop) => prop.offset.x);
        this.offsetY = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.OffsetY, (prop, val) => prop.offset.y = val, (prop) => prop.offset.y);
        this.percentOffsetX = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.PercentOffsetX, (prop, val) => prop.percentOffset.x = val, (prop) => prop.percentOffset.x);
        this.percentOffsetY = new AnchorInfoPropertyManipulator(manipulator, JSONAnchorInfoProperty.PercentOffsetY, (prop, val) => prop.percentOffset.y = val, (prop) => prop.percentOffset.y);
    }
}
