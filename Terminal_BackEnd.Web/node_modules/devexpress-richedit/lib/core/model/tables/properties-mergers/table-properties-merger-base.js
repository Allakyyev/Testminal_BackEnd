export class TablePropertiesMergerBase {
    getProperty(container, style, condStyleFormattingFlags, defaultContainer) {
        if (this.getPropertyInternal(container))
            return this.result;
        if (this.processTablePropertiesException())
            return this.result;
        while (style) {
            const condStyleList = this.getCondTableStyleFormattingListForThisContainer();
            for (let cond of condStyleList)
                if (condStyleFormattingFlags & cond) {
                    const condStyle = style.conditionalStyles[cond];
                    if (condStyle && this.getPropertyInternal(this.getContainerFromConditionalStyle(condStyle)))
                        return this.result;
                }
            const baseConditionalStyleContainer = this.getContainerFromConditionalStyle(style.baseConditionalStyle);
            if (baseConditionalStyleContainer && this.getPropertyInternal(baseConditionalStyleContainer))
                return this.result;
            style = style.parent;
        }
        if (this.actionBeforeDefaultValue())
            return this.result;
        return this.getPropertyFromContainer(defaultContainer);
    }
    processTablePropertiesException() {
        if (!this.tablePropertiesException)
            return false;
        const res = this.getNotMergedProperty();
        if (!res.isFound)
            return false;
        this.result = res.result;
        return true;
    }
    getPropertyInternal(container) {
        if (!this.canUseValue(container))
            return false;
        this.result = this.getPropertyFromContainer(container);
        return true;
    }
    actionBeforeDefaultValue() {
        return false;
    }
}
export class TableMergerNotMergedPropertyResult {
    constructor(isFound, result) {
        this.isFound = isFound;
        this.result = result;
    }
}
