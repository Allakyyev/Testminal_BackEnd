import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { DocumentDefaultsDestination } from './default/document-defaults-destination';
import { StyleDestination } from './style-destination';
export class StylesDestination extends ElementDestination {
    get elementHandlerTable() {
        return StylesDestination.handlerTable;
    }
}
StylesDestination.handlerTable = new MapCreator()
    .add('docDefaults', (data) => new DocumentDefaultsDestination(data))
    .add('style', (data) => new StyleDestination(data))
    .get();
