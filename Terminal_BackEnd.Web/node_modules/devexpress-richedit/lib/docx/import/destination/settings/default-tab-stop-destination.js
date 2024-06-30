import { __awaiter } from "tslib";
import { Constants } from '@devexpress/utils/lib/constants';
import { LeafElementDestination } from '../destination';
export class DocumentSettingsDefaultTabStopDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', Constants.MIN_SAFE_INTEGER);
            if (value > 0)
                this.data.documentModel.defaultTabWidth = Math.max(1, value);
        });
    }
}
