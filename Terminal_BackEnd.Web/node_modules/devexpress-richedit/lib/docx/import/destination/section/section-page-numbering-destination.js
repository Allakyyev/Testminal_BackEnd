import { __awaiter } from "tslib";
import { Constants } from '@devexpress/utils/lib/constants';
import { LeafElementDestination } from '../destination';
export class SectionPageNumberingDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstPageNumber = this.data.readerHelper.getWpSTIntegerValue(reader, 'start', Constants.MIN_SAFE_INTEGER);
            if (firstPageNumber != Constants.MIN_SAFE_INTEGER) {
                this.data.sectionImporter.properties.firstPageNumber = Math.max(0, firstPageNumber);
                this.data.sectionImporter.properties.continueNumbering = false;
            }
        });
    }
}
