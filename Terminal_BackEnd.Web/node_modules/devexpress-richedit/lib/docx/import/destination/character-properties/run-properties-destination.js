import { MapCreator } from '../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RunPropertiesBaseDestination } from './run-properties-base-destination';
import { RunStyleReferenceDestination } from './run-style-reference-destination';
export class RunPropertiesDestination extends RunPropertiesBaseDestination {
    constructor(data, charProps) {
        super(data, charProps);
        this.data.subDocumentInfo.characterImporter.resetStyle();
    }
    get elementHandlerTable() {
        return RunPropertiesDestination.handlerTable;
    }
}
RunPropertiesDestination.handlerTable = new MapCreator(StringMapUtils.map(RunPropertiesBaseDestination.handlerTable, (e) => e))
    .add('rStyle', (data) => new RunStyleReferenceDestination(data))
    .get();
