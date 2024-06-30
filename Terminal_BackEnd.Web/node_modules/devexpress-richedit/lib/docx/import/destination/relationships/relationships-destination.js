import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { RelationDestination } from './relation-destination';
export class RelationshipsDestination extends ElementDestination {
    constructor(data, relations) {
        super(data);
        this.relations = relations;
    }
    get elementHandlerTable() {
        return RelationshipsDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
RelationshipsDestination.handlerTable = new MapCreator()
    .add('Relationship', (data, _reader) => new RelationDestination(data, RelationshipsDestination.getThis(data).relations))
    .get();
