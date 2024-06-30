import { __awaiter } from "tslib";
import { LeafElementDestination } from '../../destination';
export class StyleSemiHiddenDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.stylesImporter.currImporter.currInfo.semiHidden = this.data.readerHelper.getWpSTOnOffValue(reader, 'val');
        });
    }
}
