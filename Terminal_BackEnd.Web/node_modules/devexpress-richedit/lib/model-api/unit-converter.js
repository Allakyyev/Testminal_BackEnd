import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
export class UnitConverterApi {
    pixelsToTwips(value) {
        return UnitConverter.pixelsToTwips(value);
    }
    inchesToTwips(value) {
        return UnitConverter.inchesToTwips(value);
    }
    pointsToTwips(value) {
        return UnitConverter.pointsToTwips(value);
    }
    centimetersToTwips(value) {
        return UnitConverter.centimetersToTwips(value);
    }
    twipsToCentimeters(value) {
        return UnitConverter.twipsToCentimeters(value);
    }
    pixelsToCentimeters(value) {
        return UnitConverter.pixelToCentimeters(value);
    }
    twipsToInches(value) {
        return UnitConverter.twipsToInches(value);
    }
    pixelsToInches(value) {
        return UnitConverter.pixelsToInches(value);
    }
    pixelsToPoints(value) {
        return UnitConverter.pixelsToPoints(value);
    }
    twipsToPoints(value) {
        return UnitConverter.twipsToPointsF(value);
    }
    twipsToPixels(value) {
        return UnitConverter.twipsToPixelsF(value);
    }
}
