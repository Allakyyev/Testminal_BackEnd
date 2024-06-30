import { BorderLineStyle } from '../../../../../core/model/borders/enums';
import { ShadingInfo } from '../../../../../core/model/shadings/shading-info';
import { TablePropertiesMask } from '../../../../../core/model/tables/properties/table-properties';
import { TableLayoutType, TableLookTypes } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnitType } from '../../../../../core/model/tables/secondary-structures/table-units';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { WriterHelper } from '../../../utils/writer-helper';
import { BaseExporter } from '../../base';
import { TableCellPropertiesExporter } from './table-cell-properties';
import { TableRowPropertiesExporter } from './table-row-properties';
export class TablePropertiesExporter extends BaseExporter {
    static exportTableBorderCore(data, border, exportAutoColor) {
        data.writer.writeWpStringAttr('val', WriterHelper.getValueFromTables(TranslationTables.borderLineStyleTable, border.style, BorderLineStyle.None));
        data.writer.writeWpIntAttr('sz', UnitConverter.twipsToPoints(border.width * 8.0));
        data.writer.writeWpIntAttr('space', UnitConverter.twipsToPoints(border.offset));
        data.writer.writeWpBoolAttr('shadow', border.shadow);
        data.writer.writeWpBoolAttr('frame', border.frame);
        data.colorExporter.exportColorInfo(border.color, 'color', exportAutoColor);
    }
    exportTablePropertiesCore(table, exportTableLayout) {
        const props = table.properties;
        this.exportCoreProps(props, exportTableLayout);
        if (!props.isTableOverlap)
            this.writer.writeWpStringValue('tblOverlap', props.isTableOverlap ? 'overlap' : 'never');
        if (props.getUseValue(TablePropertiesMask.UseTableStyleRowBandSize))
            this.writer.writeWpIntValue('tblStyleRowBandSize', Math.max(props.tableStyleRowBandSize, 1));
        if (props.getUseValue(TablePropertiesMask.UseTableStyleColBandSize))
            this.writer.writeWpIntValue('tblStyleColBandSize', Math.max(props.tableStyleColumnBandSize, 1));
        this.data.tableWidthExporter.exportWidthUnitValue('tblW', table.preferredWidth);
        this.exportTableBorders(props);
        this.exportCellMargins(props);
        if (table.lookTypes != TableLookTypes.None)
            this.writer.writeWpStringValue('tblLook', StringUtils.padLeft(table.lookTypes.toString(16).toUpperCase(), 4, '0'));
    }
    exportTablePropertiesForStyle(props) {
        this.writer.writeWpStartElement('tblPr');
        this.exportCoreProps(props, false);
        this.exportCellMargins(props);
        this.writer.endElement();
    }
    exportTablePropertiesException(props) {
        if (this.shouldExportTblPropsException(props)) {
            this.writer.writeWpStartElement('tblPrEx');
            this.exportCoreProps(props, true);
            if (TableCellPropertiesExporter.shouldExportCellMargins(this.data, props.cellMargins))
                TableCellPropertiesExporter.exportCellMargins(this.data, 'tblCellMar', props.cellMargins);
            this.writer.endElement();
        }
    }
    exportCoreProps(props, exportTableLayout) {
        if (props.getUseValue(TablePropertiesMask.UseTableAlignment))
            this.writer.writeWpStringValue('jc', TableRowPropertiesExporter.convertTableRowAlignment(props.tableRowAlignment));
        if (props.getUseValue(TablePropertiesMask.UseCellSpacing))
            this.data.tableWidthExporter.exportWidthUnitValue('tblCellSpacing', props.cellSpacing);
        if (props.getUseValue(TablePropertiesMask.UseTableIndent))
            this.data.tableWidthExporter.exportWidthUnitValue('tblInd', props.indent);
        this.exportTableBorders(props);
        if (!props.shadingInfo.equals(ShadingInfo.noColor))
            this.data.colorExporter.exportShadingCore(props.shadingInfo, false);
        if (props.getUseValue(TablePropertiesMask.UseTableLayout) && exportTableLayout) {
            this.writer.writeWpStartElement('tblLayout');
            this.writer.writeWpStringAttr('type', WriterHelper.getValueFromTables(TranslationTables.tableLayoutTypeTable, props.layoutType, TableLayoutType.Autofit));
            this.writer.endElement();
        }
    }
    shouldExportTblPropsException(props) {
        return props.getUseValue(TablePropertiesMask.UseTableAlignment) ||
            props.getUseValue(TablePropertiesMask.UseCellSpacing) ||
            props.getUseValue(TablePropertiesMask.UseTableIndent) ||
            props.getUseValue(TablePropertiesMask.UseShadingInfoIndex) ||
            props.getUseValue(TablePropertiesMask.UseTableLayout) ||
            this.shouldExportTableBorders(props) ||
            TableCellPropertiesExporter.shouldExportCellMargins(this.data, props.cellMargins);
    }
    exportCellMargins(props) {
        if (!props.getUseValue(TablePropertiesMask.UseLeftMargin) &&
            !props.getUseValue(TablePropertiesMask.UseRightMargin) &&
            !props.getUseValue(TablePropertiesMask.UseTopMargin) &&
            !props.getUseValue(TablePropertiesMask.UseBottomMargin))
            return;
        this.writer.writeWpStartElement('tblCellMar');
        if (props.getUseValue(TablePropertiesMask.UseTopMargin))
            this.exportCellMargin('top', props.cellMargins.top);
        if (props.getUseValue(TablePropertiesMask.UseLeftMargin))
            this.exportCellMargin('left', props.cellMargins.left);
        if (props.getUseValue(TablePropertiesMask.UseBottomMargin))
            this.exportCellMargin('bottom', props.cellMargins.bottom);
        if (props.getUseValue(TablePropertiesMask.UseRightMargin))
            this.exportCellMargin('right', props.cellMargins.right);
        this.writer.endElement();
    }
    exportCellMargin(tag, margin) {
        this.data.tableWidthExporter.writeTableUnit(tag, margin.value, margin.type == TableWidthUnitType.Nil && margin.value == 0 ? TableWidthUnitType.ModelUnits : margin.type);
    }
    exportTableBorders(props) {
        if (this.shouldExportTableBorders(props)) {
            const borders = props.borders;
            this.writer.writeWpStartElement('tblBorders');
            if (props.getUseValue(TablePropertiesMask.UseTopBorder))
                this.exportTableBorder('top', borders.topBorder);
            if (props.getUseValue(TablePropertiesMask.UseLeftBorder))
                this.exportTableBorder('left', borders.leftBorder);
            if (props.getUseValue(TablePropertiesMask.UseBottomBorder))
                this.exportTableBorder('bottom', borders.bottomBorder);
            if (props.getUseValue(TablePropertiesMask.UseRightBorder))
                this.exportTableBorder('right', borders.rightBorder);
            if (props.getUseValue(TablePropertiesMask.UseInsideHorizontalBorder))
                this.exportTableBorder('insideH', borders.insideHorizontalBorder);
            if (props.getUseValue(TablePropertiesMask.UseInsideVerticalBorder))
                this.exportTableBorder('insideV', borders.insideVerticalBorder);
            this.writer.endElement();
        }
    }
    shouldExportTableBorders(props) {
        const shouldUse = (mask, border) => props.getUseValue(mask) && border.style != BorderLineStyle.Nil;
        return shouldUse(TablePropertiesMask.UseTopBorder, props.borders.topBorder) ||
            shouldUse(TablePropertiesMask.UseRightBorder, props.borders.rightBorder) ||
            shouldUse(TablePropertiesMask.UseBottomBorder, props.borders.bottomBorder) ||
            shouldUse(TablePropertiesMask.UseLeftBorder, props.borders.leftBorder) ||
            shouldUse(TablePropertiesMask.UseInsideHorizontalBorder, props.borders.insideHorizontalBorder) ||
            shouldUse(TablePropertiesMask.UseInsideVerticalBorder, props.borders.insideVerticalBorder);
    }
    exportTableBorder(tag, border) {
        if (border.style == BorderLineStyle.Nil)
            return;
        this.writer.writeWpStartElement(tag);
        TablePropertiesExporter.exportTableBorderCore(this.data, border, true);
        this.writer.endElement();
    }
}
