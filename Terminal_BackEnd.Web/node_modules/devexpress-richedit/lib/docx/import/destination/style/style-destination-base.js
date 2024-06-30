import { MapCreator } from '../../../../base-utils/map-creator';
import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { CharacterPropertiesMask } from '../../../../core/model/character/enums';
import { NumberingList } from '../../../../core/model/numbering-lists/numbering-list';
import { MaskedParagraphProperties, ParagraphPropertiesMask } from '../../../../core/model/paragraph/paragraph-properties';
import { TabProperties } from '../../../../core/model/paragraph/paragraph-style';
import { Table } from '../../../../core/model/tables/main-structures/table';
import { TableCell } from '../../../../core/model/tables/main-structures/table-cell';
import { TableRow } from '../../../../core/model/tables/main-structures/table-row';
import { TableCellProperties, TableCellPropertiesMask } from '../../../../core/model/tables/properties/table-cell-properties';
import { TableProperties, TablePropertiesMask } from '../../../../core/model/tables/properties/table-properties';
import { TableRowProperties, TableRowPropertiesMask } from '../../../../core/model/tables/properties/table-row-properties';
import { ElementDestination } from '../destination';
import { StyleParagraphPropertiesDestination } from './destinations/style-paragraph-properties-destination';
import { StyleRunPropertiesDestination } from './destinations/style-run-properties-destination';
import { StyleTableCellPropertiesDestination } from './destinations/style-table-cell-properties-destination';
import { StyleTablePropertiesDestination } from './destinations/style-table-properties-destination';
import { StyleTableRowPropertiesDestination } from './destinations/style-table-row-properties-destination';
export class StyleDestinationBase extends ElementDestination {
    constructor(data) {
        super(data);
        this.numberingId = NumberingList.NumberingListNotSettedIndex;
        this.characterFormatting = new MaskedCharacterProperties();
        this.paragraphFormatting = new MaskedParagraphProperties();
        this.tableProperties = new TableProperties();
        this.tableRowProperties = new TableRowProperties();
        this.tableCellProperties = new TableCellProperties();
        this.tabs = new TabProperties();
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
StyleDestinationBase.handlerTable = new MapCreator()
    .add('pPr', (data) => {
    const thisDest = StyleDestinationBase.getThis(data);
    const parProps = thisDest.paragraphFormatting;
    parProps.setUseValue(ParagraphPropertiesMask.UseAll, false);
    return new StyleParagraphPropertiesDestination(data, thisDest, parProps, thisDest.tabs);
})
    .add('rPr', (data) => {
    const thisDest = StyleDestinationBase.getThis(data);
    const charProps = thisDest.characterFormatting;
    charProps.setUseValue(CharacterPropertiesMask.UseAll, false);
    return new StyleRunPropertiesDestination(data, charProps);
})
    .add('tblPr', (data) => {
    const thisDest = StyleDestinationBase.getThis(data);
    const tableProperties = thisDest.tableProperties;
    tableProperties.setUseValue(TablePropertiesMask.UseAll, false);
    return new StyleTablePropertiesDestination(data, new Table(tableProperties, null), tableProperties);
})
    .add('trPr', (data) => {
    const thisDest = StyleDestinationBase.getThis(data);
    const tableRowProperties = thisDest.tableRowProperties;
    tableRowProperties.setUseValue(TableRowPropertiesMask.UseAll, false);
    return new StyleTableRowPropertiesDestination(data, new TableRow(null, tableRowProperties));
})
    .add('tcPr', (data) => {
    const thisDest = StyleDestinationBase.getThis(data);
    const tableCellProperties = thisDest.tableCellProperties;
    tableCellProperties.setUseValue(TableCellPropertiesMask.UseAll, false);
    return new StyleTableCellPropertiesDestination(data, new TableCell(null, tableCellProperties));
})
    .get();
