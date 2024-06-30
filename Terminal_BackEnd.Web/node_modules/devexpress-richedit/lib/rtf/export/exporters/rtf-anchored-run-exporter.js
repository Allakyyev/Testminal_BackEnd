import { ColorHelper } from '../../../core/model/color/color';
import { DXColor } from '../../../core/model/color/dx-color';
import { AnchorObjectHorizontalPositionType, AnchorObjectTextWrapType, AnchorObjectVerticalPositionType } from '../../../core/model/floating-objects/enums';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { boolToString } from '@devexpress/utils/lib/utils/common';
import { RtfDrawingKeywords } from '../../translation-table/rtf-drawing-keywords';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { ShapeUtils } from '../../utils/shape-utils';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class RtfAnchoredRunExporter {
    constructor(rtfBuilder, anchorInfo, shape, size, nonVisualDrawingObjectInfo) {
        this.rtfBuilder = rtfBuilder;
        this.anchorInfo = anchorInfo;
        this.shape = shape;
        this.size = size;
        this.nonVisualDrawingObjectInfo = nonVisualDrawingObjectInfo;
    }
    getShapeHorizontalPositionType(horizontalPositionType) {
        switch (horizontalPositionType) {
            case AnchorObjectHorizontalPositionType.Page:
                return RtfExportSR.ShapeLegacyHorizontalPositionTypePage;
            case AnchorObjectHorizontalPositionType.Margin:
                return RtfExportSR.ShapeLegacyHorizontalPositionTypeMargin;
            case AnchorObjectHorizontalPositionType.Column:
                return RtfExportSR.ShapeLegacyHorizontalPositionTypeColumn;
            default:
                return RtfExportSR.ShapeLegacyHorizontalPositionTypeMargin;
        }
    }
    getShapeVerticalPositionType(verticalPositionType) {
        switch (verticalPositionType) {
            case AnchorObjectVerticalPositionType.Page:
                return RtfExportSR.ShapeLegacyVerticalPositionTypePage;
            case AnchorObjectVerticalPositionType.Margin:
                return RtfExportSR.ShapeLegacyVerticalPositionTypeMargin;
            case AnchorObjectVerticalPositionType.Paragraph:
                return RtfExportSR.ShapeLegacyVerticalPositionTypeParagraph;
            default:
                return RtfExportSR.ShapeLegacyVerticalPositionTypeParagraph;
        }
    }
    exportFloatingObjectHorizontalPositionType(horizontalPositionType) {
        this.rtfBuilder.writeCommand(this.getShapeHorizontalPositionType(horizontalPositionType));
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeIgnoreLegacyHorizontalPositionType);
    }
    exportFloatingObjectVerticalPositionType(verticalPositionType) {
        this.rtfBuilder.writeCommand(this.getShapeVerticalPositionType(verticalPositionType));
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeIgnoreLegacyVerticalPositionType);
    }
    exportShapeInstanceProperties() {
        let offsetX = this.anchorInfo.offset.x;
        let offsetY = this.anchorInfo.offset.y;
        const rtfRoation = UnitConverter.twipsToFD(this.size.rotation);
        let width = this.getWidth();
        let height = this.getHeight();
        if (ShapeUtils.shouldSwapSize(rtfRoation)) {
            const temp = width;
            width = height;
            height = temp;
            offsetX += width;
            offsetY -= width;
        }
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeLeft, offsetX);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeTop, offsetY);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeRight, offsetX + width);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeBottom, offsetY + height);
        this.rtfBuilder.writeShapeIntegerProperty("lineWidth", UnitConverter.twipsToEmu(this.shape.outlineWidth));
        this.exportFloatingObjectTextWrapType(this.anchorInfo.wrapType, this.anchorInfo.isBehindDoc);
        this.exportFloatingObjectHorizontalPositionType(this.anchorInfo.horizontalPositionType);
        this.exportFloatingObjectVerticalPositionType(this.anchorInfo.verticalPositionType);
        if (this.anchorInfo.zOrder != 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeZOrder, this.anchorInfo.zOrder);
        if (this.anchorInfo.wrapSide)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeWrapTextSide, RtfDrawingKeywords.DrawingObjectTextWrapSideTable[this.anchorInfo.wrapSide]);
        if (this.anchorInfo.locked == true)
            this.rtfBuilder.writeCommand(RtfExportSR.ShapeLocked);
    }
    exportFloatingObjectTextWrapType(textWrapType, isBehindDoc) {
        if (textWrapType == AnchorObjectTextWrapType.None) {
            this.rtfBuilder.writeCommand(RtfExportSR.ShapeWrapTextType, "3");
            this.rtfBuilder.writeCommand(RtfExportSR.ShapeWrapTextTypeZOrder, boolToString(isBehindDoc));
        }
        else
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ShapeWrapTextType, RtfDrawingKeywords.DrawingObjectTextWrapTypeTable[textWrapType]);
    }
    exportFloatingObjectShape() {
        if (this.size.rotation)
            this.rtfBuilder.writeShapeIntegerProperty("rotation", UnitConverter.twipsToFD(this.size.rotation));
        this.rtfBuilder.writeShapeBoolProperty("fLine", !DXColor.isTransparentOrEmptyorNoColor(this.shape.outlineColor));
        if (this.shape.outlineColor != ColorHelper.NO_COLOR && this.shape.outlineWidth > 0) {
            this.rtfBuilder.writeShapeIntegerProperty("lineWidth", UnitConverter.twipsToEmu(this.shape.outlineWidth));
            if (this.shape.outlineColor && !DXColor.isTransparentOrEmpty(this.shape.outlineColor))
                this.rtfBuilder.writeShapeColorProperty("lineColor", this.shape.outlineColor);
        }
        const fillColor = this.shape.fillColor;
        if (fillColor && !DXColor.isTransparentOrEmpty(fillColor) && fillColor != ColorHelper.NO_COLOR) {
            this.rtfBuilder.writeShapeBoolProperty("fFilled", true);
            this.rtfBuilder.writeShapeColorProperty("fillColor", fillColor);
        }
        else
            this.rtfBuilder.writeShapeBoolProperty("fFilled", false);
    }
    exportFloatingObjectRelativeSize() {
        const percentOffset = this.anchorInfo.percentOffset;
        if (percentOffset.x != 0)
            this.rtfBuilder.writeShapeIntegerProperty("pctHorizPos", percentOffset.x / 100);
        if (percentOffset.y != 0)
            this.rtfBuilder.writeShapeIntegerProperty("pctVertPos", percentOffset.y / 100);
    }
    export() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.Shape);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeInstance);
        this.exportShapeInstanceProperties();
        this.exportFloatingObjectShape();
        if (this.anchorInfo.horizontalPositionAlignment)
            this.rtfBuilder.writeShapeIntegerProperty("posh", RtfDrawingKeywords.DrawingObjectHorizontalPositionAlignmentTable[this.anchorInfo.horizontalPositionAlignment]);
        this.rtfBuilder.writeShapeIntegerProperty("posrelh", RtfDrawingKeywords.DrawingObjectHorizontalPositionTypeTable[this.anchorInfo.horizontalPositionType]);
        if (this.anchorInfo.verticalPositionAlignment)
            this.rtfBuilder.writeShapeIntegerProperty("posv", RtfDrawingKeywords.DrawingObjectVerticalPositionAlignmentTable[this.anchorInfo.verticalPositionAlignment]);
        this.rtfBuilder.writeShapeIntegerProperty("posrelv", RtfDrawingKeywords.DrawingObjectVerticalPositionTypeTable[this.anchorInfo.verticalPositionType]);
        this.rtfBuilder.writeShapeBoolProperty("fLayoutInCell", this.anchorInfo.layoutTableCell);
        this.rtfBuilder.writeShapeBoolProperty("fAllowOverlap", this.anchorInfo.allowOverlap);
        this.rtfBuilder.writeShapeBoolProperty("fLockAspectRatio", this.size.lockAspectRatio);
        this.rtfBuilder.writeShapeBoolProperty("fHidden", this.anchorInfo.hidden);
        this.rtfBuilder.writeShapeBoolProperty("fBehindDocument", this.anchorInfo.isBehindDoc);
        const leftDistance = UnitConverter.twipsToEmu(this.anchorInfo.leftDistance);
        if (leftDistance != ShapeUtils.distanceFromText)
            this.rtfBuilder.writeShapeIntegerProperty("dxWrapDistLeft", leftDistance);
        const rightDistance = UnitConverter.twipsToEmu(this.anchorInfo.rightDistance);
        if (rightDistance != ShapeUtils.distanceFromText)
            this.rtfBuilder.writeShapeIntegerProperty("dxWrapDistRight", rightDistance);
        this.rtfBuilder.writeShapeIntegerProperty("dyWrapDistTop", UnitConverter.twipsToEmu(this.anchorInfo.topDistance));
        this.rtfBuilder.writeShapeIntegerProperty("dyWrapDistBottom", UnitConverter.twipsToEmu(this.anchorInfo.bottomDistance));
        this.exportFloatingObjectRelativeSize();
        if (!StringUtils.isNullOrEmpty(this.nonVisualDrawingObjectInfo.name))
            this.rtfBuilder.writeShapeProperty(RtfDrawingKeywords.Name, this.nonVisualDrawingObjectInfo.name);
        this.rtfBuilder.writeDescription(this.nonVisualDrawingObjectInfo);
        this.exportContent();
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.closeGroup();
    }
}
