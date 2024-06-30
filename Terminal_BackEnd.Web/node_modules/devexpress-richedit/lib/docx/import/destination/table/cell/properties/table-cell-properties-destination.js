import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TableCellPropertiesDestinationCore } from './table-cell-properties-destination-core';
import { TableCellStyleDestination } from './table-cell-style-destination';
export class TableCellPropertiesDestination extends TableCellPropertiesDestinationCore {
    get elementHandlerTable() {
        return TableCellPropertiesDestination.handlerTable;
    }
}
TableCellPropertiesDestination.handlerTable = new MapCreator(TableCellPropertiesDestinationCore.handlerTable)
    .add('tblCStyle', (data) => new TableCellStyleDestination(data, data.destinationStack.getThis().cell))
    .get();
