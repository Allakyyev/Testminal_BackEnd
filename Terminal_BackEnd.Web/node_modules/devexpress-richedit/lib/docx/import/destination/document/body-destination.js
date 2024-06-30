import { MapCreator } from '../../../../base-utils/map-creator';
import { ParagraphDestination } from '../paragraph/paragraph-destination';
import { LastSectionDestination } from '../section/last-section-destination';
import { TableDestination } from '../table/table/table-destination';
import { AltChunkDestination } from './alt-chunk-destination';
import { BodyDestinationBase } from './body-destination-base';
export class BodyDestination extends BodyDestinationBase {
    get elementHandlerTable() {
        return BodyDestination.handlerTable;
    }
}
BodyDestination.handlerTable = new MapCreator()
    .add('p', (data) => new ParagraphDestination(data))
    .add('tbl', (data) => new TableDestination(data))
    .add('sectPr', (data) => new LastSectionDestination(data))
    .add('bookmarkStart', BodyDestinationBase.onBookmarkStart)
    .add('bookmarkEnd', BodyDestinationBase.onBookmarkEnd)
    .add('permStart', BodyDestinationBase.onRangePermissionStart)
    .add('permEnd', BodyDestinationBase.onRangePermissionEnd)
    .add('commentRangeStart', BodyDestinationBase.onCommentStart)
    .add('commentRangeEnd', BodyDestinationBase.onCommentEnd)
    .add('sdt', BodyDestinationBase.onStructuredDocument)
    .add('altChunk', (data) => new AltChunkDestination(data))
    .add('customXml', BodyDestinationBase.onCustomXml)
    .add('del', BodyDestinationBase.onDeleted)
    .add('ins', BodyDestinationBase.onInserted)
    .get();
