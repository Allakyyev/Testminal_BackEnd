import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { CardinalEnglishNumericsProvider, OrdinalEnglishNumericsProvider } from './numerics-provider';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export var DigitType;
(function (DigitType) {
    DigitType[DigitType["Zero"] = 0] = "Zero";
    DigitType[DigitType["SingleNumeral"] = 1] = "SingleNumeral";
    DigitType[DigitType["Single"] = 2] = "Single";
    DigitType[DigitType["Teen"] = 3] = "Teen";
    DigitType[DigitType["Tenth"] = 4] = "Tenth";
    DigitType[DigitType["Hundred"] = 5] = "Hundred";
    DigitType[DigitType["Thousand"] = 6] = "Thousand";
    DigitType[DigitType["Million"] = 7] = "Million";
    DigitType[DigitType["Billion"] = 8] = "Billion";
    DigitType[DigitType["Trillion"] = 9] = "Trillion";
    DigitType[DigitType["Quadrillion"] = 10] = "Quadrillion";
    DigitType[DigitType["Quintillion"] = 11] = "Quintillion";
    DigitType[DigitType["Separator"] = 12] = "Separator";
})(DigitType || (DigitType = {}));
export class DigitInfo {
    constructor(provider, value, type) {
        this.provider = provider;
        this.value = value;
        this.type = type;
    }
    convertToString() {
        var numerics = this.getNumerics();
        return numerics[this.value];
    }
    getNumerics() {
        return [];
    }
}
export class SeparatorDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Separator);
    }
    getNumerics() {
        return this.provider.separator;
    }
}
export class QuintillionDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Quintillion);
    }
    getNumerics() {
        return this.provider.quintillion;
    }
}
export class QuadrillionDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Quadrillion);
    }
    getNumerics() {
        return this.provider.quadrillion;
    }
}
export class TrillionDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Trillion);
    }
    getNumerics() {
        return this.provider.trillion;
    }
}
export class BillionDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Billion);
    }
    getNumerics() {
        return this.provider.billion;
    }
}
export class MillionDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Million);
    }
    getNumerics() {
        return this.provider.million;
    }
}
export class ThousandDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Million);
    }
    getNumerics() {
        return this.provider.thousands;
    }
}
export class HundredDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value - 1, DigitType.Hundred);
    }
    getNumerics() {
        return this.provider.hundreds;
    }
}
export class TenthsDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value - 2, DigitType.Tenth);
    }
    getNumerics() {
        return this.provider.tenths;
    }
}
export class TeensDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value, DigitType.Teen);
    }
    getNumerics() {
        return this.provider.teens;
    }
}
export class SingleDigitInfo extends DigitInfo {
    constructor(provider, value) {
        super(provider, value - 1, DigitType.Single);
    }
    getNumerics() {
        return this.provider.singles;
    }
}
export class ZeroDigitInfo extends DigitInfo {
    constructor(provider) {
        super(provider, 9, DigitType.Zero);
    }
    getNumerics() {
        return this.provider.singles;
    }
}
export class DescriptiveEnglishNumberConverter extends OrdinalBasedNumberConverter {
    constructor() {
        super();
        this.minValue = 0;
    }
    convertNumberCore(value) {
        var digits = this.generateDigits(value);
        return this.convertDigitsToString(digits);
    }
    generateDigits(value) {
        var digits = [];
        digits = this.generateDigitsCore(digits, value);
        if (digits.length == 0)
            this.addZero(digits);
        return digits;
    }
    generateDigitsCore(digits, value) {
        var currentValue = value;
        if (Math.floor(currentValue / 1000000000000000000) != 0)
            this.generateQuintillionDigits(digits, Math.floor(currentValue / 1000000000000000000));
        currentValue = currentValue % 1000000000000000000;
        if (Math.floor(currentValue / 1000000000000000) != 0)
            this.generateQuadrillionDigits(digits, Math.floor(currentValue / 1000000000000000));
        currentValue = currentValue % 1000000000000000;
        if (Math.floor(currentValue / 1000000000000) != 0)
            this.generateTrillionDigits(digits, Math.floor(currentValue / 1000000000000));
        currentValue = currentValue % 1000000000000;
        if (Math.floor(currentValue / 1000000000) != 0)
            this.generateBillionDigits(digits, Math.floor(currentValue / 1000000000));
        currentValue = currentValue % 1000000000;
        if (Math.floor(currentValue / 1000000) != 0)
            this.generateMillionDigits(digits, Math.floor(currentValue / 1000000));
        currentValue = currentValue % 1000000;
        if (Math.floor(currentValue / 1000) != 0)
            this.generateThousandDigits(digits, Math.floor(currentValue / 1000));
        currentValue = currentValue % 1000;
        if (Math.floor(currentValue / 100) != 0)
            this.generateHundredDigits(digits, Math.floor(currentValue / 100));
        currentValue = currentValue % 100;
        if (currentValue == 0)
            return digits;
        if (currentValue >= 20)
            this.generateTenthsDigits(digits, currentValue);
        else {
            if (currentValue >= 10)
                this.generateTeensDigits(digits, currentValue % 10);
            else
                this.generateSinglesDigits(digits, currentValue);
        }
        return digits;
    }
    convertDigitsToString(digits) {
        var result = "";
        for (var i = 0; i < digits.length; i++)
            result += digits[i].convertToString();
        if (result.length > 0)
            result = result[0].toUpperCase() + result.substring(1);
        return result;
    }
    addZero(digits) {
        digits.push(new ZeroDigitInfo(new CardinalEnglishNumericsProvider()));
    }
    generateQuintillionDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new QuintillionDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateQuadrillionDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new QuadrillionDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateTrillionDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new TrillionDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateBillionDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new BillionDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateMillionDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new MillionDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateThousandDigits(digits, value) {
        this.generateDigitsCore(digits, value);
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new ThousandDigitInfo(new CardinalEnglishNumericsProvider(), 0));
    }
    generateHundredDigits(digits, value) {
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new HundredDigitInfo(new CardinalEnglishNumericsProvider(), value));
    }
    generateTenthsDigits(digits, value) {
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new TenthsDigitInfo(new CardinalEnglishNumericsProvider(), Math.floor(value / 10)));
        this.generateSinglesDigits(digits, value % 10);
    }
    generateTeensDigits(digits, value) {
        if (digits.length)
            digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        digits.push(new TeensDigitInfo(new CardinalEnglishNumericsProvider(), value));
    }
    generateSinglesDigits(digits, value) {
        if (value == 0)
            return;
        if (digits.length != 0) {
            if (digits[digits.length - 1].type == DigitType.Tenth)
                digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 1));
            else
                digits.push(new SeparatorDigitInfo(new CardinalEnglishNumericsProvider(), 0));
        }
        digits.push(new SingleDigitInfo(new CardinalEnglishNumericsProvider(), value));
    }
}
export class DescriptiveCardinalEnglishNumberConverter extends DescriptiveEnglishNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.CardinalText;
    }
}
export class DescriptiveOrdinalEnglishNumberConverter extends DescriptiveEnglishNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.OrdinalText;
    }
    generateDigits(value) {
        var digits = super.generateDigits(value);
        digits[digits.length - 1].provider = new OrdinalEnglishNumericsProvider();
        return digits;
    }
}
