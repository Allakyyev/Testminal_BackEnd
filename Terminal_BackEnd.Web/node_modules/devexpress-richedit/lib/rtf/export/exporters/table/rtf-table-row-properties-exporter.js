import { TableRowAlignment } from '../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableHeightUnit, TableHeightUnitType } from '../../../../core/model/tables/secondary-structures/table-units';
import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfShadingInfoExportHelper } from '../../helpers/rtf-shading-info-export-helper';
import { RtfPropertiesExporter } from '../rtf-properties-exporter';
export class RtfTableRowPropertiesExporter extends RtfPropertiesExporter {
    writeLastRowMark() {
        this.rtfBuilder.writeCommand(RtfExportSR.TableLastRow);
    }
    writeHalfSpaceBetweenCells(val) {
        if (val > 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableHalfSpaceBetweenCells, val);
    }
    writeRowAlignment(value) {
        const defaultGeneralSettings = this.documentModel.defaultTableRowProperties;
        if (value == defaultGeneralSettings.tableRowAlignment)
            return;
        switch (value) {
            case TableRowAlignment.Center:
                this.rtfBuilder.writeCommand(RtfExportSR.TableRowCenterAlignment);
                break;
            case TableRowAlignment.Left:
                this.rtfBuilder.writeCommand(RtfExportSR.TableRowLeftAlignment);
                break;
            case TableRowAlignment.Right:
                this.rtfBuilder.writeCommand(RtfExportSR.TableRowRightAlignment);
                break;
            default:
                break;
        }
    }
    writeRowHeader(header) {
        const defaultGeneralSettings = this.documentModel.defaultTableRowProperties;
        if (header != defaultGeneralSettings.header)
            this.writeBoolCommand(RtfExportSR.TableRowHeader, header);
    }
    writeRowCantSplit(cantSplit) {
        const defaultGeneralSettings = this.documentModel.defaultTableRowProperties;
        if (cantSplit != defaultGeneralSettings.cantSplit)
            this.writeBoolCommand(RtfExportSR.TableRowCantSplit, cantSplit);
    }
    writeRowHeight(height) {
        const defaultHeight = TableHeightUnit.createDefault();
        if (height.type == defaultHeight.type)
            return;
        switch (height.type) {
            case TableHeightUnitType.Auto:
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowHeight, 0);
                break;
            case TableHeightUnitType.Minimum:
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowHeight, height.value);
                break;
            case TableHeightUnitType.Exact:
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowHeight, -height.value);
                break;
        }
    }
    writeWidthBefore(widthBefore) {
        this.writeWidthUnit(widthBefore, RtfExportSR.TableRowWidthBeforeType, RtfExportSR.TableRowWidthBefore);
    }
    writeWidthAfter(widthAfter) {
        this.writeWidthUnit(widthAfter, RtfExportSR.TableRowWidthAfterType, RtfExportSR.TableRowWidthAfter);
    }
    writeRowCellSpacing(cellSpacing) {
        this.writeWidthUnitInTwips(cellSpacing, RtfExportSR.TableCellSpacingLeftType, RtfExportSR.TableCellSpacingLeft);
        this.writeWidthUnitInTwips(cellSpacing, RtfExportSR.TableCellSpacingBottomType, RtfExportSR.TableCellSpacingBottom);
        this.writeWidthUnitInTwips(cellSpacing, RtfExportSR.TableCellSpacingRightType, RtfExportSR.TableCellSpacingRight);
        this.writeWidthUnitInTwips(cellSpacing, RtfExportSR.TableCellSpacingTopType, RtfExportSR.TableCellSpacingTop);
    }
    writeRowShading(shadingInfo) {
        RtfShadingInfoExportHelper.exportShadingForeColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.TableRowForegroundColor);
        RtfShadingInfoExportHelper.exportShadingBackColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.TableRowBackgroundColor);
        RtfShadingInfoExportHelper.exportShadingPattern(this.rtfBuilder, this.documentModel.colorProvider, shadingInfo, RtfExportSR.TableRowShading);
        const shadingPatternKeyword = RtfExportSR.RunShadingPatternTable[shadingInfo.shadingPattern];
        if (shadingPatternKeyword)
            this.rtfBuilder.writeCommand(shadingPatternKeyword);
    }
}
