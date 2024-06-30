import { BorderLineStyle } from '../../../../../core/model/borders/enums';
import { TableCellPropertiesMask } from '../../../../../core/model/tables/properties/table-cell-properties';
import { TableCellMergingState, TableCellVerticalAlignment, TextDirection } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { WriterHelper } from '../../../utils/writer-helper';
import { BaseExporter } from '../../base';
import { TablePropertiesExporter } from './table-properties';
export class TableCellPropertiesExporter extends BaseExporter {
    static exportCellMargins(data, tag, cellMargins) {
        data.writer.writeWpStartElement(tag);
        data.tableWidthExporter.exportWidthUnitValue('top', cellMargins.top);
        data.tableWidthExporter.exportWidthUnitValue('left', cellMargins.left);
        data.tableWidthExporter.exportWidthUnitValue('bottom', cellMargins.bottom);
        data.tableWidthExporter.exportWidthUnitValue('right', cellMargins.right);
        data.writer.endElement();
    }
    static shouldExportCellMargins(data, cellMargins) {
        return !data.tableWidthExporter.forbidExportWidthUnit(cellMargins.bottom) ||
            !data.tableWidthExporter.forbidExportWidthUnit(cellMargins.left) ||
            !data.tableWidthExporter.forbidExportWidthUnit(cellMargins.top) ||
            !data.tableWidthExporter.forbidExportWidthUnit(cellMargins.right);
    }
    exportTableCellProperties(cell) {
        this.writer.writeWpStartElement('tcPr');
        this.exportTableCellPropertiesCore(cell, true);
        this.writer.endElement();
    }
    exportTableCellPropertiesForStyle(props) {
        this.writer.writeWpStartElement('tcPr');
        this.exportCoreProperties(props, true);
        this.writer.endElement();
    }
    exportTableCellPropertiesCore(cell, exportBorders) {
        const props = cell.properties;
        if (props.getUseValue(TableCellPropertiesMask.UseCellConditionalFormatting))
            this.writer.writeWpStringValue('cnfStyle', StringUtils.padLeft(cell.conditionalFormatting.toString(2), 12, '0'));
        this.data.tableWidthExporter.exportWidthUnitValue('tcW', cell.preferredWidth);
        if (cell.columnSpan > 1)
            this.writer.writeWpIntValue('gridSpan', cell.columnSpan);
        if (cell.verticalMerging != TableCellMergingState.None)
            this.writer.writeWpStringValue('vMerge', WriterHelper.getValueFromTables(TranslationTables.mergingStateTable, cell.verticalMerging, TableCellMergingState.Restart));
        this.exportCoreProperties(props, exportBorders);
    }
    exportCoreProperties(props, exportBorders) {
        if (exportBorders)
            this.exportTableCellBorders(props);
        if (props.getUseValue(TableCellPropertiesMask.UseShadingInfoIndex))
            this.data.colorExporter.exportShadingCore(props.shadingInfo, true);
        if (props.getUseValue(TableCellPropertiesMask.UseNoWrap))
            this.writer.writeWpEmptyOrFalseValue('noWrap', props.noWrap);
        if (TableCellPropertiesExporter.shouldExportCellMargins(this.data, props.cellMargins))
            TableCellPropertiesExporter.exportCellMargins(this.data, 'tcMar', props.cellMargins);
        if (props.getUseValue(TableCellPropertiesMask.UseTextDirection))
            this.writer.writeWpStringValue('textDirection', WriterHelper.getValueFromTables(TranslationTables.textDirectionTable, props.textDirection, TextDirection.LeftToRightTopToBottom));
        if (props.getUseValue(TableCellPropertiesMask.UseFitText))
            this.writer.writeWpEmptyOrFalseValue('tcFitText', props.fitText);
        if (props.getUseValue(TableCellPropertiesMask.UseVerticalAlignment))
            this.writer.writeWpStringValue('vAlign', WriterHelper.getValueFromTables(TranslationTables.verticalAlignmentTable, props.verticalAlignment, TableCellVerticalAlignment.Top));
        if (props.getUseValue(TableCellPropertiesMask.UseHideCellMark))
            this.writer.writeWpEmptyOrFalseValue('hideMark', props.hideCellMark);
    }
    exportTableCellBorders(props) {
        if (this.hasBorders(props)) {
            const borders = props.borders;
            this.writer.writeWpStartElement('tcBorders');
            if (props.getUseValue(TableCellPropertiesMask.UseTopBorder))
                this.exportTableCellBorder('top', borders.topBorder);
            if (props.getUseValue(TableCellPropertiesMask.UseLeftBorder))
                this.exportTableCellBorder('left', borders.leftBorder);
            if (props.getUseValue(TableCellPropertiesMask.UseBottomBorder))
                this.exportTableCellBorder('bottom', borders.bottomBorder);
            if (props.getUseValue(TableCellPropertiesMask.UseRightBorder))
                this.exportTableCellBorder('right', borders.rightBorder);
            if (props.getUseValue(TableCellPropertiesMask.UseTopLeftDiagonalBorder))
                this.exportTableCellBorder('tl2br', borders.topLeftDiagonalBorder);
            if (props.getUseValue(TableCellPropertiesMask.UseTopRightDiagonalBorder))
                this.exportTableCellBorder('tr2bl', borders.topRightDiagonalBorder);
            this.writer.endElement();
        }
    }
    hasBorders(props) {
        const shouldUse = (mask, border) => props.getUseValue(mask) && border.style != BorderLineStyle.Nil;
        return shouldUse(TableCellPropertiesMask.UseTopBorder, props.borders.topBorder) ||
            shouldUse(TableCellPropertiesMask.UseRightBorder, props.borders.rightBorder) ||
            shouldUse(TableCellPropertiesMask.UseBottomBorder, props.borders.bottomBorder) ||
            shouldUse(TableCellPropertiesMask.UseLeftBorder, props.borders.leftBorder) ||
            shouldUse(TableCellPropertiesMask.UseTopRightDiagonalBorder, props.borders.topLeftDiagonalBorder) ||
            shouldUse(TableCellPropertiesMask.UseTopLeftDiagonalBorder, props.borders.topRightDiagonalBorder);
    }
    exportTableCellBorder(tag, border) {
        if (border.style != BorderLineStyle.Nil) {
            this.writer.writeWpStartElement(tag);
            if (border.style == BorderLineStyle.None)
                this.writer.writeWpStringAttr('val', TranslationTables.borderLineStyleTable.exportMap[BorderLineStyle.Nil].mlValue.openXmlValue);
            else
                TablePropertiesExporter.exportTableBorderCore(this.data, border, false);
            this.writer.endElement();
        }
    }
}
