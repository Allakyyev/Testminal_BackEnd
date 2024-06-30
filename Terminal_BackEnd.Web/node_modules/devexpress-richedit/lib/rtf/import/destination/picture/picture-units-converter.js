import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
export class RtfPictureUnitsConverter {
}
export class RtfPixelsToTwipsConverter extends RtfPictureUnitsConverter {
    constructor(dpi) {
        super();
        this.dpi = dpi;
    }
    unitsToTwips(val) {
        return Math.round(1440 * val / this.dpi);
    }
    unitsToModelUnits(val) {
        return UnitConverter.pixelsToTwipsCustomDpi(val, this.dpi);
    }
}
export class RtfHundredthsOfMillimeterConverter extends RtfPictureUnitsConverter {
    unitsToTwips(val) {
        return Math.round(1440 * val / 2540.0);
    }
    unitsToModelUnits(val) {
        return UnitConverter.hundredthsOfMillimeterToTwipsRound(val);
    }
}
