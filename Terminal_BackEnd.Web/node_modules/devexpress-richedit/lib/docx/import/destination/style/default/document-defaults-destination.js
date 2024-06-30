import { MapCreator } from '../../../../../base-utils/map-creator';
import { ElementDestination } from '../../destination';
import { DefaultRunPropertiesDestination } from './char/default-run-properties-destination';
import { DefaultParagraphPropertiesDestination } from './par/default-paragraph-properties-destination';
export class DocumentDefaultsDestination extends ElementDestination {
    get elementHandlerTable() {
        return DocumentDefaultsDestination.handlerTable;
    }
}
DocumentDefaultsDestination.handlerTable = new MapCreator()
    .add('pPrDefault', (data) => new DefaultParagraphPropertiesDestination(data))
    .add('rPrDefault', (data) => new DefaultRunPropertiesDestination(data))
    .get();
