import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
export class DocumentSettingsDifferentOddAndEvenPagesDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.documentModel.differentOddAndEvenPages = this.data.readerHelper.getWpSTOnOffValue(reader, 'val');
        });
    }
}
