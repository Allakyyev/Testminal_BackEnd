import { MapCreator } from '../../../../base-utils/map-creator';
import { TableCellPropertyDescriptor } from '../../../../core/model/tables/properties/table-cell-properties';
import { TableCellPropertiesElementBaseDestination } from '../table/cell/properties/table-cell-properties-element-base-destination';
import { TableCellBorderElementDestination } from './table-cell-border-element-destination';
export class TableCellBordersDestination extends TableCellPropertiesElementBaseDestination {
    static getProps(data) {
        return data.destinationStack.getThis().cell.properties;
    }
    get elementHandlerTable() {
        return TableCellBordersDestination.handlerTable;
    }
}
TableCellBordersDestination.handlerTable = new MapCreator()
    .add('top', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.topBorder))
    .add('left', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.leftBorder))
    .add('start', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.leftBorder))
    .add('bottom', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.bottomBorder))
    .add('right', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.rightBorder))
    .add('end', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.rightBorder))
    .add('insideH', (_data) => null)
    .add('insideV', (_data) => null)
    .add('tl2br', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.topLeftDiagonalBorder))
    .add('tr2bl', (data) => new TableCellBorderElementDestination(data, TableCellBordersDestination.getProps(data), TableCellPropertyDescriptor.topRightDiagonalBorder))
    .get();
