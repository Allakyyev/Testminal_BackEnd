import { MapCreator } from '../../../../../base-utils/map-creator';
import { AltChunkDestination } from '../../document/alt-chunk-destination';
import { BodyDestinationBase } from '../../document/body-destination-base';
import { ParagraphDestination } from '../../paragraph/paragraph-destination';
import { TableDestination } from '../../table/table/table-destination';
export class HeaderFooterDestination extends BodyDestinationBase {
    get elementHandlerTable() {
        return HeaderFooterDestination.handlerTable;
    }
}
HeaderFooterDestination.handlerTable = new MapCreator()
    .add('p', (data) => new ParagraphDestination(data))
    .add('tbl', (data) => new TableDestination(data))
    .add('bookmarkStart', BodyDestinationBase.onBookmarkStart)
    .add('bookmarkEnd', BodyDestinationBase.onBookmarkEnd)
    .add('permStart', BodyDestinationBase.onRangePermissionStart)
    .add('permEnd', BodyDestinationBase.onRangePermissionEnd)
    .add('sdt', BodyDestinationBase.onStructuredDocument)
    .add('customXml', BodyDestinationBase.onCustomXml)
    .add('altChunk', (data) => new AltChunkDestination(data))
    .get();
