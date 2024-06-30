import { MapCreator } from '../../../../../../base-utils/map-creator';
import { ElementDestination } from '../../../destination';
import { WidthUnitDestination } from '../../width-unit-destination';
export class TableCellMarginsDestination extends ElementDestination {
    constructor(data, properties, descriptors) {
        super(data);
        this.descriptors = descriptors;
        this.properties = properties;
    }
    get elementHandlerTable() {
        return new MapCreator()
            .add('top', this.getHandler(this.descriptors.top))
            .add('left', this.getHandler(this.descriptors.left))
            .add('start', this.getHandler(this.descriptors.left))
            .add('bottom', this.getHandler(this.descriptors.bottom))
            .add('right', this.getHandler(this.descriptors.right))
            .add('end', this.getHandler(this.descriptors.right))
            .get();
    }
    getHandler(desc) {
        const props = this.properties;
        return (data) => new WidthUnitDestination(data, desc.getProp(props), () => props.setValue(desc, desc.getProp(props)));
    }
}
