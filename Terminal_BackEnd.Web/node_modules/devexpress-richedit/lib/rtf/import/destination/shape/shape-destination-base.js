import { DestinationType } from '../utils/destination-type';
import { ShapeInstanceDestination } from './shape-instance-destination';
import { ShapePropertiesDestinationBase } from './shape-properties-destination-base';
export class ShapeDestinationBase extends ShapePropertiesDestinationBase {
    get destinationType() { return DestinationType.ShapeDestinationBase; }
    get controlCharHT() { return null; }
    constructor(importer, shapeProperties) {
        super(importer, shapeProperties);
    }
    static getThis(rtfImporter) {
        return rtfImporter.destination;
    }
    static onShapeInstanceKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ShapeInstanceDestination(importer, ShapeDestinationBase.getThis(importer).shapeProperties);
    }
    processControlCharCore(_ch) { }
    processCharCore(_ch) { }
}
