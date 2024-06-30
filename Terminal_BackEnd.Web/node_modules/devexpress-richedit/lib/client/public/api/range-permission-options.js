export class RangePermissionOptionsApi {
    constructor(native) {
        this._native = native;
    }
    get highlightRanges() {
        return this._native.core.modelManager.richOptions.documentProtection.highlightRanges;
    }
    set highlightRanges(value) {
        if (this.highlightRanges == value)
            return;
        this._native.core.modelManager.richOptions.documentProtection.highlightRanges = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseRangePermissionPropertiesChanged();
    }
    get showBrackets() {
        return this._native.core.modelManager.richOptions.documentProtection.showBrackets;
    }
    set showBrackets(value) {
        if (this.showBrackets == value)
            return;
        this._native.core.modelManager.richOptions.documentProtection.showBrackets = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseProtectionPropertiesChanged();
    }
    get highlightColor() {
        return this._native.core.modelManager.richOptions.documentProtection.rangeHighlightColor;
    }
    set highlightColor(value) {
        if (this.highlightColor == value)
            return;
        this._native.core.modelManager.richOptions.documentProtection.rangeHighlightColor = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseRangePermissionPropertiesChanged();
    }
    get bracketsColor() {
        return this._native.core.modelManager.richOptions.documentProtection.rangeHighlightBracketsColor;
    }
    set bracketsColor(value) {
        if (this.bracketsColor == value)
            return;
        this._native.core.modelManager.richOptions.documentProtection.rangeHighlightBracketsColor = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseProtectionPropertiesChanged();
    }
}
