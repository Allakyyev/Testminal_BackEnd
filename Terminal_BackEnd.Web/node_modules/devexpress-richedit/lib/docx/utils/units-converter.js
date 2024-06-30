import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class UnitsConverter {
    static valueUnitToModelUnitsF(info) {
        if (StringUtils.isNullOrEmpty(info.unit))
            return info.value;
        switch (info.unit.toLowerCase()) {
            case 'km':
                return UnitConverter.centimetersToTwips(info.value * 100000);
            case 'm':
                return UnitConverter.centimetersToTwips(info.value * 100);
            case 'cm':
                return UnitConverter.centimetersToTwips(info.value);
            case 'mm':
                return UnitConverter.centimetersToTwips(info.value / 10);
            case 'in':
            case 'inch':
                return UnitConverter.inchesToTwips(info.value);
            case 'ft':
                return UnitConverter.inchesToTwips(info.value * 12);
            case 'pt':
                return UnitConverter.pointsToTwips(info.value);
            case 'pc':
                return UnitConverter.picasToTwips(info.value);
            case 'mi':
            case '%':
                return info.value / 100;
        }
        return info.value;
    }
    static rotationUnitToModelUnits(info) {
        if (StringUtils.isNullOrEmpty(info.unit))
            return info.value;
        switch (info.unit.toLowerCase()) {
            case 'fd':
                return UnitConverter.fdToTwips(info.value);
            case '':
                return UnitConverter.degreesToTwips(info.value);
            default:
                throw new Error('Invalid rotation value');
        }
    }
}
