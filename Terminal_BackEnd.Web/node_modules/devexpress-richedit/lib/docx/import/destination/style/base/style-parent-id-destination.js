import { __awaiter } from "tslib";
import { LeafElementDestination } from '../../destination';
export class StyleParentIdDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.stylesImporter.currImporter.currInfo.parentId = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
        });
    }
}
