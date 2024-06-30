import { SchemeColorValues } from '../../../../core/model/themes/enums';
import { HsvInfo } from '../../model/color-collections';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
export class ShapePropertyHsvValueDestination extends DestinationBase {
    constructor(importer, hsvInfo = new HsvInfo()) {
        super(importer);
        this.hsvInfo = hsvInfo;
    }
    get destinationType() { return DestinationType.ShapePropertyHsvValueDestination; }
    get controlCharHT() { return null; }
    static getThis(importer) {
        return importer.destination;
    }
    static onAccentOneKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent1;
    }
    static onAccentTwoKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent2;
    }
    static onAccentThreeKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent3;
    }
    static onAccentFourKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent4;
    }
    static onAccentFiveKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent5;
    }
    static onAccentSixKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.schemeColor = SchemeColorValues.Accent6;
    }
    static onTintKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.tint = parameterValue;
    }
    static onShadeKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertyHsvValueDestination.getThis(importer).hsvInfo.shade = parameterValue;
    }
    createClone() {
        return new ShapePropertyHsvValueDestination(this.importer, this.hsvInfo);
    }
}
