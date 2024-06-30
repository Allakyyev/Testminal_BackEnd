import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TableStyleDestination } from '../../table-style-destination';
import { TablePropertiesDestinationCore } from './table-properties-destination-core';
export class TablePropertiesDestination extends TablePropertiesDestinationCore {
    constructor(data, table) {
        super(data, table, table.properties);
    }
    get elementHandlerTable() {
        return TablePropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
TablePropertiesDestination.handlerTable = new MapCreator(TablePropertiesDestinationCore.handlerTable)
    .add('tblStyle', (data) => new TableStyleDestination(data, TablePropertiesDestination.getThis(data).table))
    .get();
