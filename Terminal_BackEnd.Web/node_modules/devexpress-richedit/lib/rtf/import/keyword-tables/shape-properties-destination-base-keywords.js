import { MapCreator } from '../../../base-utils/map-creator';
import { RtfDrawingKeywords } from '../../translation-table/rtf-drawing-keywords';
import { DestinationBase } from '../destination/base/destination';
import { ShapePropertiesDestinationBase } from '../destination/shape/shape-properties-destination-base';
export const shapePropertiesDestinationBaseKeywords = new MapCreator()
    .add(RtfDrawingKeywords.ShapeLeft, ShapePropertiesDestinationBase.onShapeLeftKeyword)
    .add(RtfDrawingKeywords.ShapeTop, ShapePropertiesDestinationBase.onShapeTopKeyword)
    .add(RtfDrawingKeywords.ShapeBottom, ShapePropertiesDestinationBase.onShapeBottomKeyword)
    .add(RtfDrawingKeywords.ShapeRight, ShapePropertiesDestinationBase.onShapeRightKeyword)
    .add(RtfDrawingKeywords.ShapeLid, ShapePropertiesDestinationBase.onShapeId)
    .add(RtfDrawingKeywords.ShapeZOrder, ShapePropertiesDestinationBase.onShapeZOrderKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypePage, ShapePropertiesDestinationBase.onShapeHorizontalPositionTypePageKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypeMargin, ShapePropertiesDestinationBase.onShapeHorizontalPositionTypeMarginKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyHorizontalPositionTypeColumn, ShapePropertiesDestinationBase.onShapeHorizontalPositionTypeColumnKeyword)
    .add(RtfDrawingKeywords.ShapeIgnoreLegacyHorizontalPositionType, ShapePropertiesDestinationBase.onShapeHorizontalPositionTypeIgnoreKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyVerticalPositionTypePage, ShapePropertiesDestinationBase.onShapeVerticalPositionTypePageKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyVerticalPositionTypeMargin, ShapePropertiesDestinationBase.onShapeVerticalPositionTypeMarginKeyword)
    .add(RtfDrawingKeywords.ShapeLegacyVerticalPositionTypeParagraph, ShapePropertiesDestinationBase.onShapeVerticalPositionTypeParagraphKeyword)
    .add(RtfDrawingKeywords.ShapeIgnoreLegacyVerticalPositionType, ShapePropertiesDestinationBase.onShapeVerticalPositionTypeIgnoreKeyword)
    .add(RtfDrawingKeywords.ShapeWrapTextType, ShapePropertiesDestinationBase.onShapeWrapTextTypeKeyword)
    .add(RtfDrawingKeywords.ShapeWrapTextSide, ShapePropertiesDestinationBase.onShapeWrapTextSideKeyword)
    .add(RtfDrawingKeywords.ShapeWrapTextTypeZOrder, ShapePropertiesDestinationBase.onShapeWrapTextTypeZOrderKeyword)
    .add(RtfDrawingKeywords.ShapeLocked, ShapePropertiesDestinationBase.onShapeLockedKeyword)
    .add(RtfDrawingKeywords.ShapeText, ShapePropertiesDestinationBase.onShapeTextKeyword)
    .add("sp", ShapePropertiesDestinationBase.onShapePropertyKeyword)
    .add("shprslt", ShapePropertiesDestinationBase.onShapeResultKeyword)
    .add("bin", DestinationBase.onBinKeyword)
    .get();
