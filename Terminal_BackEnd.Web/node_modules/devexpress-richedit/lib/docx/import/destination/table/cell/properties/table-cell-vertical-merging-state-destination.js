import { TableCellMergingState } from '../../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellVerticalMergingStateDestination extends TableCellPropertiesLeafElementDestination {
    processElementClose(reader) {
        this.cell.verticalMerging = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.mergingStateTable.importMap, TableCellMergingState.Continue);
    }
}
