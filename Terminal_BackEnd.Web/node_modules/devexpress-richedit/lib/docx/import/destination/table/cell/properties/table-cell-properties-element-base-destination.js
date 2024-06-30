import { ElementDestination } from '../../../destination';
export class TableCellPropertiesElementBaseDestination extends ElementDestination {
    constructor(data, cell) {
        super(data);
        this.cell = cell;
    }
}
