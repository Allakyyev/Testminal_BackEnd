import { ParagraphPropertiesMask } from '../../paragraph/paragraph-properties';
import { TableCellPropertiesMerger } from './table-cell-properties-merger';
import { TableMergerNotMergedPropertyResult, TablePropertiesMergerBase } from './table-properties-merger-base';
export class TableStyleParagraphPropertiesMerger extends TablePropertiesMergerBase {
    getContainerFromConditionalStyle(condStyle) {
        return condStyle.maskedParagraphProperties;
    }
    canUseValue(props) {
        return !!(props.useValue & this.getPropertyMask());
    }
    getCondTableStyleFormattingListForThisContainer() {
        return TableCellPropertiesMerger.conditionalTableStyleFormattingPriority;
    }
    actionBeforeDefaultValue() {
        this.result = null;
        return true;
    }
    getNotMergedProperty() {
        return new TableMergerNotMergedPropertyResult(false, null);
    }
}
export class TableStyleParagraphPropertiesMergerAlignment extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.alignment;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseAlignment;
    }
}
export class TableStyleParagraphPropertiesMergerShadingInfo extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.shadingInfo;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseShadingInfoIndex;
    }
}
export class TableStyleParagraphPropertiesMergerLeftIndent extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.leftIndent;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseLeftIndent;
    }
}
export class TableStyleParagraphPropertiesMergerRightIndent extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.rightIndent;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseRightIndent;
    }
}
export class TableStyleParagraphPropertiesMergerTopBorder extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.topBorder;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseTopBorder;
    }
}
export class TableStyleParagraphPropertiesMergerKeepWithNext extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.keepWithNext;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseKeepWithNext;
    }
}
export class TableStyleParagraphPropertiesMergerOutlineLevel extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.outlineLevel;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseOutlineLevel;
    }
}
export class TableStyleParagraphPropertiesMergerSpacingAfter extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.spacingAfter;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseSpacingAfter;
    }
}
export class TableStyleParagraphPropertiesMergerLeftBorder extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.leftBorder;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseLeftBorder;
    }
}
export class TableStyleParagraphPropertiesMergerSpacingBefore extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.spacingBefore;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseSpacingBefore;
    }
}
export class TableStyleParagraphPropertiesMergerRightBorder extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.rightBorder;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseRightBorder;
    }
}
export class TableStyleParagraphPropertiesMergerBottomBorder extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.bottomBorder;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseBottomBorder;
    }
}
export class TableStyleParagraphPropertiesMergerBetweenBorder extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.betweenBorder;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseBetweenBorder;
    }
}
export class TableStyleParagraphPropertiesMergerPageBreakBefore extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.pageBreakBefore;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UsePageBreakBefore;
    }
}
export class TableStyleParagraphPropertiesMergerAfterAutoSpacing extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.afterAutoSpacing;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseAfterAutoSpacing;
    }
}
export class TableStyleParagraphPropertiesMergerKeepLinesTogether extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.keepLinesTogether;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseKeepLinesTogether;
    }
}
export class TableStyleParagraphPropertiesMergerRightToLeft extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.rightToLeft;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseRightToLeft;
    }
}
export class TableStyleParagraphPropertiesMergerBeforeAutoSpacing extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.beforeAutoSpacing;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseBeforeAutoSpacing;
    }
}
export class TableStyleParagraphPropertiesMergerContextualSpacing extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.contextualSpacing;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseContextualSpacing;
    }
}
export class TableStyleParagraphPropertiesMergerWidowOrphanControl extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.widowOrphanControl;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseWidowOrphanControl;
    }
}
export class TableStyleParagraphPropertiesMergerSuppressHyphenation extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.suppressHyphenation;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseSuppressHyphenation;
    }
}
export class TableStyleParagraphPropertiesMergerSuppressLineNumbers extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.suppressLineNumbers;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseSuppressLineNumbers;
    }
}
export class TableStyleParagraphPropertiesMergerFirstLineIndent extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.firstLineIndent;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseFirstLineIndent;
    }
}
export class TableStyleParagraphPropertiesMergerFirstLineIndentType extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.firstLineIndentType;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseFirstLineIndent;
    }
}
export class TableStyleParagraphPropertiesMergerLineSpacing extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.lineSpacing;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseLineSpacing;
    }
}
export class TableStyleParagraphPropertiesMergerLineSpacingType extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.lineSpacingType;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseLineSpacing;
    }
}
export class TableStyleParagraphPropertiesMergerDivId extends TableStyleParagraphPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.divId;
    }
    getPropertyMask() {
        return ParagraphPropertiesMask.UseDivId;
    }
}
