import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { DrawingColorDestinationBase } from './drawing-color-destination-base';
export class DrawingColorDestination extends DrawingColorDestinationBase {
    get elementHandlerTable() {
        return DrawingColorDestination.handlerTable;
    }
}
DrawingColorDestination.handlerTable = StringMapUtils.shallowCopy(DrawingColorDestinationBase.handlerTable);
