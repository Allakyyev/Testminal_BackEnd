import { MapCreator } from '../../../../base-utils/map-creator';
import { TabDestination } from './tab-destination';
import { TabsLeafElementDestination } from './tabs-leaf-element-destination';
export class TabsDestination extends TabsLeafElementDestination {
    get elementHandlerTable() {
        return TabsDestination.handlerTable;
    }
}
TabsDestination.handlerTable = new MapCreator()
    .add('tab', (data, _reader) => new TabDestination(data, data.destinationStack.getThis().tabs))
    .get();
