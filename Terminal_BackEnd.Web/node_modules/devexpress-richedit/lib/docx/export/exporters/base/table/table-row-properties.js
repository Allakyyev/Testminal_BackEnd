import { TableRowPropertiesMask } from '../../../../../core/model/tables/properties/table-row-properties';
import { TableRowAlignment } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableHeightUnitType } from '../../../../../core/model/tables/secondary-structures/table-units';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { WriterHelper } from '../../../utils/writer-helper';
import { BaseExporter } from '../../base';
export class TableRowPropertiesExporter extends BaseExporter {
    static convertTableRowAlignment(value) {
        return value == TableRowAlignment.Both ?
            TranslationTables.tableRowAlignmentTable[TableRowAlignment.Center].mlValue.openXmlValue :
            WriterHelper.getValueFromTables(TranslationTables.tableRowAlignmentTable, value, TableRowAlignment.Left);
    }
    exportTableRowProperties(row) {
        const props = row.properties;
        this.writer.writeWpStartElement('trPr');
        this.exportTableRowPropertiesCore(props);
        if (row.gridBefore) {
            this.writer.writeWpIntValue('gridBefore', row.gridBefore);
            this.data.tableWidthExporter.exportWidthUnitValue('wBefore', row.widthBefore);
        }
        if (row.gridAfter) {
            this.writer.writeWpIntValue('gridAfter', row.gridAfter);
            this.data.tableWidthExporter.exportWidthUnitValue('wAfter', row.widthAfter);
        }
        if (row.height.value != 0)
            this.exportTableRowHeight(row.height);
        this.writer.endElement();
    }
    exportPropsForStyles(props) {
        this.writer.writeWpStartElement('trPr');
        this.exportTableRowPropertiesCore(props);
        this.writer.endElement();
    }
    exportTableRowPropertiesCore(props) {
        if (props.getUseValue(TableRowPropertiesMask.UseCantSplit))
            this.writer.writeWpEmptyElement('cantSplit');
        if (props.getUseValue(TableRowPropertiesMask.UseHeader))
            this.writer.writeWpEmptyElement('tblHeader');
        if (props.getUseValue(TableRowPropertiesMask.UseCellSpacing))
            this.data.tableWidthExporter.exportWidthUnitValue('tblCellSpacing', props.cellSpacing);
        if (props.tableRowAlignment != TableRowAlignment.Left)
            this.writer.writeWpStringValue('jc', TableRowPropertiesExporter.convertTableRowAlignment(props.tableRowAlignment));
        if (props.getUseValue(TableRowPropertiesMask.UseHideCellMark))
            this.writer.writeWpBoolValue('hidden', props.hideCellMark);
        if (props.getUseValue(TableRowPropertiesMask.UseDivId))
            this.writer.writeWpIntValue('divId', props.divId);
    }
    exportTableRowHeight(height) {
        this.writer.writeWpStartElement('trHeight');
        if (height.type != TableHeightUnitType.Auto)
            this.writer.writeWpStringAttr('hRule', WriterHelper.getValueFromTables(TranslationTables.heightUnitTypeTable, height.type, TableHeightUnitType.Auto));
        this.writer.writeWpIntAttr('val', height.value);
        this.writer.endElement();
    }
}
