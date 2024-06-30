import { __awaiter } from "tslib";
import { LeafElementDestination } from '../../destination';
export class NextStyleDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.stylesImporter.currImporter.currInfo.nextId = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
        });
    }
}
