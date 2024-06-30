import { Flag } from '@devexpress/utils/lib/class/flag';
import { TablePropertiesMask } from '../properties/table-properties';
import { ConditionalTableStyleFormatting, TableRowAlignment } from '../secondary-structures/table-base-structures';
import { TableMergerNotMergedPropertyResult, TablePropertiesMergerBase } from './table-properties-merger-base';
export class TablePropertiesMerger extends TablePropertiesMergerBase {
    getContainerFromConditionalStyle(condStyle) {
        return condStyle.tableProperties;
    }
    canUseValue(props) {
        return !!(props.mask & this.getPropertyMask());
    }
    getCondTableStyleFormattingListForThisContainer() {
        return TablePropertiesMerger.conditionalTableStyleFormattingPriority;
    }
    getTableNotMergedProperty(container) {
        if (!this.canUseValue(container))
            return new TableMergerNotMergedPropertyResult(false, null);
        return new TableMergerNotMergedPropertyResult(true, this.getPropertyFromContainer(container));
    }
    getNotMergedProperty() {
        return this.getTableNotMergedProperty(this.tablePropertiesException);
    }
}
TablePropertiesMerger.conditionalTableStyleFormattingPriority = [
    ConditionalTableStyleFormatting.WholeTable,
];
export class TablePropertiesMergerIndent extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.indent;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTableIndent;
    }
}
export class TablePropertiesMergerCellSpacing extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cellSpacing;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseCellSpacing;
    }
}
export class TablePropertiesMergerBorderBase extends TablePropertiesMerger {
    constructor(isTableOuterBorder) {
        super();
        this.isTableOuterBorder = isTableOuterBorder;
    }
    getPropertiesMaskCore(mask) {
        if (this.isTableOuterBorder)
            return mask;
        const flag = new Flag(mask);
        if (flag.get(TablePropertiesMask.UseLeftBorder) || flag.get(TablePropertiesMask.UseRightBorder))
            flag.set(TablePropertiesMask.UseInsideVerticalBorder, true);
        if (flag.get(TablePropertiesMask.UseTopBorder) || flag.get(TablePropertiesMask.UseBottomBorder))
            flag.set(TablePropertiesMask.UseInsideHorizontalBorder, true);
        flag.set(TablePropertiesMask.UseLeftBorder, false);
        flag.set(TablePropertiesMask.UseRightBorder, false);
        flag.set(TablePropertiesMask.UseTopBorder, false);
        flag.set(TablePropertiesMask.UseBottomBorder, false);
        return flag.getValue();
    }
}
export class TablePropertiesMergerBorderLeft extends TablePropertiesMergerBorderBase {
    constructor(isTableOuterBorder = true) {
        super(isTableOuterBorder);
    }
    getPropertyFromContainer(container) {
        return container.borders.leftBorder;
    }
    getPropertyMask() {
        return super.getPropertiesMaskCore(TablePropertiesMask.UseLeftBorder);
    }
}
export class TablePropertiesMergerBorderRight extends TablePropertiesMergerBorderBase {
    constructor(isTableOuterBorder = true) {
        super(isTableOuterBorder);
    }
    getPropertyFromContainer(container) {
        return container.borders.rightBorder;
    }
    getPropertyMask() {
        return super.getPropertiesMaskCore(TablePropertiesMask.UseRightBorder);
    }
}
export class TablePropertiesMergerBorderTop extends TablePropertiesMergerBorderBase {
    constructor(isTableOuterBorder = true) {
        super(isTableOuterBorder);
    }
    getPropertyFromContainer(container) {
        return container.borders.topBorder;
    }
    getPropertyMask() {
        return super.getPropertiesMaskCore(TablePropertiesMask.UseTopBorder);
    }
}
export class TablePropertiesMergerBorderBottom extends TablePropertiesMergerBorderBase {
    constructor(isTableOuterBorder = true) {
        super(isTableOuterBorder);
    }
    getPropertyFromContainer(container) {
        return container.borders.bottomBorder;
    }
    getPropertyMask() {
        return super.getPropertiesMaskCore(TablePropertiesMask.UseBottomBorder);
    }
}
export class TablePropertiesMergerBorderVertical extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.borders.insideVerticalBorder;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseInsideVerticalBorder;
    }
}
export class TablePropertiesMergerBorderHorizontal extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.borders.insideHorizontalBorder;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseInsideHorizontalBorder;
    }
}
export class TablePropertiesMergerMarginLeft extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cellMargins.left;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseLeftMargin;
    }
}
export class TablePropertiesMergerMarginRight extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cellMargins.right;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseRightMargin;
    }
}
export class TablePropertiesMergerMarginTop extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cellMargins.top;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTopMargin;
    }
}
export class TablePropertiesMergerMarginBottom extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.cellMargins.bottom;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseBottomMargin;
    }
}
export class TablePropertiesMergerLayoutType extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.layoutType;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTableLayout;
    }
}
export class TablePropertiesMergerShadingInfo extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.shadingInfo;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseShadingInfoIndex;
    }
}
export class TablePropertiesMergerStyleColumnBandSize extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.tableStyleColumnBandSize;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTableStyleColBandSize;
    }
}
export class TablePropertiesMergerStyleRowBandSize extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.tableStyleRowBandSize;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTableStyleRowBandSize;
    }
}
export class TablePropertiesMergerHorizontalAlignment extends TablePropertiesMerger {
    getPropertyFromContainer(container) {
        return container.tableRowAlignment;
    }
    getPropertyMask() {
        return TablePropertiesMask.UseTableAlignment;
    }
    actionBeforeDefaultValue() {
        this.result = TableRowAlignment.Left;
        return true;
    }
}
