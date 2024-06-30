import { AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionType, RelativeHeightType, RelativeWidthType } from '../../../../../core/model/floating-objects/enums';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
import { ShapePropertiesDestinationBase } from '../../../destination/shape/shape-properties-destination-base';
export class RtfContainerPropertiesHelper {
    constructor(shapeProperties) {
        this.shapeProperties = shapeProperties;
    }
    applyProperties(anchorInfo, size) {
        this.processLeftDistance(anchorInfo);
        this.processRightDistance(anchorInfo);
        this.processLocked(anchorInfo);
        this.processHorizontalPositionType(anchorInfo);
        this.processVerticalPositionType(anchorInfo);
        this.processZOrder(anchorInfo);
        this.processDrawingObjectHorizontalPositionAlignment(anchorInfo);
        this.processDrawingObjectHorizontalPositionType(anchorInfo);
        this.processDrawingObjectVerticalPositionAlignment(anchorInfo);
        this.processDrawingObjectVerticalPositionType(anchorInfo);
        this.processPercentHorizontalOffset(anchorInfo);
        this.processPercentVerticalOffset(anchorInfo);
        this.processLayoutInTableCell(anchorInfo);
        this.processAllowOverlap(anchorInfo);
        this.processDisplayBehindDocumentText(anchorInfo);
        this.processTopDistance(anchorInfo);
        this.processBottomDistance(anchorInfo);
        if (size) {
            this.processRelativeHorizontalSize(size);
            this.processRelativeVerticalSize(size);
        }
    }
    processLocked(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.ShapeLocked, value => anchorInfo.locked = value);
    }
    processHorizontalPositionType(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.DXInternalLegacyHorizontalPositionAlignment, value => anchorInfo.horizontalPositionType = value);
    }
    processVerticalPositionType(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.DXInternalLegacyVerticalPositionAlignment, value => anchorInfo.verticalPositionType = value);
    }
    processZOrder(anchorInfo) {
        if (!this.shapeProperties.trySetProperty(RtfDrawingKeywords.Dhgt, value => anchorInfo.zOrder = value))
            this.shapeProperties.trySetProperty(RtfDrawingKeywords.ShapeZOrder, value => anchorInfo.zOrder = value);
    }
    processDrawingObjectHorizontalPositionAlignment(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.HorizontalPositionAlignment, value => this.importDrawingObjectHorizontalPositionAlignment(anchorInfo, value));
    }
    processDrawingObjectHorizontalPositionType(anchorInfo) {
        const ignoreHPos = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.ShapeIgnoreLegacyHorizontalPositionType);
        if (ignoreHPos)
            anchorInfo.horizontalPositionType = AnchorObjectHorizontalPositionType.Column;
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.HorizontalPositionType, value => this.importDrawingObjectHorizontalPositionType(anchorInfo, value));
    }
    processPercentHorizontalOffset(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.PctHorizPos, value => anchorInfo.percentOffset.x = value * 100);
    }
    processPercentVerticalOffset(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.PctVertPos, value => anchorInfo.percentOffset.y = value * 100);
    }
    processDrawingObjectVerticalPositionAlignment(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.VerticalPositionAlignment, value => this.importDrawingObjectVerticalPositionAlignment(anchorInfo, value));
    }
    processDrawingObjectVerticalPositionType(anchorInfo) {
        const ignoreVPos = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.ShapeIgnoreLegacyVerticalPositionType);
        if (ignoreVPos)
            anchorInfo.verticalPositionType = AnchorObjectVerticalPositionType.Paragraph;
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.VerticalPositionType, value => this.importDrawingObjectVerticalPositionType(anchorInfo, value));
    }
    processLayoutInTableCell(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.LayoutInCell, value => anchorInfo.layoutTableCell = value);
    }
    processAllowOverlap(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.AllowOverlap, value => anchorInfo.allowOverlap = value);
    }
    processDisplayBehindDocumentText(anchorInfo) {
        if (!this.shapeProperties.trySetProperty(RtfDrawingKeywords.ShapeWrapTextTypeZOrder, value => anchorInfo.isBehindDoc = !!value))
            this.shapeProperties.trySetProperty(RtfDrawingKeywords.BehindDocument, value => anchorInfo.isBehindDoc = !!value);
    }
    processLeftDistance(anchorInfo) {
        const isPseudoInline = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.PseudoInline);
        if (isPseudoInline)
            return;
        anchorInfo.leftDistance = UnitConverter.emuToTwips(this.shapeProperties.getProperty(RtfDrawingKeywords.WrapDistLeft, ShapePropertiesDestinationBase.distanceFromText));
    }
    processRightDistance(anchorInfo) {
        const isPseudoInline = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.PseudoInline);
        if (isPseudoInline)
            return;
        anchorInfo.rightDistance = UnitConverter.emuToTwips(this.shapeProperties.getProperty(RtfDrawingKeywords.WrapDistRight, ShapePropertiesDestinationBase.distanceFromText));
    }
    processTopDistance(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.WrapDistTop, value => anchorInfo.topDistance = UnitConverter.emuToTwips(value));
    }
    processBottomDistance(anchorInfo) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.WrapDistBottom, value => anchorInfo.bottomDistance = UnitConverter.emuToTwips(value));
    }
    processRelativeHorizontalSize(size) {
        const rawPercentageWidth = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.RelativeHorizontalSizeWidth);
        if (rawPercentageWidth == null)
            return;
        size.relativeSize.width = rawPercentageWidth * 100;
        size.relativeWidthType = this.getDrawingObjectRelativeFromHorizontal();
        size.setUseAbsoluteWidth(false);
    }
    processRelativeVerticalSize(size) {
        var rawPercentageHeight = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.RelativeVerticalSizeHeight);
        if (rawPercentageHeight == null)
            return;
        size.relativeSize.height = rawPercentageHeight * 100;
        size.relativeHeightType = this.getDrawingObjectRelativeFromVertical();
        size.setUseAbsoluteHeight(false);
    }
    getDrawingObjectRelativeFromHorizontal() {
        var rawValue = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.RelativeHorizontalSizeFrom);
        if (rawValue == null)
            return RelativeWidthType.Page;
        return rawValue;
    }
    getDrawingObjectRelativeFromVertical() {
        var rawValue = this.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.RelativeVerticalSizeFrom);
        if (rawValue == null)
            return RelativeHeightType.Page;
        return rawValue;
    }
    importDrawingObjectHorizontalPositionAlignment(anchorInfo, propertyValue) {
        anchorInfo.horizontalPositionAlignment = propertyValue;
    }
    importDrawingObjectHorizontalPositionType(anchorInfo, propertyValue) {
        const table = RtfDrawingKeywords.DrawingObjectHorizontalPositionTypeTable;
        const index = NumberMapUtils.keyBy(table, (value) => value == propertyValue);
        if (isDefined(index))
            anchorInfo.horizontalPositionType = (index);
    }
    importDrawingObjectVerticalPositionAlignment(anchorInfo, propertyValue) {
        anchorInfo.verticalPositionAlignment = propertyValue;
    }
    importDrawingObjectVerticalPositionType(anchorInfo, propertyValue) {
        const table = RtfDrawingKeywords.DrawingObjectVerticalPositionTypeTable;
        const index = NumberMapUtils.keyBy(table, (value) => value == propertyValue);
        if (isDefined(index))
            anchorInfo.verticalPositionType = (index);
    }
}
