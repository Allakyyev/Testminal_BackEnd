import { MathUtils } from '@devexpress/utils/lib/utils/math';
export var CheckBoxState;
(function (CheckBoxState) {
    CheckBoxState[CheckBoxState["Unchecked"] = 0] = "Unchecked";
    CheckBoxState[CheckBoxState["Checked"] = 1] = "Checked";
    CheckBoxState[CheckBoxState["Undefined"] = 25] = "Undefined";
})(CheckBoxState || (CheckBoxState = {}));
export var CheckBoxSizeMode;
(function (CheckBoxSizeMode) {
    CheckBoxSizeMode[CheckBoxSizeMode["Auto"] = 0] = "Auto";
    CheckBoxSizeMode[CheckBoxSizeMode["Exact"] = 1] = "Exact";
})(CheckBoxSizeMode || (CheckBoxSizeMode = {}));
export var FormFieldTextType;
(function (FormFieldTextType) {
    FormFieldTextType[FormFieldTextType["Auto"] = 0] = "Auto";
    FormFieldTextType[FormFieldTextType["Custom"] = 1] = "Custom";
})(FormFieldTextType || (FormFieldTextType = {}));
export class CheckBoxProperties {
    calculateHash() {
        return MathUtils.somePrimes[0] * this.size ^
            MathUtils.somePrimes[1] * this.sizeType;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        return obj &&
            this.checkBoxState == obj.checkBoxState &&
            this.defaultState == obj.defaultState &&
            this.size == obj.size &&
            this.sizeType == obj.sizeType;
    }
    copyFrom(obj) {
        obj.checkBoxState = this.checkBoxState;
        obj.defaultState = this.defaultState;
        obj.size = this.size;
        obj.sizeType = this.sizeType;
        obj.hash = this.hash;
    }
    clone() {
        const result = new CheckBoxProperties();
        result.copyFrom(this);
        return result;
    }
}
export var MaskedCheckBoxPropertiesMask;
(function (MaskedCheckBoxPropertiesMask) {
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseNone"] = 0] = "UseNone";
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseState"] = 4] = "UseState";
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseDefaultState"] = 8] = "UseDefaultState";
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseSize"] = 16] = "UseSize";
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseSizeMode"] = 32] = "UseSizeMode";
    MaskedCheckBoxPropertiesMask[MaskedCheckBoxPropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(MaskedCheckBoxPropertiesMask || (MaskedCheckBoxPropertiesMask = {}));
export class MaskedCheckBoxProperties extends CheckBoxProperties {
    constructor() {
        super(...arguments);
        this.useValue = MaskedCheckBoxPropertiesMask.UseNone;
    }
    calculateHash() {
        return super.calculateHash() +
            MathUtils.somePrimes[15] * this.useValue;
    }
    getUseValue(value) {
        return (this.useValue & value) != 0;
    }
    setUseValue(mask, value) {
        if (value)
            this.useValue |= mask;
        else
            this.useValue &= ~mask;
    }
    equals(obj) {
        return super.equals(obj) &&
            this.useValue == obj.useValue;
    }
    clone() {
        const result = new MaskedCheckBoxProperties();
        result.copyFrom(this);
        result.useValue = this.useValue;
        return result;
    }
}
