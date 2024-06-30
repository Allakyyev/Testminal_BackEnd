import { __awaiter } from "tslib";
import { NumberingListBase } from '../../../../core/model/numbering-lists/numbering-list';
import { Constants } from '@devexpress/utils/lib/constants';
import { LeafElementDestination } from '../destination';
export class ParagraphNumberingReferenceNumberingIdDestination extends LeafElementDestination {
    constructor(data, parentDestination) {
        super(data);
        this.parentDestination = parentDestination;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let numberingId = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', Constants.MIN_SAFE_INTEGER);
            if (numberingId == 0)
                numberingId = NumberingListBase.NoNumberingListIndex;
            this.parentDestination.numberingId = numberingId;
        });
    }
}
