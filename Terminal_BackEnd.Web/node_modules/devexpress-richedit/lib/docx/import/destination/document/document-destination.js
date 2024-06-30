import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { BackgroundDestination } from './background-destination';
import { BodyDestination } from './body-destination';
import { DocumentVersionDestination } from './document-version-destination';
export class DocumentDestination extends ElementDestination {
    get elementHandlerTable() {
        return DocumentDestination.handlerTable;
    }
}
DocumentDestination.handlerTable = new MapCreator()
    .add('body', (data) => new BodyDestination(data))
    .add('background', (data) => new BackgroundDestination(data))
    .add('version', (data) => new DocumentVersionDestination(data))
    .get();
