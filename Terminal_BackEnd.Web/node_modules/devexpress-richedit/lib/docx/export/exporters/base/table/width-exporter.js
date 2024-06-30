import { TableWidthUnitType } from '../../../../../core/model/tables/secondary-structures/table-units';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { WriterHelper } from '../../../utils/writer-helper';
import { BaseExporter } from '../../base';
export class TableWidthExporter extends BaseExporter {
    exportWidthUnitValue(tag, widthUnit) {
        if (!this.forbidExportWidthUnit(widthUnit))
            this.writeTableUnit(tag, widthUnit.value, widthUnit.type);
    }
    forbidExportWidthUnit(widthUnit) {
        return widthUnit.type == TableWidthUnitType.Nil && widthUnit.value == 0;
    }
    writeTableUnit(tag, value, type) {
        this.writer.writeWpStartElement(tag);
        this.writer.writeWpIntAttr('w', value);
        this.writer.writeWpStringAttr('type', WriterHelper.getValueFromTables(TranslationTables.widthUnitTypesTable, type, TableWidthUnitType.ModelUnits));
        this.writer.endElement();
    }
}
