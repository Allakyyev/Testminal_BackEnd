import { TableCellPropertiesMask } from './table-cell-properties';
export class TableCellPropertiesTopBorderDescriptor {
    setProp(props, newValue) {
        props.borders.topBorder = newValue;
    }
    getProp(props) {
        return props.borders.topBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseTopBorder;
    }
}
export class TableCellPropertiesRightBorderDescriptor {
    setProp(props, newValue) {
        props.borders.rightBorder = newValue;
    }
    getProp(props) {
        return props.borders.rightBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseRightBorder;
    }
}
export class TableCellPropertiesBottomBorderDescriptor {
    setProp(props, newValue) {
        props.borders.bottomBorder = newValue;
    }
    getProp(props) {
        return props.borders.bottomBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseBottomBorder;
    }
}
export class TableCellPropertiesLeftBorderDescriptor {
    setProp(props, newValue) {
        props.borders.leftBorder = newValue;
    }
    getProp(props) {
        return props.borders.leftBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseLeftBorder;
    }
}
export class TableCellPropertiesTopLeftDiagonalBorderDescriptor {
    setProp(props, newValue) {
        props.borders.topLeftDiagonalBorder = newValue;
    }
    getProp(props) {
        return props.borders.topLeftDiagonalBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseTopLeftDiagonalBorder;
    }
}
export class TableCellPropertiesTopRightDiagonalBorderDescriptor {
    setProp(props, newValue) {
        props.borders.topRightDiagonalBorder = newValue;
    }
    getProp(props) {
        return props.borders.topRightDiagonalBorder;
    }
    maskValue() {
        return TableCellPropertiesMask.UseTopRightDiagonalBorder;
    }
}
export class TableCellPropertiesTopMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.top = newValue;
    }
    getProp(props) {
        return props.cellMargins.top;
    }
    maskValue() {
        return TableCellPropertiesMask.UseTopMargin;
    }
}
export class TableCellPropertiesRightMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.right = newValue;
    }
    getProp(props) {
        return props.cellMargins.right;
    }
    maskValue() {
        return TableCellPropertiesMask.UseRightMargin;
    }
}
export class TableCellPropertiesBottomMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.bottom = newValue;
    }
    getProp(props) {
        return props.cellMargins.bottom;
    }
    maskValue() {
        return TableCellPropertiesMask.UseBottomMargin;
    }
}
export class TableCellPropertiesLeftMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.left = newValue;
    }
    getProp(props) {
        return props.cellMargins.left;
    }
    maskValue() {
        return TableCellPropertiesMask.UseLeftMargin;
    }
}
export class TableCellPropertiesFitTextDescriptor {
    setProp(props, newValue) {
        props.fitText = newValue;
    }
    getProp(props) {
        return props.fitText;
    }
    maskValue() {
        return TableCellPropertiesMask.UseFitText;
    }
}
export class TableCellPropertiesHideCellMarkDescriptor {
    setProp(props, newValue) {
        props.hideCellMark = newValue;
    }
    getProp(props) {
        return props.hideCellMark;
    }
    maskValue() {
        return TableCellPropertiesMask.UseHideCellMark;
    }
}
export class TableCellPropertiesNoWrapDescriptor {
    setProp(props, newValue) {
        props.noWrap = newValue;
    }
    getProp(props) {
        return props.noWrap;
    }
    maskValue() {
        return TableCellPropertiesMask.UseNoWrap;
    }
}
export class TableCellPropertiesShadingInfoDescriptor {
    setProp(props, newValue) {
        props.shadingInfo = newValue;
    }
    getProp(props) {
        return props.shadingInfo;
    }
    maskValue() {
        return TableCellPropertiesMask.UseShadingInfoIndex;
    }
}
export class TableCellPropertiesTextDirectionDescriptor {
    setProp(props, newValue) {
        props.textDirection = newValue;
    }
    getProp(props) {
        return props.textDirection;
    }
    maskValue() {
        return TableCellPropertiesMask.UseTextDirection;
    }
}
export class TableCellPropertiesVerticalAlignmentDescriptor {
    setProp(props, newValue) {
        props.verticalAlignment = newValue;
    }
    getProp(props) {
        return props.verticalAlignment;
    }
    maskValue() {
        return TableCellPropertiesMask.UseVerticalAlignment;
    }
}
