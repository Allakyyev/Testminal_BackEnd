import { CharacterPropertiesMask } from '../../character/enums';
import { TableCellPropertiesMerger } from './table-cell-properties-merger';
import { TableMergerNotMergedPropertyResult, TablePropertiesMergerBase } from './table-properties-merger-base';
export class TableStyleCharacterPropertiesMerger extends TablePropertiesMergerBase {
    getContainerFromConditionalStyle(condStyle) {
        return condStyle.maskedCharacterProperties;
    }
    canUseValue(props) {
        return !!(props.getUseValue(this.getPropertyMask()));
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
export class TableStyleCharacterPropertiesMergerHidden extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.hidden;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseHidden;
    }
}
export class TableStyleCharacterPropertiesMergerScript extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.script;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseScript;
    }
}
export class TableStyleCharacterPropertiesMergerAllCaps extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.allCaps;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseAllCaps;
    }
}
export class TableStyleCharacterPropertiesMergerSmallCaps extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.smallCaps;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseSmallCaps;
    }
}
export class TableStyleCharacterPropertiesMergerNoProof extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.noProof;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseNoProof;
    }
}
export class TableStyleCharacterPropertiesMergerFontBold extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontBold;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseFontBold;
    }
}
export class TableStyleCharacterPropertiesMergerFontName extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontInfo;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseFontName;
    }
}
export class TableStyleCharacterPropertiesMergerShadingInfo extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.shadingInfo;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseShadingInfoIndex;
    }
}
export class TableStyleCharacterPropertiesMergerTextColor extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.textColor;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseForeColorIndex;
    }
}
export class TableStyleCharacterPropertiesMergerFontSize extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontSize;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseDoubleFontSize;
    }
}
export class TableStyleCharacterPropertiesMergerFontItalic extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontItalic;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseFontItalic;
    }
}
export class TableStyleCharacterPropertiesMergerHighlightColor extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.highlightColor;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseStrikeoutColorIndex;
    }
}
export class TableStyleCharacterPropertiesMergerStrikeoutColor extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.strikeoutColor;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseStrikeoutColorIndex;
    }
}
export class TableStyleCharacterPropertiesMergerUnderlineColor extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.underlineColor;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseUnderlineColorIndex;
    }
}
export class TableStyleCharacterPropertiesMergerFontStrikeoutType extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontStrikeoutType;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseFontStrikeoutType;
    }
}
export class TableStyleCharacterPropertiesMergerFontUnderlineType extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.fontUnderlineType;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseFontUnderlineType;
    }
}
export class TableStyleCharacterPropertiesMergerStrikeoutWordsOnly extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.strikeoutWordsOnly;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseStrikeoutWordsOnly;
    }
}
export class TableStyleCharacterPropertiesMergerUnderlineWordsOnly extends TableStyleCharacterPropertiesMerger {
    getPropertyFromContainer(container) {
        return container.underlineWordsOnly;
    }
    getPropertyMask() {
        return CharacterPropertiesMask.UseUnderlineWordsOnly;
    }
}
