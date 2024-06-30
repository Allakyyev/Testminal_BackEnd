import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TableRowPropertiesMask } from '../../../../../../core/model/tables/properties/table-row-properties';
import { TableRowPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-row-property-descriptor';
import { ElementDestination } from '../../../destination';
import { PropertyDestination } from '../../../property-destination';
import { HeightUnitDestination } from '../../height-unit-destination';
import { WidthUnitDestination, WidthUnitNonNegativeDestination } from '../../width-unit-destination';
import { TableRowAlignmentDestination } from './table-row-alignment-destination';
import { TableRowCantSplitDestination } from './table-row-cant-split-destination';
import { TableRowConditionalFormattingDestination } from './table-row-conditional-formatting-destination';
import { TableRowGridAfterDestination } from './table-row-grid-after-destination';
import { TableRowGridBeforeDestination } from './table-row-grid-before-destination';
import { TableRowHeaderDestination } from './table-row-header-destination';
import { TableRowHideCellMarkDestination } from './table-row-hide-cell-mark-destination';
export class TableRowPropertiesDestination extends ElementDestination {
    constructor(data, row) {
        super(data);
        this.row = row;
    }
    get elementHandlerTable() {
        return TableRowPropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
TableRowPropertiesDestination.handlerTable = new MapCreator()
    .add('cantSplit', (data) => new TableRowCantSplitDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('gridAfter', (data) => new TableRowGridAfterDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('gridBefore', (data) => new TableRowGridBeforeDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('hidden', (data) => new TableRowHideCellMarkDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('jc', (data) => new TableRowAlignmentDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('tblCellSpacing', (data) => {
    const props = TableRowPropertiesDestination.getThis(data).row.properties;
    return new WidthUnitNonNegativeDestination(data, props.cellSpacing, () => props.setUseValue(TableRowPropertiesMask.UseCellSpacing, true));
})
    .add('tblHeader', (data) => new TableRowHeaderDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('trHeight', (data) => new HeightUnitDestination(data, TableRowPropertiesDestination.getThis(data).row.height))
    .add('wBefore', (data) => new WidthUnitDestination(data, TableRowPropertiesDestination.getThis(data).row.widthBefore, () => { }))
    .add('wAfter', (data) => new WidthUnitDestination(data, TableRowPropertiesDestination.getThis(data).row.widthAfter, () => { }))
    .add('cnfStyle', (data) => new TableRowConditionalFormattingDestination(data, TableRowPropertiesDestination.getThis(data).row))
    .add('divId', (data) => new PropertyDestination(data, (value) => {
    const valueAsInt = parseInt(value, 10);
    const webSettings = data.documentModel.webSettings;
    if (webSettings.id == valueAsInt && webSettings.isBodyMarginsSet())
        TableRowPropertiesDestination.getThis(data).row.properties.setValue(TableRowPropertyDescriptor.divId, valueAsInt);
}))
    .get();
