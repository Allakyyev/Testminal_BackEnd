import { TableRowPropertiesMask } from './table-row-properties';
export class TableRowPropertiesCantSplitDescriptor {
    setProp(props, newValue) {
        props.cantSplit = newValue;
    }
    getProp(props) {
        return props.cantSplit;
    }
    maskValue() {
        return TableRowPropertiesMask.UseCantSplit;
    }
}
export class TableRowPropertiesCellSpacingDescriptor {
    setProp(props, newValue) {
        props.cellSpacing = newValue;
    }
    getProp(props) {
        return props.cellSpacing;
    }
    maskValue() {
        return TableRowPropertiesMask.UseCellSpacing;
    }
}
export class TableRowPropertiesDivIdDescriptor {
    setProp(props, newValue) {
        props.divId = newValue;
    }
    getProp(props) {
        return props.divId;
    }
    maskValue() {
        return TableRowPropertiesMask.UseDivId;
    }
}
export class TableRowPropertiesHeaderDescriptor {
    setProp(props, newValue) {
        props.header = newValue;
    }
    getProp(props) {
        return props.header;
    }
    maskValue() {
        return TableRowPropertiesMask.UseHeader;
    }
}
export class TableRowPropertiesHideCellMarkDescriptor {
    setProp(props, newValue) {
        props.hideCellMark = newValue;
    }
    getProp(props) {
        return props.hideCellMark;
    }
    maskValue() {
        return TableRowPropertiesMask.UseHideCellMark;
    }
}
export class TableRowPropertiesRowAlignmentDescriptor {
    setProp(props, newValue) {
        props.tableRowAlignment = newValue;
    }
    getProp(props) {
        return props.tableRowAlignment;
    }
    maskValue() {
        return TableRowPropertiesMask.UseTableRowAlignment;
    }
}
