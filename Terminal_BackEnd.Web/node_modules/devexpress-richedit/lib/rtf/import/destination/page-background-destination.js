import { DestinationBase } from './base/destination';
import { ShapeInstanceDestination } from './shape/shape-instance-destination';
import { DestinationType } from './utils/destination-type';
export class PageBackgroundDestination extends DestinationBase {
    get destinationType() { return DestinationType.PageBackgroundDestination; }
    get controlCharHT() { return null; }
    createClone() {
        return new PageBackgroundDestination(this.importer);
    }
    beforeNestedGroupFinishedCore(nestedDestination) {
        super.beforeNestedGroupFinishedCore(nestedDestination);
        if (this.importer.destination instanceof ShapeInstanceDestination)
            if (this.importer.destination.hasColorProperty("fillColor"))
                this.importer.documentModel.pageBackColor = this.importer.destination.getColorPropertyValue("fillColor");
    }
}
