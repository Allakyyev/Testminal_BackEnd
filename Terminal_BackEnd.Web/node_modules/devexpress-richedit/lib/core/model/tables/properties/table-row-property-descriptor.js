import { TableRowPropertiesCantSplitDescriptor, TableRowPropertiesCellSpacingDescriptor, TableRowPropertiesDivIdDescriptor, TableRowPropertiesHeaderDescriptor, TableRowPropertiesHideCellMarkDescriptor, TableRowPropertiesRowAlignmentDescriptor } from './table-row-descriptors';
export class TableRowPropertyDescriptor {
}
TableRowPropertyDescriptor.cantSplit = new TableRowPropertiesCantSplitDescriptor();
TableRowPropertyDescriptor.cellSpacing = new TableRowPropertiesCellSpacingDescriptor();
TableRowPropertyDescriptor.divId = new TableRowPropertiesDivIdDescriptor();
TableRowPropertyDescriptor.header = new TableRowPropertiesHeaderDescriptor();
TableRowPropertyDescriptor.hideCellMark = new TableRowPropertiesHideCellMarkDescriptor();
TableRowPropertyDescriptor.rowAlignment = new TableRowPropertiesRowAlignmentDescriptor();
TableRowPropertyDescriptor.ALL_FIELDS = [
    TableRowPropertyDescriptor.cantSplit,
    TableRowPropertyDescriptor.cellSpacing,
    TableRowPropertyDescriptor.divId,
    TableRowPropertyDescriptor.header,
    TableRowPropertyDescriptor.hideCellMark,
    TableRowPropertyDescriptor.rowAlignment,
];
