import { MapCreator } from '../../../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RunPropertiesBaseDestination } from '../../../character-properties/run-properties-base-destination';
import { DefaultFontNameDestination } from './default-font-name-destination';
export class InnerDefaultRunPropertiesDestination extends RunPropertiesBaseDestination {
    get elementHandlerTable() {
        return InnerDefaultRunPropertiesDestination.handlerTable;
    }
}
InnerDefaultRunPropertiesDestination.handlerTable = new MapCreator(StringMapUtils.map(RunPropertiesBaseDestination.handlerTable, (e) => e))
    .add('rFonts', (data) => new DefaultFontNameDestination(data, data.destinationStack.getThis().characterProperties))
    .get();
