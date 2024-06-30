import { __awaiter } from "tslib";
import { LeafElementDestination } from '../../../destination';
export class TableCellStyleDestination extends LeafElementDestination {
    constructor(data, cell) {
        super(data);
        this.cell = cell;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const styleName = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            const style = this.data.stylesImporter.tableCellStyles[styleName];
            if (style)
                this.cell.style = style;
        });
    }
}
