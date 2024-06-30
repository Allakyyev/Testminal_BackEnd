import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
export var RichEditUnit;
(function (RichEditUnit) {
    RichEditUnit[RichEditUnit["Centimeter"] = 0] = "Centimeter";
    RichEditUnit[RichEditUnit["Inch"] = 1] = "Inch";
})(RichEditUnit || (RichEditUnit = {}));
export function createUnitConverter(unit) {
    switch (unit) {
        case RichEditUnit.Centimeter: return new UIUnitConverterCentimeter();
        case RichEditUnit.Inch: return new UIUnitConverterInch();
        default: throw new Error(Errors.InternalException);
    }
}
export class UIUnitConverterCentimeter extends UnitConverter {
    getUnits() {
        return RichEditUnit.Centimeter;
    }
    twipsToUI(value) {
        return UnitConverter.twipsToCentimeters(value);
    }
    UIToTwips(value) {
        return UnitConverter.centimetersToTwips(value);
    }
}
export class UIUnitConverterInch extends UnitConverter {
    getUnits() {
        return RichEditUnit.Inch;
    }
    twipsToUI(value) {
        return UnitConverter.twipsToInches(value);
    }
    UIToTwips(value) {
        return UnitConverter.inchesToTwips(value);
    }
}
