import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class FormFieldProperties {
    calculateHash() {
        return StringUtils.stringHashCode(this.name) ^
            MathUtils.somePrimes[0] * this.statusTextType;
    }
    equals(obj) {
        return obj &&
            this.name == obj.name &&
            this.enabled == obj.enabled &&
            this.calculateOnExit == obj.calculateOnExit &&
            this.helpTextType == obj.helpTextType &&
            this.helpText == obj.helpText &&
            this.statusTextType == obj.statusTextType &&
            this.statusText == obj.statusText &&
            this.entryMacro == obj.entryMacro &&
            this.exitMacro == obj.exitMacro;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    copyFrom(obj) {
        obj.name = this.name;
        obj.enabled = this.enabled;
        obj.calculateOnExit = this.calculateOnExit;
        obj.helpTextType = this.helpTextType;
        obj.helpText = this.helpText;
        obj.statusTextType = this.statusTextType;
        obj.statusText = this.statusText;
        obj.entryMacro = this.entryMacro;
        obj.exitMacro = this.exitMacro;
        obj.hash = this.hash;
    }
    clone() {
        const result = new FormFieldProperties();
        result.copyFrom(this);
        return result;
    }
}
export var FormFieldPropertiesMask;
(function (FormFieldPropertiesMask) {
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseNone"] = 0] = "UseNone";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseName"] = 4] = "UseName";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseEnabled"] = 8] = "UseEnabled";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseCalculateOnExit"] = 16] = "UseCalculateOnExit";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseHelpTextType"] = 32] = "UseHelpTextType";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseHelpText"] = 64] = "UseHelpText";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseStatusTextType"] = 128] = "UseStatusTextType";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseStatusText"] = 256] = "UseStatusText";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseEntryMacro"] = 512] = "UseEntryMacro";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseExitMacro"] = 1024] = "UseExitMacro";
    FormFieldPropertiesMask[FormFieldPropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(FormFieldPropertiesMask || (FormFieldPropertiesMask = {}));
export class MaskedFormFieldProperties extends FormFieldProperties {
    constructor() {
        super(...arguments);
        this.useValue = FormFieldPropertiesMask.UseNone;
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
        const result = new MaskedFormFieldProperties();
        result.copyFrom(this);
        result.useValue = this.useValue;
        return result;
    }
}
