import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { AltChunkInfo } from '../../model/alt-chunk-info';
import { ElementDestination } from '../destination';
import { AltChunkPropertiesDestination } from './alt-chunk-properties-destination';
export class AltChunkDestination extends ElementDestination {
    get elementHandlerTable() {
        return AltChunkDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = reader.getAttributeNS('id', this.data.constants.relsNamespaceConst);
            if (!StringUtils.isNullOrEmpty(id))
                this.relId = id;
        });
    }
    processElementClose(_reader) {
        if (!StringUtils.isNullOrEmpty(this.relId)) {
            this.data.altChunkImporter.altChunkInfos.push(new AltChunkInfo(this.relId, this.data.subDocumentInfo.positionImporter.currPosition, this.data.subDocument));
            this.data.subDocumentInfo.paragraphImporter.insertParagraph();
        }
    }
}
AltChunkDestination.handlerTable = new MapCreator()
    .add('altChunkPr', (data) => new AltChunkPropertiesDestination(data))
    .get();
