import { Constants } from '@devexpress/utils/lib/constants';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowGridBeforeDestination extends TableRowPropertiesLeafElementDestination {
    processElementClose(reader) {
        const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val');
        if (value != Constants.MIN_SAFE_INTEGER)
            this.row.gridBefore = Math.max(0, value);
    }
}
