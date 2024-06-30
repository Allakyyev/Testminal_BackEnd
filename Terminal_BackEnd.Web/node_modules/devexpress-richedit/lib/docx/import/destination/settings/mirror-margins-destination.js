import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
export class DocumentSettingsMirrorMarginsDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTOnOffValue(reader, 'val', true);
            this.data.documentModel.mirrorMargins = value;
        });
    }
}
