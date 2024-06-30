import { ElementDestination } from '../../../destination';
export class TablePropertiesBaseDestination extends ElementDestination {
    constructor(data, properties) {
        super(data);
        this.properties = properties;
    }
}
