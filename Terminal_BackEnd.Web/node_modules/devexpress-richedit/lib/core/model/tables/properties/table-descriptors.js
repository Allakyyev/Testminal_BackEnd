import { TablePropertiesMask } from './table-properties';
export class TablePropertiesAvoidDoubleBordersDescriptor {
    setProp(props, newValue) {
        props.avoidDoubleBorders = newValue;
    }
    getProp(props) {
        return props.avoidDoubleBorders;
    }
    maskValue() {
        return TablePropertiesMask.UseAvoidDoubleBorders;
    }
}
export class TablePropertiesTopBorderDescriptor {
    setProp(props, newValue) {
        props.borders.topBorder = newValue;
    }
    getProp(props) {
        return props.borders.topBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseTopBorder;
    }
}
export class TablePropertiesRightBorderDescriptor {
    setProp(props, newValue) {
        props.borders.rightBorder = newValue;
    }
    getProp(props) {
        return props.borders.rightBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseRightBorder;
    }
}
export class TablePropertiesBottomBorderDescriptor {
    setProp(props, newValue) {
        props.borders.bottomBorder = newValue;
    }
    getProp(props) {
        return props.borders.bottomBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseBottomBorder;
    }
}
export class TablePropertiesLeftBorderDescriptor {
    setProp(props, newValue) {
        props.borders.leftBorder = newValue;
    }
    getProp(props) {
        return props.borders.leftBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseLeftBorder;
    }
}
export class TablePropertiesInsideHorizontalBorderDescriptor {
    setProp(props, newValue) {
        props.borders.insideHorizontalBorder = newValue;
    }
    getProp(props) {
        return props.borders.insideHorizontalBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseInsideHorizontalBorder;
    }
}
export class TablePropertiesInsideVerticalBorderDescriptor {
    setProp(props, newValue) {
        props.borders.insideVerticalBorder = newValue;
    }
    getProp(props) {
        return props.borders.insideVerticalBorder;
    }
    maskValue() {
        return TablePropertiesMask.UseInsideVerticalBorder;
    }
}
export class TablePropertiesTopMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.top = newValue;
    }
    getProp(props) {
        return props.cellMargins.top;
    }
    maskValue() {
        return TablePropertiesMask.UseTopMargin;
    }
}
export class TablePropertiesRightMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.right = newValue;
    }
    getProp(props) {
        return props.cellMargins.right;
    }
    maskValue() {
        return TablePropertiesMask.UseRightMargin;
    }
}
export class TablePropertiesBottomMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.bottom = newValue;
    }
    getProp(props) {
        return props.cellMargins.bottom;
    }
    maskValue() {
        return TablePropertiesMask.UseBottomMargin;
    }
}
export class TablePropertiesLeftMarginDescriptor {
    setProp(props, newValue) {
        props.cellMargins.left = newValue;
    }
    getProp(props) {
        return props.cellMargins.left;
    }
    maskValue() {
        return TablePropertiesMask.UseLeftMargin;
    }
}
export class TablePropertiesCellSpacingDescriptor {
    setProp(props, newValue) {
        props.cellSpacing = newValue;
    }
    getProp(props) {
        return props.cellSpacing;
    }
    maskValue() {
        return TablePropertiesMask.UseCellSpacing;
    }
}
export class TablePropertiesIndentDescriptor {
    setProp(props, newValue) {
        props.indent = newValue;
    }
    getProp(props) {
        return props.indent;
    }
    maskValue() {
        return TablePropertiesMask.UseTableIndent;
    }
}
export class TablePropertiesLayoutTypeDescriptor {
    setProp(props, newValue) {
        props.layoutType = newValue;
    }
    getProp(props) {
        return props.layoutType;
    }
    maskValue() {
        return TablePropertiesMask.UseTableLayout;
    }
}
export class TablePropertiesShadingInfoDescriptor {
    setProp(props, newValue) {
        props.shadingInfo = newValue;
    }
    getProp(props) {
        return props.shadingInfo;
    }
    maskValue() {
        return TablePropertiesMask.UseShadingInfoIndex;
    }
}
export class TablePropertiesRowAlignmentDescriptor {
    setProp(props, newValue) {
        props.tableRowAlignment = newValue;
    }
    getProp(props) {
        return props.tableRowAlignment;
    }
    maskValue() {
        return TablePropertiesMask.UseTableAlignment;
    }
}
export class TablePropertiesStyleColumnBandSizeDescriptor {
    setProp(props, newValue) {
        props.tableStyleColumnBandSize = newValue;
    }
    getProp(props) {
        return props.tableStyleColumnBandSize;
    }
    maskValue() {
        return TablePropertiesMask.UseTableStyleColBandSize;
    }
}
export class TablePropertiesStyleRowBandSizeDescriptor {
    setProp(props, newValue) {
        props.tableStyleRowBandSize = newValue;
    }
    getProp(props) {
        return props.tableStyleRowBandSize;
    }
    maskValue() {
        return TablePropertiesMask.UseTableStyleRowBandSize;
    }
}
