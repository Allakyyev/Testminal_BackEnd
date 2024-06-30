import { Constants } from '@devexpress/utils/lib/constants';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowGridAfterDestination extends TableRowPropertiesLeafElementDestination {
    processElementClose(reader) {
        const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val');
        if (value != Constants.MIN_SAFE_INTEGER)
            this.row.gridAfter = Math.max(0, value);
    }
}
