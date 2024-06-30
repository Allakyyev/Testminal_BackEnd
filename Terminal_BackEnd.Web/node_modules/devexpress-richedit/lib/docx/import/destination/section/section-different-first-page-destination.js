import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
export class SectionDifferentFirstPageDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.sectionImporter.properties.differentFirstPage = this.data.readerHelper.getWpSTOnOffValue(reader, 'val');
        });
    }
}
