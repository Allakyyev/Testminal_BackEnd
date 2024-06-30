import { TableRowPropertiesMask } from '../properties/table-row-properties';
import { ConditionalTableStyleFormatting } from '../secondary-structures/table-base-structures';
import { TablePropertiesMergerCellSpacing, TablePropertiesMergerHorizontalAlignment } from './table-properties-merger';
import { TableMergerNotMergedPropertyResult, TablePropertiesMergerBase } from './table-properties-merger-base';
export class TableRowPropertiesMerger extends TablePropertiesMergerBase {
    getContainerFromConditionalStyle(condStyle) {
        return condStyle.tableRowProperties;
    }
    canUseValue(props) {
        return !!(props.mask & this.getPropertyMask());
    }
    getCondTableStyleFormattingListForThisContainer() {
        return TableRowPropertiesMerger.conditionalTableStyleFormattingPriority;
    }
    getNotMergedProperty() {
        return new TableMergerNotMergedPropertyResult(false, null);
    }
}
TableRowPropertiesMerger.conditionalTableStyleFormattingPriority = [
    ConditionalTableStyleFormatting.FirstRow,
    ConditionalTableStyleFormatting.LastRow,
    ConditionalTableStyleFormatting.OddRowBanding,
    ConditionalTableStyleFormatting.EvenRowBanding,
    ConditionalTableStyleFormatting.WholeTable,
];
export class TableRowPropertiesMergerCellSpacing extends TableRowPropertiesMerger {
    constructor(model, table, tablePropertiesException) {
        super();
        this.tablePropertiesException = tablePropertiesException;
        this.model = model;
        this.table = table;
    }
    getPropertyFromContainer(container) {
        return container.cellSpacing;
    }
    getPropertyMask() {
        return TableRowPropertiesMask.UseCellSpacing;
    }
    getNotMergedProperty() {
        return new TablePropertiesMergerCellSpacing().getTableNotMergedProperty(this.tablePropertiesException);
    }
    actionBeforeDefaultValue() {
        this.result = new TablePropertiesMergerCellSpacing().getProperty(this.table.properties, this.table.style, ConditionalTableStyleFormatting.WholeTable, this.model.defaultTableProperties);
        return true;
    }
}
export class TableRowPropertiesMergerCantSplit extends TableRowPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cantSplit;
    }
    getPropertyMask() {
        return TableRowPropertiesMask.UseCantSplit;
    }
}
export class TableRowPropertiesMergerHorizontalAlignment extends TableRowPropertiesMerger {
    constructor(tablePropertiesException) {
        super();
        this.tablePropertiesException = tablePropertiesException;
    }
    getPropertyFromContainer(container) {
        return container.tableRowAlignment;
    }
    getPropertyMask() {
        return TableRowPropertiesMask.UseTableRowAlignment;
    }
    actionBeforeDefaultValue() {
        this.result = null;
        return true;
    }
    getNotMergedProperty() {
        return new TablePropertiesMergerHorizontalAlignment().getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableRowPropertiesMergerDivId extends TableRowPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.divId;
    }
    getPropertyMask() {
        return TableRowPropertiesMask.UseDivId;
    }
    actionBeforeDefaultValue() {
        this.result = null;
        return true;
    }
}
