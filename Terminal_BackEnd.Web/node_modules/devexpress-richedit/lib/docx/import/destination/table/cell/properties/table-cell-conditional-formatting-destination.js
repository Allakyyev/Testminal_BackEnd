import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellConditionalFormattingDestination extends TableCellPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const strValue = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(strValue))
                this.cell.conditionalFormatting = parseInt(strValue, 2);
        });
    }
}
