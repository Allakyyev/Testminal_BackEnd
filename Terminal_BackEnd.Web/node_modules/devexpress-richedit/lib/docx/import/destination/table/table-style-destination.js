import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
export class TableStyleDestination extends LeafElementDestination {
    constructor(data, table) {
        super(data);
        this.table = table;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const styleId = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            const style = this.data.stylesImporter.tableManager.getStyleById(styleId);
            if (style)
                this.table.style = style;
        });
    }
}
