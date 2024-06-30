import { MapCreator } from '../../../../../base-utils/map-creator';
import { ElementDestination } from '../../destination';
import { GridColumnDestination } from './grid-column-destination';
export class TableGridDestination extends ElementDestination {
    constructor(data, tableGrid) {
        super(data);
        this.tableGrid = tableGrid;
    }
    get elementHandlerTable() {
        return TableGridDestination.handlerTable;
    }
}
TableGridDestination.handlerTable = new MapCreator()
    .add('gridCol', (data) => new GridColumnDestination(data, data.destinationStack.getThis().tableGrid))
    .get();
