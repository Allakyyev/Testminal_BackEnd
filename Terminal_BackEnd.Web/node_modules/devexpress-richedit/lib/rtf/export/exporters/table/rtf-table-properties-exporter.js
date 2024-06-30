import { TablePropertiesMask } from '../../../../core/model/tables/properties/table-properties';
import { TableLayoutType, TableLookTypes } from '../../../../core/model/tables/secondary-structures/table-base-structures';
import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfPropertiesExporter } from '../rtf-properties-exporter';
export class RtfTablePropertiesExporter extends RtfPropertiesExporter {
    writeRTLRow() {
        this.rtfBuilder.writeCommand(RtfExportSR.RTLRow);
    }
    writeRowLeft(left) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowLeft, left);
    }
    writeTableBorders(borders) {
        const defaultBorder = this.documentModel.defaultTableCellProperties.borders.bottomBorder;
        const topBorder = borders.topBorder;
        const leftBorder = borders.leftBorder;
        const bottomBorder = borders.bottomBorder;
        const rightBorder = borders.rightBorder;
        const innerHorizontalBorder = borders.insideHorizontalBorder;
        const innerVerticalBorder = borders.insideVerticalBorder;
        if (!defaultBorder.equals(topBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableTopBorder);
            this.writeBorderProperties(topBorder);
        }
        if (!defaultBorder.equals(leftBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableLeftBorder);
            this.writeBorderProperties(leftBorder);
        }
        if (!defaultBorder.equals(bottomBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableBottomBorder);
            this.writeBorderProperties(bottomBorder);
        }
        if (!defaultBorder.equals(rightBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableRightBorder);
            this.writeBorderProperties(rightBorder);
        }
        if (!defaultBorder.equals(innerHorizontalBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableHorizontalBorder);
            this.writeBorderProperties(innerHorizontalBorder);
        }
        if (!defaultBorder.equals(innerVerticalBorder)) {
            this.rtfBuilder.writeCommand(RtfExportSR.TableVerticalBorder);
            this.writeBorderProperties(innerVerticalBorder);
        }
    }
    writeTableWidth(preferredWidth) {
        this.writeWidthUnit(preferredWidth, RtfExportSR.TablePreferredWidthType, RtfExportSR.TablePreferredWidth);
    }
    writeTableLayout(value) {
        if (value != TableLayoutType.Fixed) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableLayout, value);
        }
    }
    writeTableCellMargins(cellMargins) {
        const leftMargin = cellMargins.left;
        const rightMargin = cellMargins.right;
        const bottomMargin = cellMargins.bottom;
        const topMargin = cellMargins.top;
        if (this.shouldExportCellMargin(leftMargin))
            this.writeWidthUnitInTwips(leftMargin, RtfExportSR.TableCellMarginsLeftType, RtfExportSR.TableCellMarginsLeft);
        if (this.shouldExportCellMargin(bottomMargin))
            this.writeWidthUnitInTwips(bottomMargin, RtfExportSR.TableCellMarginsBottomType, RtfExportSR.TableCellMarginsBottom);
        if (this.shouldExportCellMargin(rightMargin))
            this.writeWidthUnitInTwips(rightMargin, RtfExportSR.TableCellMarginsRightType, RtfExportSR.TableCellMarginsRight);
        if (this.shouldExportCellMargin(topMargin))
            this.writeWidthUnitInTwips(topMargin, RtfExportSR.TableCellMarginsTopType, RtfExportSR.TableCellMarginsTop);
    }
    writeTableLook(value) {
        this.documentModel.defaultTableProperties;
        if ((value & TableLookTypes.ApplyFirstColumn) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableApplyFirstColumn);
        if ((value & TableLookTypes.ApplyFirstRow) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableApplyFirstRow);
        if ((value & TableLookTypes.ApplyLastColumn) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableApplyLastColumn);
        if ((value & TableLookTypes.ApplyLastRow) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableApplyLastRow);
        if ((value & TableLookTypes.DoNotApplyColumnBanding) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableDoNotApplyColumnBanding);
        if ((value & TableLookTypes.DoNotApplyRowBanding) != 0)
            this.rtfBuilder.writeCommand(RtfExportSR.TableDoNotApplyRowBanding);
    }
    writeTableIndent(tableIndent) {
        this.writeWidthUnit(tableIndent, RtfExportSR.TableIndentType, RtfExportSR.TableIndent, true);
    }
    writeBandSizes(info) {
        const exportRowBand = info.getUseValue(TablePropertiesMask.UseTableStyleRowBandSize);
        const exportColBand = info.getUseValue(TablePropertiesMask.UseTableStyleColBandSize);
        if (info.tableStyleRowBandSize != 0 && (exportRowBand || info.tableStyleRowBandSize > 1))
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableStyleRowBandSize, info.tableStyleRowBandSize);
        if (info.tableStyleColumnBandSize != 0 && (exportColBand || info.tableStyleColumnBandSize > 1))
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableStyleColumnBandSize, info.tableStyleColumnBandSize);
    }
}
