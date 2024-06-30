import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TabProperties } from '../../../../../../core/model/paragraph/paragraph-style';
import { ElementDestination } from '../../../destination';
import { InnerDefaultParagraphPropertiesDestination } from './inner-default-paragraph-properties-destination';
export class DefaultParagraphPropertiesDestination extends ElementDestination {
    get elementHandlerTable() {
        return DefaultParagraphPropertiesDestination.handlerTable;
    }
}
DefaultParagraphPropertiesDestination.handlerTable = new MapCreator()
    .add('pPr', (data) => new InnerDefaultParagraphPropertiesDestination(data, data.documentModel.defaultParagraphProperties, new TabProperties()))
    .get();
