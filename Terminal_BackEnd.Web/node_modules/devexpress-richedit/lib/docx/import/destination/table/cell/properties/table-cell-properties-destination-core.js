import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TableCellPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-cell-properties';
import { TableCellBordersDestination } from '../../../borders/table-cell-borders-destination';
import { ElementDestination } from '../../../destination';
import { TableCellMarginsDestination } from '../../table/properties/table-cell-margins-destination';
import { WidthUnitNonNegativeDestination } from '../../width-unit-destination';
import { TableCellColumnSpanDestination } from './table-cell-column-span-destination';
import { TableCellConditionalFormattingDestination } from './table-cell-conditional-formatting-destination';
import { TableCellFitTextDestination } from './table-cell-fit-text-destination';
import { TableCellHideMarkDestination } from './table-cell-hide-mark-destination';
import { TableCellNoWrapDestination } from './table-cell-no-wrap-destination';
import { TableCellShadingDestination } from './table-cell-shading-destination';
import { TableCellTextDirectionDestination } from './table-cell-text-direction-destination';
import { TableCellVerticalAlignmentDestination } from './table-cell-vertical-alignment-destination';
import { TableCellVerticalMergingStateDestination } from './table-cell-vertical-merging-state-destination';
export class TableCellPropertiesDestinationCore extends ElementDestination {
    constructor(data, cell) {
        super(data);
        this.cell = cell;
    }
    get elementHandlerTable() {
        return TableCellPropertiesDestinationCore.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
}
TableCellPropertiesDestinationCore.handlerTable = new MapCreator()
    .add('tcW', (data) => new WidthUnitNonNegativeDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell.preferredWidth, () => { }))
    .add('tcBorders', (data) => new TableCellBordersDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('vMerge', (data) => new TableCellVerticalMergingStateDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('gridSpan', (data) => new TableCellColumnSpanDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('shd', (data) => new TableCellShadingDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('tcMar', (data) => new TableCellMarginsDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell.properties, {
    top: TableCellPropertyDescriptor.topMargin,
    right: TableCellPropertyDescriptor.rightMargin,
    bottom: TableCellPropertyDescriptor.bottomMargin,
    left: TableCellPropertyDescriptor.leftMargin
}))
    .add('tcFitText', (data) => new TableCellFitTextDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('noWrap', (data) => new TableCellNoWrapDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('hideMark', (data) => new TableCellHideMarkDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('textDirection', (data) => new TableCellTextDirectionDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('vAlign', (data) => new TableCellVerticalAlignmentDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .add('cnfStyle', (data) => new TableCellConditionalFormattingDestination(data, TableCellPropertiesDestinationCore.getThis(data).cell))
    .get();
