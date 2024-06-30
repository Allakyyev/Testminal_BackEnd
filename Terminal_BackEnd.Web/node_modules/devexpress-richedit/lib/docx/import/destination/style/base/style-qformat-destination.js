import { __awaiter } from "tslib";
import { LeafElementDestination } from '../../destination';
export class StyleQFormatDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.stylesImporter.currImporter.currInfo.qFormat = this.data.readerHelper.getWpSTOnOffValue(reader, 'val', true);
        });
    }
}
