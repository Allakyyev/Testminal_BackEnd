import { MapCreator } from '../../../../../base-utils/map-creator';
import { ElementDestination } from '../../destination';
import { HSLColorDestination } from './h-slcolor-destination';
import { HexRGBColorDestination } from './hex-rgbcolor-destination';
import { PercentageRGBColorDestination } from './percentage-rgbcolor-destination';
import { PresetColorDestination } from './preset-color-destination';
import { SchemeColorDestination } from './scheme-color-destination';
import { SystemColorDestination } from './system-color-destination';
export class DrawingColorDestinationBase extends ElementDestination {
    constructor(data, color) {
        super(data);
        this.color = color;
        this.hasColor = false;
    }
    static getColor(data) {
        const destination = data.destinationStack.getThis();
        destination.hasColor = true;
        return destination.color;
    }
}
DrawingColorDestinationBase.handlerTable = new MapCreator()
    .add('hslClr', (data) => new HSLColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .add('prstClr', (data) => new PresetColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .add('schemeClr', (data) => new SchemeColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .add('scrgbClr', (data) => new PercentageRGBColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .add('srgbClr', (data) => new HexRGBColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .add('sysClr', (data) => new SystemColorDestination(data, DrawingColorDestinationBase.getColor(data)))
    .get();
