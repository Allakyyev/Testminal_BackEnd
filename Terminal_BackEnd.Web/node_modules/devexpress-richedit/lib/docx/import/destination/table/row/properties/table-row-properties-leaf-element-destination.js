import { ElementDestination } from '../../../destination';
export class TableRowPropertiesLeafElementDestination extends ElementDestination {
    constructor(data, row) {
        super(data);
        this.row = row;
    }
    get elementHandlerTable() {
        return {};
    }
}
