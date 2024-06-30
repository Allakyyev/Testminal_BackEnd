import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { DrawingAnchorDocumentPropertiesDestination } from './drawing-destination';
export class NonVisualPicturePropertiesDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return NonVisualPicturePropertiesDestination.handlerTable;
    }
    static OnNonVisualDrawingProperties(data, _reader) {
        const floatingObjectImportInfo = NonVisualPicturePropertiesDestination.getThis(data).floatingObjectImportInfo;
        return new DrawingAnchorDocumentPropertiesDestination(data, floatingObjectImportInfo, floatingObjectImportInfo.objectNonVisualProperties);
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
NonVisualPicturePropertiesDestination.handlerTable = new MapCreator()
    .add('cNvPr', NonVisualPicturePropertiesDestination.OnNonVisualDrawingProperties)
    .get();
