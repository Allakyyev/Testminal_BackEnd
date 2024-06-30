import { TableRowPropertiesMergerCantSplit, TableRowPropertiesMergerCellSpacing, TableRowPropertiesMergerDivId, TableRowPropertiesMergerHorizontalAlignment } from '../../../core/model/tables/properties-mergers/table-row-properties-merger';
import { TableProperties } from '../../../core/model/tables/properties/table-properties';
import { ConditionalTableStyleFormatting } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { RtfTablePropertiesMergerBase } from './rtf-table-properties-merger-base';
export class RtfTableRowPropertiesMerger extends RtfTablePropertiesMergerBase {
    constructor(model) {
        super(model);
    }
    get defaultProperties() {
        return this.model.defaultTableRowProperties;
    }
    getMergedProperties(row) {
        return this.merge(row.properties, row.parentTable.style, row, row.tablePropertiesException, ConditionalTableStyleFormatting.WholeTable);
    }
    getStyleMergedProperties(style, tableStyle, conditionalFormatting) {
        return this.merge(style.tableRowProperties, tableStyle, null, new TableProperties(), conditionalFormatting);
    }
    merge(source, tableStyle, row, tablePropertiesException, conditionalFormatting) {
        const result = source.clone();
        if (row) {
            result.cellSpacing = new TableRowPropertiesMergerCellSpacing(this.model, row.parentTable, tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        }
        result.cantSplit = new TableRowPropertiesMergerCantSplit()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.tableRowAlignment = new TableRowPropertiesMergerHorizontalAlignment(tablePropertiesException)
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.divId = new TableRowPropertiesMergerDivId()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        return result;
    }
}
