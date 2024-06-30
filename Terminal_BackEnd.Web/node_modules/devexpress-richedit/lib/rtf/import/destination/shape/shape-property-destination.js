import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { ShapePropertyHsvValueDestination } from './shape-property-hsv-value-destination';
import { ShapePropertyNameDestination } from './shape-property-name-destination';
import { ShapePropertyValueDestination } from './shape-property-value-destination';
export class ShapePropertyDestination extends DestinationBase {
    constructor(rtfImporter, properties) {
        super(rtfImporter);
        this.properties = properties;
    }
    get destinationType() { return DestinationType.ShapePropertyDestination; }
    get controlCharHT() { return null; }
    processControlCharCore(_ch) { }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        const translator = this.keywordHT[keyword];
        if (translator) {
            translator(this.importer, parameterValue, hasParameter);
            return true;
        }
        return false;
    }
    processCharCore(_ch) { }
    createClone() {
        const clone = new ShapePropertyDestination(this.importer, this.properties);
        clone.propertyName = this.propertyName;
        return clone;
    }
    nestedGroupFinished(nestedDestination) {
        if (nestedDestination instanceof ShapePropertyNameDestination) {
            this.propertyName = nestedDestination.value;
            return;
        }
        if (nestedDestination instanceof ShapePropertyValueDestination) {
            this.value = nestedDestination.value;
            return;
        }
        if (nestedDestination instanceof ShapePropertyHsvValueDestination) {
            const hsvInfo = nestedDestination.hsvInfo;
            if (typeof (this.value) == 'number')
                hsvInfo.intColor = this.value;
            this.value = hsvInfo;
            return;
        }
    }
    beforePopRtfState() {
        if (StringUtils.isNullOrEmpty(this.propertyName))
            return;
        if (typeof (this.value) == 'number')
            this.properties.addProperty(this.propertyName, this.value);
        else
            this.properties.addProperty(this.propertyName, this.value);
    }
}
