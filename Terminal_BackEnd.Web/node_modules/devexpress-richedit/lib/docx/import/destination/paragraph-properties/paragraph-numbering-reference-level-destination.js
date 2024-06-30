import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
export class ParagraphNumberingReferenceLevelDestination extends LeafElementDestination {
    constructor(data, parentDestination) {
        super(data);
        this.parentDestination = parentDestination;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.parentDestination.listLevelIndex = Math.max(0, Math.min(8, this.data.readerHelper.getWpSTIntegerValue(reader, 'val', -1)));
        });
    }
}
