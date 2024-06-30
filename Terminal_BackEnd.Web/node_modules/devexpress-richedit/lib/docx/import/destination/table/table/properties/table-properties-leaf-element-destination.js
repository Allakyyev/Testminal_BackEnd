import { ElementDestination } from '../../../destination';
export class TablePropertiesLeafElementDestination extends ElementDestination {
    constructor(data, table, tableProperties) {
        super(data);
        this.table = table;
        this.tableProperties = tableProperties;
    }
    get elementHandlerTable() {
        return {};
    }
    static getProperties(data) {
        return data.destinationStack.getThis().tableProperties;
    }
}
