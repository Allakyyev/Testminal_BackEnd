import { __awaiter } from "tslib";
import { SectionColumnProperties } from '../../../../core/model/section/section-column-properties';
import { Constants } from '@devexpress/utils/lib/constants';
import { LeafElementDestination } from '../destination';
export class ColumnDestination extends LeafElementDestination {
    constructor(data, columnInfos) {
        super(data);
        this.columnInfos = columnInfos;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const width = this.data.readerHelper.getWpSTIntegerValue(reader, 'w', Constants.MIN_SAFE_INTEGER);
            if (width > 0)
                this.columnInfos.push(new SectionColumnProperties(width, Math.max(0, this.data.readerHelper.getWpSTIntegerValue(reader, 'space', Constants.MIN_SAFE_INTEGER))));
        });
    }
}
