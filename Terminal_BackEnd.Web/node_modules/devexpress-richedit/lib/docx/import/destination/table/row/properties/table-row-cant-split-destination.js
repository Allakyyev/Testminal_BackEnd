import { TableRowPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-row-property-descriptor';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowCantSplitDestination extends TableRowPropertiesLeafElementDestination {
    processElementClose(reader) {
        this.row.properties.setValue(TableRowPropertyDescriptor.cantSplit, this.data.readerHelper.getWpSTOnOffValue(reader, 'val', true));
    }
}
