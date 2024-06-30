import { MapCreator } from '../../../../../../base-utils/map-creator';
import { TablePropertiesMask, TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { TableBordersDestination } from '../../../borders/table-borders-destination';
import { WidthUnitDestination, WidthUnitNonNegativeDestination } from '../../width-unit-destination';
import { TableAlignmentDestination } from './table-alignment-destination';
import { TableAvoidDoubleBordersDestination } from './table-avoid-double-borders-destination';
import { TableCellMarginsDestination } from './table-cell-margins-destination';
import { TableLayoutDestination } from './table-layout-destination';
import { TableLookDestination } from './table-look-destination';
import { TableOverlapDestination } from './table-overlap-destination';
import { TablePropertiesBaseDestination } from './table-properties-base-destination';
import { TableRightToLeftDestination } from './table-right-to-left-destination';
import { TableStyleColBandSizeDestination } from './table-style-col-band-size-destination';
import { TableStyleRowBandSizeDestination } from './table-style-row-band-size-destination';
import { TableStyleShadingDestination } from './table-style-shading-destination';
export class TablePropertiesDestinationCore extends TablePropertiesBaseDestination {
    constructor(data, table, tableProperties) {
        super(data, tableProperties);
        this.table = table;
        this.tableProperties = tableProperties;
    }
    get elementHandlerTable() {
        return TablePropertiesDestinationCore.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static getProperties(data) {
        return TablePropertiesDestinationCore.getThis(data).tableProperties;
    }
}
TablePropertiesDestinationCore.handlerTable = new MapCreator()
    .add('tblW', (data) => new WidthUnitNonNegativeDestination(data, TablePropertiesDestinationCore.getThis(data).table.preferredWidth, () => { }))
    .add('tblpPr', (_data) => null)
    .add('tblInd', (data) => {
    const props = TablePropertiesDestinationCore.getProperties(data);
    return new WidthUnitDestination(data, props.indent, () => {
        props.setUseValue(TablePropertiesMask.UseTableIndent, true);
    });
})
    .add('tblLook', (data) => new TableLookDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('tblBorders', (data) => new TableBordersDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getThis(data).properties))
    .add('tblCellMar', (data) => new TableCellMarginsDestination(data, TablePropertiesDestinationCore.getProperties(data), {
    top: TablePropertyDescriptor.topMargin,
    right: TablePropertyDescriptor.rightMargin,
    bottom: TablePropertyDescriptor.bottomMargin,
    left: TablePropertyDescriptor.leftMargin
}))
    .add('tblCellSpacing', (data) => {
    const props = TablePropertiesDestinationCore.getProperties(data);
    return new WidthUnitNonNegativeDestination(data, props.cellSpacing, () => props.setUseValue(TablePropertiesMask.UseCellSpacing, true));
})
    .add('tblLayout', (data) => new TableLayoutDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('tblOverlap', (data) => new TableOverlapDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('tblStyleColBandSize', (data) => new TableStyleColBandSizeDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('tblStyleRowBandSize', (data) => new TableStyleRowBandSizeDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('shd', (data) => new TableStyleShadingDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('jc', (data) => new TableAlignmentDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('adb', (data) => new TableAvoidDoubleBordersDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .add('bidiVisual', (data) => new TableRightToLeftDestination(data, TablePropertiesDestinationCore.getThis(data).table, TablePropertiesDestinationCore.getProperties(data)))
    .get();
