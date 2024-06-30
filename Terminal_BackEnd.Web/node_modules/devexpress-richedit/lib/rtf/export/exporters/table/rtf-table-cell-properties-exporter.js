import { TableCellMergingState, TableCellVerticalAlignment, TextDirection } from '../../../../core/model/tables/secondary-structures/table-base-structures';
import { Errors } from '@devexpress/utils/lib/errors';
import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfShadingInfoExportHelper } from '../../helpers/rtf-shading-info-export-helper';
import { RtfPropertiesExporter } from '../rtf-properties-exporter';
export class RtfTableCellPropertiesExporter extends RtfPropertiesExporter {
    get tableCellBackgroundColor() { return RtfExportSR.TableCellBackgroundColor; }
    get tableCellForegroundColor() { return RtfExportSR.TableCellForegroundColor; }
    get tableCellShading() { return RtfExportSR.TableCellShading; }
    get tableCellShadingPatternTable() { return RtfExportSR.TableCellShadingPatternTable; }
    get tableCellNoWrap() { return RtfExportSR.TableCellNoWrap; }
    get tableCellTextTopAlignment() { return RtfExportSR.TableCellTextTopAlignment; }
    get tableCellTextCenterAlignment() { return RtfExportSR.TableCellTextCenterAlignment; }
    get tableCellTextBottomAlignment() { return RtfExportSR.TableCellTextBottomAlignment; }
    get cellTopBorder() { return RtfExportSR.TableCellTopBorder; }
    get cellLeftBorder() { return RtfExportSR.TableCellLeftBorder; }
    get cellBottomBorder() { return RtfExportSR.TableCellBottomBorder; }
    get cellRightBorder() { return RtfExportSR.TableCellRightBorder; }
    writeCellShading(shadingInfo) {
        const shadingPatternKeyword = RtfExportSR.RunShadingPatternTable[shadingInfo.shadingPattern];
        if (shadingPatternKeyword)
            this.rtfBuilder.writeCommand(shadingPatternKeyword);
        RtfShadingInfoExportHelper.exportShadingForeColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, this.tableCellForegroundColor);
        RtfShadingInfoExportHelper.exportShadingBackColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, this.tableCellBackgroundColor);
        RtfShadingInfoExportHelper.exportShadingPattern(this.rtfBuilder, this.documentModel.colorProvider, shadingInfo, this.tableCellShading);
    }
    writeCellFitText(fitText) {
        const defaultGeneralSettings = this.documentModel.defaultTableCellProperties;
        if (fitText != defaultGeneralSettings.fitText)
            this.writeBoolCommand(RtfExportSR.TableCellFitText, fitText);
    }
    writeCellNoWrap(noWrap) {
        const defaultGeneralSettings = this.documentModel.defaultTableCellProperties;
        if (noWrap != defaultGeneralSettings.noWrap)
            this.writeBoolCommand(this.tableCellNoWrap, noWrap);
    }
    writeCellHideCellMark(hideCellMark) {
        const defaultGeneralSettings = this.documentModel.defaultTableCellProperties;
        if (hideCellMark != defaultGeneralSettings.hideCellMark)
            this.writeBoolCommand(RtfExportSR.TableCellHideMark, hideCellMark);
    }
    writeCellVerticalMerging(value, defaultValue) {
        if (value == defaultValue)
            return;
        if (value == TableCellMergingState.Restart)
            this.rtfBuilder.writeCommand(RtfExportSR.TableCellStartVerticalMerging);
        else if (value == TableCellMergingState.Continue)
            this.rtfBuilder.writeCommand(RtfExportSR.TableCellContinueVerticalMerging);
    }
    writeCellVerticalAlignment(verticalAlignment) {
        switch (verticalAlignment) {
            case TableCellVerticalAlignment.Top:
                this.rtfBuilder.writeCommand(this.tableCellTextTopAlignment);
                break;
            case TableCellVerticalAlignment.Center:
                this.rtfBuilder.writeCommand(this.tableCellTextCenterAlignment);
                break;
            case TableCellVerticalAlignment.Bottom:
                this.rtfBuilder.writeCommand(this.tableCellTextBottomAlignment);
                break;
            default:
                throw new Error(Errors.InternalException);
                break;
        }
    }
    writeCellTextDirection(value) {
        switch (value) {
            case TextDirection.LeftToRightTopToBottom:
                this.rtfBuilder.writeCommand(RtfExportSR.TableCellLeftToRightTopToBottomTextDirection);
                break;
            case TextDirection.TopToBottomRightToLeft:
                this.rtfBuilder.writeCommand(RtfExportSR.TableCellTopToBottomRightToLeftTextDirection);
                break;
            case TextDirection.BottomToTopLeftToRight:
                this.rtfBuilder.writeCommand(RtfExportSR.TableCellBottomToTopLeftToRightTextDirection);
                break;
            case TextDirection.LeftToRightTopToBottomRotated:
                this.rtfBuilder.writeCommand(RtfExportSR.TableCellLeftToRightTopToBottomVerticalTextDirection);
                break;
            case TextDirection.TopToBottomRightToLeftRotated:
                this.rtfBuilder.writeCommand(RtfExportSR.TableCellTopToBottomRightToLeftVerticalTextDirection);
                break;
            default:
                break;
        }
    }
    writeCellBasicBorders(topBorder, leftBorder, rightBorder, bottomBorder) {
        this.rtfBuilder.writeCommand(this.cellTopBorder);
        this.writeBorderProperties(topBorder);
        this.rtfBuilder.writeCommand(this.cellLeftBorder);
        this.writeBorderProperties(leftBorder);
        this.rtfBuilder.writeCommand(this.cellBottomBorder);
        this.writeBorderProperties(bottomBorder);
        this.rtfBuilder.writeCommand(this.cellRightBorder);
        this.writeBorderProperties(rightBorder);
    }
    writeCellPreferredWidth(preferredWidth) {
        this.writeWidthUnit(preferredWidth, RtfExportSR.TableCellPreferredWidthType, RtfExportSR.TableCellPreferredWidth);
    }
    writeCellMargings(cellMargins) {
        const topMargin = cellMargins.top;
        const leftMargin = cellMargins.left;
        const rightMargin = cellMargins.right;
        const bottomMargin = cellMargins.bottom;
        if (this.shouldExportCellMargin(bottomMargin))
            this.writeWidthUnitInTwips(bottomMargin, RtfExportSR.TableCellBottomMarginType, RtfExportSR.TableCellBottomMargin);
        if (this.shouldExportCellMargin(topMargin))
            this.writeWidthUnitInTwips(topMargin, RtfExportSR.TableCellLeftMarginType, RtfExportSR.TableCellLeftMargin);
        if (this.shouldExportCellMargin(rightMargin))
            this.writeWidthUnitInTwips(rightMargin, RtfExportSR.TableCellRightMarginType, RtfExportSR.TableCellRightMargin);
        if (this.shouldExportCellMargin(leftMargin))
            this.writeWidthUnitInTwips(leftMargin, RtfExportSR.TableCellTopMarginType, RtfExportSR.TableCellTopMargin);
    }
    writeCellRight(cellRight) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableCellRight, cellRight);
    }
}
export class RtfTableStyleTableCellPropertiesExporter extends RtfTableCellPropertiesExporter {
    get tableCellBackgroundColor() { return RtfExportSR.TableStyleCellBackgroundColor; }
    get tableCellForegroundColor() { return RtfExportSR.TableStyleCellForegroundColor; }
    get tableCellShading() { return RtfExportSR.TableStyleCellShading; }
    get tableCellShadingPatternTable() { return RtfExportSR.TableStyleShadingPatternTable; }
    get tableCellNoWrap() { return RtfExportSR.TableStyleCellNoWrap; }
    get tableCellTextTopAlignment() { return RtfExportSR.TableStyleCellVerticalAlignmentTop; }
    get tableCellTextCenterAlignment() { return RtfExportSR.TableStyleCellVerticalAlignmentCenter; }
    get tableCellTextBottomAlignment() { return RtfExportSR.TableStyleCellVerticalAlignmentBottom; }
    get tableCellUpperLeftToLowerRightBorder() { return RtfExportSR.TableStyleUpperLeftToLowerRightBorder; }
    get tableCellUpperRightToLowerLeftBorder() { return RtfExportSR.TableStyleUpperRightToLowerLeftBorder; }
    get cellTopBorder() { return RtfExportSR.TableStyleTopCellBorder; }
    get cellLeftBorder() { return RtfExportSR.TableStyleLeftCellBorder; }
    get cellBottomBorder() { return RtfExportSR.TableStyleBottomCellBorder; }
    get cellRightBorder() { return RtfExportSR.TableStyleRightCellBorder; }
    writeCellBasicBorders(topBorder, leftBorder, rightBorder, bottomBorder) {
        const defaultBorder = this.documentModel.defaultTableCellProperties.borders.topBorder;
        if (!defaultBorder.equals(topBorder)) {
            this.rtfBuilder.writeCommand(this.cellTopBorder);
            this.writeBorderProperties(topBorder);
        }
        if (!defaultBorder.equals(leftBorder)) {
            this.rtfBuilder.writeCommand(this.cellLeftBorder);
            this.writeBorderProperties(leftBorder);
        }
        if (!defaultBorder.equals(bottomBorder)) {
            this.rtfBuilder.writeCommand(this.cellBottomBorder);
            this.writeBorderProperties(bottomBorder);
        }
        if (!defaultBorder.equals(rightBorder)) {
            this.rtfBuilder.writeCommand(this.cellRightBorder);
            this.writeBorderProperties(rightBorder);
        }
    }
}
