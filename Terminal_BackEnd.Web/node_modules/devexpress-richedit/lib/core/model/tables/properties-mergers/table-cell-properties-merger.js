import { TableCellPropertiesMask } from '../properties/table-cell-properties';
import { ConditionalTableStyleFormatting } from '../secondary-structures/table-base-structures';
import { TablePropertiesMergerBorderBottom, TablePropertiesMergerBorderHorizontal, TablePropertiesMergerBorderLeft, TablePropertiesMergerBorderRight, TablePropertiesMergerBorderTop, TablePropertiesMergerBorderVertical, TablePropertiesMergerMarginBottom, TablePropertiesMergerMarginLeft, TablePropertiesMergerMarginRight, TablePropertiesMergerMarginTop } from './table-properties-merger';
import { TableMergerNotMergedPropertyResult, TablePropertiesMergerBase } from './table-properties-merger-base';
export class TableCellPropertiesMerger extends TablePropertiesMergerBase {
    getContainerFromConditionalStyle(condStyle) {
        return condStyle.tableCellProperties;
    }
    canUseValue(props) {
        return !!(props.mask & this.getPropertyMask());
    }
    getCondTableStyleFormattingListForThisContainer() {
        return TableCellPropertiesMerger.conditionalTableStyleFormattingPriority;
    }
    getNotMergedProperty() {
        return new TableMergerNotMergedPropertyResult(false, null);
    }
}
TableCellPropertiesMerger.conditionalTableStyleFormattingPriority = [
    ConditionalTableStyleFormatting.TopLeftCell,
    ConditionalTableStyleFormatting.TopRightCell,
    ConditionalTableStyleFormatting.BottomLeftCell,
    ConditionalTableStyleFormatting.BottomRightCell,
    ConditionalTableStyleFormatting.FirstRow,
    ConditionalTableStyleFormatting.LastRow,
    ConditionalTableStyleFormatting.FirstColumn,
    ConditionalTableStyleFormatting.LastColumn,
    ConditionalTableStyleFormatting.EvenColumnBanding,
    ConditionalTableStyleFormatting.OddColumnBanding,
    ConditionalTableStyleFormatting.EvenRowBanding,
    ConditionalTableStyleFormatting.OddRowBanding,
    ConditionalTableStyleFormatting.WholeTable,
];
export class TableCellPropertiesMergerMarginBase extends TableCellPropertiesMerger {
    constructor(table, model, tablePropertiesException) {
        super();
        this.table = table;
        this.model = model;
        this.tablePropertiesException = tablePropertiesException;
    }
    actionBeforeDefaultValue() {
        this.result = this.getMarginMerger().getProperty(this.table.properties, this.table.style, ConditionalTableStyleFormatting.WholeTable, this.model.defaultTableProperties);
        return true;
    }
    getNotMergedProperty() {
        return this.getMarginMerger().getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableCellPropertiesMergerMarginLeft extends TableCellPropertiesMergerMarginBase {
    getPropertyMask() {
        return TableCellPropertiesMask.UseLeftMargin;
    }
    getPropertyFromContainer(container) {
        return container.cellMargins.left;
    }
    getMarginMerger() {
        return new TablePropertiesMergerMarginLeft();
    }
}
export class TableCellPropertiesMergerMarginRight extends TableCellPropertiesMergerMarginBase {
    getPropertyMask() {
        return TableCellPropertiesMask.UseRightMargin;
    }
    getPropertyFromContainer(container) {
        return container.cellMargins.right;
    }
    getMarginMerger() {
        return new TablePropertiesMergerMarginRight();
    }
}
export class TableCellPropertiesMergerMarginTop extends TableCellPropertiesMergerMarginBase {
    getPropertyMask() {
        return TableCellPropertiesMask.UseTopMargin;
    }
    getPropertyFromContainer(container) {
        return container.cellMargins.top;
    }
    getMarginMerger() {
        return new TablePropertiesMergerMarginTop();
    }
}
export class TableCellPropertiesMergerMarginBottom extends TableCellPropertiesMergerMarginBase {
    getPropertyMask() {
        return TableCellPropertiesMask.UseBottomMargin;
    }
    getPropertyFromContainer(container) {
        return container.cellMargins.bottom;
    }
    getMarginMerger() {
        return new TablePropertiesMergerMarginBottom();
    }
}
export class TableCellPropertiesMergerBorderBase extends TableCellPropertiesMerger {
    constructor(tablePropertiesException) {
        super();
        this.tablePropertiesException = tablePropertiesException;
    }
    actionBeforeDefaultValue() {
        this.result = null;
        return true;
    }
}
export class TableCellPropertiesMergerBorderLeft extends TableCellPropertiesMergerBorderBase {
    constructor(tablePropertiesException, isOutsideBorder) {
        super(tablePropertiesException);
        this.isOutsideBorder = isOutsideBorder;
    }
    getPropertyFromContainer(container) {
        return container.borders.leftBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseLeftBorder;
    }
    getNotMergedProperty() {
        return new (this.isOutsideBorder ? TablePropertiesMergerBorderLeft : TablePropertiesMergerBorderVertical)()
            .getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableCellPropertiesMergerBorderRight extends TableCellPropertiesMergerBorderBase {
    constructor(tablePropertiesException, isOutsideBorder) {
        super(tablePropertiesException);
        this.isOutsideBorder = isOutsideBorder;
    }
    getPropertyFromContainer(container) {
        return container.borders.rightBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseRightBorder;
    }
    getNotMergedProperty() {
        return new (this.isOutsideBorder ? TablePropertiesMergerBorderRight : TablePropertiesMergerBorderVertical)()
            .getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableCellPropertiesMergerBorderTop extends TableCellPropertiesMergerBorderBase {
    constructor(tablePropertiesException, isOutsideBorder) {
        super(tablePropertiesException);
        this.isOutsideBorder = isOutsideBorder;
    }
    getPropertyFromContainer(container) {
        return container.borders.topBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseTopBorder;
    }
    getNotMergedProperty() {
        return new (this.isOutsideBorder ? TablePropertiesMergerBorderTop : TablePropertiesMergerBorderHorizontal)()
            .getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableCellPropertiesMergerBorderBottom extends TableCellPropertiesMergerBorderBase {
    constructor(tablePropertiesException, isOutsideBorder) {
        super(tablePropertiesException);
        this.isOutsideBorder = isOutsideBorder;
    }
    getPropertyFromContainer(container) {
        return container.borders.bottomBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseBottomBorder;
    }
    getNotMergedProperty() {
        return new (this.isOutsideBorder ? TablePropertiesMergerBorderBottom : TablePropertiesMergerBorderHorizontal)()
            .getTableNotMergedProperty(this.tablePropertiesException);
    }
}
export class TableCellPropertiesMergerBorderTopLeftDiagonal extends TableCellPropertiesMergerBorderBase {
    getPropertyFromContainer(container) {
        return container.borders.topLeftDiagonalBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseTopLeftDiagonalBorder;
    }
}
export class TableCellPropertiesMergerBorderTopRightDiagonal extends TableCellPropertiesMergerBorderBase {
    getPropertyFromContainer(container) {
        return container.borders.topRightDiagonalBorder;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseTopRightDiagonalBorder;
    }
}
export class TableCellPropertiesMergerNoWrap extends TableCellPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.noWrap;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseNoWrap;
    }
}
export class TableCellPropertiesMergerShadingInfo extends TableCellPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.shadingInfo;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseShadingInfoIndex;
    }
}
export class TableCellVerticalAlignmentMerger extends TableCellPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.verticalAlignment;
    }
    getPropertyMask() {
        return TableCellPropertiesMask.UseVerticalAlignment;
    }
}
