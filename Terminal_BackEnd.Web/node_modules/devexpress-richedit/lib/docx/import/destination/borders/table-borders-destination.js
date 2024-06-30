import { MapCreator } from '../../../../base-utils/map-creator';
import { TablePropertyDescriptor } from '../../../../core/model/tables/properties/table-properties';
import { TablePropertiesLeafElementDestination } from '../table/table/properties/table-properties-leaf-element-destination';
import { TableBorderElementDestination } from './table-border-element-destination';
export class TableBordersDestination extends TablePropertiesLeafElementDestination {
    static getProps(data) {
        return data.destinationStack.getThis().tableProperties;
    }
    get elementHandlerTable() {
        return TableBordersDestination.handlerTable;
    }
}
TableBordersDestination.handlerTable = new MapCreator()
    .add('top', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.topBorder))
    .add('left', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.leftBorder))
    .add('start', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.leftBorder))
    .add('bottom', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.bottomBorder))
    .add('right', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.rightBorder))
    .add('end', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.rightBorder))
    .add('insideH', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.insideHorizontalBorder))
    .add('insideV', (data) => new TableBorderElementDestination(data, TableBordersDestination.getProps(data), TablePropertyDescriptor.insideVerticalBorder))
    .get();
