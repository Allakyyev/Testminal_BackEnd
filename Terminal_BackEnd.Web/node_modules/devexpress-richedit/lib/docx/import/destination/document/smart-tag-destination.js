import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { RunDestination } from '../runs/run-destination';
export class SmartTagDestination extends ElementDestination {
    get elementHandlerTable() {
        return SmartTagDestination.handlerTable;
    }
}
SmartTagDestination.handlerTable = new MapCreator()
    .add('smartTag', (data) => new SmartTagDestination(data))
    .add('r', (data) => new RunDestination(data))
    .get();
