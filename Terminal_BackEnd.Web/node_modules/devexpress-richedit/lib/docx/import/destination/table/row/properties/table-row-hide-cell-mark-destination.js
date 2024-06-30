import { TableRowPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-row-property-descriptor';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowHideCellMarkDestination extends TableRowPropertiesLeafElementDestination {
    processElementClose(reader) {
        this.row.properties.setValue(TableRowPropertyDescriptor.hideCellMark, this.data.readerHelper.getWpSTOnOffValue(reader, 'val'));
    }
}
