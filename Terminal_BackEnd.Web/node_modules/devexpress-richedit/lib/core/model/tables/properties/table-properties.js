import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { BorderInfo } from '../../borders/border-info';
import { TableBorders } from '../../borders/table-borders';
import { ShadingInfo } from '../../shadings/shading-info';
import { HorizontalAlignMode, HorizontalAnchorTypes, TableCellMargins, TableLayoutType, TableRowAlignment, TextWrapping, VerticalAlignMode, VerticalAnchorTypes } from '../secondary-structures/table-base-structures';
import { TableWidthUnit } from '../secondary-structures/table-units';
import { TablePropertiesAvoidDoubleBordersDescriptor, TablePropertiesBottomBorderDescriptor, TablePropertiesBottomMarginDescriptor, TablePropertiesCellSpacingDescriptor, TablePropertiesIndentDescriptor, TablePropertiesInsideHorizontalBorderDescriptor, TablePropertiesInsideVerticalBorderDescriptor, TablePropertiesLayoutTypeDescriptor, TablePropertiesLeftBorderDescriptor, TablePropertiesLeftMarginDescriptor, TablePropertiesRightBorderDescriptor, TablePropertiesRightMarginDescriptor, TablePropertiesRowAlignmentDescriptor, TablePropertiesShadingInfoDescriptor, TablePropertiesStyleColumnBandSizeDescriptor, TablePropertiesStyleRowBandSizeDescriptor, TablePropertiesTopBorderDescriptor, TablePropertiesTopMarginDescriptor } from './table-descriptors';
export class TableProperties {
    constructor() {
        this.mask = 0;
        this.cellMargins = TableCellMargins.create(TableWidthUnit.createDefault(), TableWidthUnit.createDefault(), TableWidthUnit.createDefault(), TableWidthUnit.createDefault());
        this.cellSpacing = TableWidthUnit.createDefault();
        this.indent = TableWidthUnit.createDefault();
        this.borders = TableBorders.create(new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo());
        this.tableStyleColumnBandSize = 1;
        this.tableStyleRowBandSize = 1;
        this.avoidDoubleBorders = false;
        this.layoutType = TableLayoutType.Autofit;
        this.shadingInfo = ShadingInfo.noColor;
        this.tableRowAlignment = TableRowAlignment.Left;
        this.isTableOverlap = true;
        this.bottomFromText = 0;
        this.leftFromText = 0;
        this.topFromText = 0;
        this.rightFromText = 0;
        this.tableHorizontalPosition = 0;
        this.tableVerticalPosition = 0;
        this.horizontalAlignMode = HorizontalAlignMode.None;
        this.verticalAlignMode = VerticalAlignMode.None;
        this.horizontalAnchorType = HorizontalAnchorTypes.Page;
        this.verticalAnchorType = VerticalAnchorTypes.Page;
        this.textWrapping = TextWrapping.Never;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.mask ^
            MathUtils.somePrimes[1] * this.borders.getHashCode() ^
            MathUtils.somePrimes[2] * this.indent.getHashCode() ^
            MathUtils.somePrimes[3] * this.tableRowAlignment ^
            MathUtils.somePrimes[4] * this.shadingInfo.getHashCode();
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.mask == obj.mask &&
            this.cellMargins.equals(obj.cellMargins) &&
            this.cellSpacing.equals(obj.cellSpacing) &&
            this.indent.equals(obj.indent) &&
            this.borders.equals(obj.borders) &&
            this.tableStyleColumnBandSize == obj.tableStyleColumnBandSize &&
            this.tableStyleRowBandSize == obj.tableStyleRowBandSize &&
            this.isTableOverlap == obj.isTableOverlap &&
            this.avoidDoubleBorders == obj.avoidDoubleBorders &&
            this.layoutType == obj.layoutType &&
            this.shadingInfo.equals(obj.shadingInfo) &&
            this.tableRowAlignment == obj.tableRowAlignment &&
            this.bottomFromText == obj.bottomFromText &&
            this.leftFromText == obj.leftFromText &&
            this.topFromText == obj.topFromText &&
            this.rightFromText == obj.rightFromText &&
            this.tableHorizontalPosition == obj.tableHorizontalPosition &&
            this.tableVerticalPosition == obj.tableVerticalPosition &&
            this.horizontalAlignMode == obj.horizontalAlignMode &&
            this.verticalAlignMode == obj.verticalAlignMode &&
            this.horizontalAnchorType == obj.horizontalAnchorType &&
            this.verticalAnchorType == obj.verticalAnchorType &&
            this.textWrapping == obj.textWrapping;
    }
    clone() {
        var result = new TableProperties();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.mask = obj.mask;
        this.cellMargins = obj.cellMargins.clone();
        this.cellSpacing = obj.cellSpacing.clone();
        this.indent = obj.indent.clone();
        this.borders = obj.borders.clone();
        this.tableStyleColumnBandSize = obj.tableStyleColumnBandSize;
        this.tableStyleRowBandSize = obj.tableStyleRowBandSize;
        this.isTableOverlap = obj.isTableOverlap;
        this.avoidDoubleBorders = obj.avoidDoubleBorders;
        this.layoutType = obj.layoutType;
        if (obj.shadingInfo)
            this.shadingInfo = obj.shadingInfo.clone();
        this.tableRowAlignment = obj.tableRowAlignment;
        this.bottomFromText = obj.bottomFromText;
        this.leftFromText = obj.leftFromText;
        this.topFromText = obj.topFromText;
        this.rightFromText = obj.rightFromText;
        this.tableHorizontalPosition = obj.tableHorizontalPosition;
        this.tableVerticalPosition = obj.tableVerticalPosition;
        this.horizontalAlignMode = obj.horizontalAlignMode;
        this.verticalAlignMode = obj.verticalAlignMode;
        this.horizontalAnchorType = obj.horizontalAnchorType;
        this.verticalAnchorType = obj.verticalAnchorType;
        this.textWrapping = obj.textWrapping;
    }
    setUseValue(mask, value) {
        if (value)
            this.mask |= mask;
        else
            this.mask &= ~mask;
    }
    getUseValue(mask) {
        return (this.mask & mask) != 0;
    }
    setValue(desc, value) {
        desc.setProp(this, value);
        this.setUseValue(desc.maskValue(), true);
    }
}
export var TablePropertiesMask;
(function (TablePropertiesMask) {
    TablePropertiesMask[TablePropertiesMask["UseNone"] = 0] = "UseNone";
    TablePropertiesMask[TablePropertiesMask["UseLeftMargin"] = 1] = "UseLeftMargin";
    TablePropertiesMask[TablePropertiesMask["UseRightMargin"] = 2] = "UseRightMargin";
    TablePropertiesMask[TablePropertiesMask["UseTopMargin"] = 4] = "UseTopMargin";
    TablePropertiesMask[TablePropertiesMask["UseBottomMargin"] = 8] = "UseBottomMargin";
    TablePropertiesMask[TablePropertiesMask["UseCellSpacing"] = 16] = "UseCellSpacing";
    TablePropertiesMask[TablePropertiesMask["UseTableIndent"] = 32] = "UseTableIndent";
    TablePropertiesMask[TablePropertiesMask["UseTableLayout"] = 64] = "UseTableLayout";
    TablePropertiesMask[TablePropertiesMask["UseTableStyleColBandSize"] = 512] = "UseTableStyleColBandSize";
    TablePropertiesMask[TablePropertiesMask["UseTableStyleRowBandSize"] = 1024] = "UseTableStyleRowBandSize";
    TablePropertiesMask[TablePropertiesMask["UseIsTableOverlap"] = 2048] = "UseIsTableOverlap";
    TablePropertiesMask[TablePropertiesMask["UseFloatingPosition"] = 4096] = "UseFloatingPosition";
    TablePropertiesMask[TablePropertiesMask["UseLeftBorder"] = 8192] = "UseLeftBorder";
    TablePropertiesMask[TablePropertiesMask["UseRightBorder"] = 16384] = "UseRightBorder";
    TablePropertiesMask[TablePropertiesMask["UseTopBorder"] = 32768] = "UseTopBorder";
    TablePropertiesMask[TablePropertiesMask["UseBottomBorder"] = 65536] = "UseBottomBorder";
    TablePropertiesMask[TablePropertiesMask["UseInsideHorizontalBorder"] = 131072] = "UseInsideHorizontalBorder";
    TablePropertiesMask[TablePropertiesMask["UseInsideVerticalBorder"] = 262144] = "UseInsideVerticalBorder";
    TablePropertiesMask[TablePropertiesMask["UseShadingInfoIndex"] = 524288] = "UseShadingInfoIndex";
    TablePropertiesMask[TablePropertiesMask["UseTableAlignment"] = 1048576] = "UseTableAlignment";
    TablePropertiesMask[TablePropertiesMask["UseAvoidDoubleBorders"] = 2097152] = "UseAvoidDoubleBorders";
    TablePropertiesMask[TablePropertiesMask["UseRightToLeft"] = 4194304] = "UseRightToLeft";
    TablePropertiesMask[TablePropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(TablePropertiesMask || (TablePropertiesMask = {}));
export class TablePropertyDescriptor {
}
TablePropertyDescriptor.avoidDoubleBorders = new TablePropertiesAvoidDoubleBordersDescriptor();
TablePropertyDescriptor.topBorder = new TablePropertiesTopBorderDescriptor();
TablePropertyDescriptor.rightBorder = new TablePropertiesRightBorderDescriptor();
TablePropertyDescriptor.bottomBorder = new TablePropertiesBottomBorderDescriptor();
TablePropertyDescriptor.leftBorder = new TablePropertiesLeftBorderDescriptor();
TablePropertyDescriptor.insideHorizontalBorder = new TablePropertiesInsideHorizontalBorderDescriptor();
TablePropertyDescriptor.insideVerticalBorder = new TablePropertiesInsideVerticalBorderDescriptor();
TablePropertyDescriptor.topMargin = new TablePropertiesTopMarginDescriptor();
TablePropertyDescriptor.rightMargin = new TablePropertiesRightMarginDescriptor();
TablePropertyDescriptor.bottomMargin = new TablePropertiesBottomMarginDescriptor();
TablePropertyDescriptor.leftMargin = new TablePropertiesLeftMarginDescriptor();
TablePropertyDescriptor.cellSpacing = new TablePropertiesCellSpacingDescriptor();
TablePropertyDescriptor.indent = new TablePropertiesIndentDescriptor();
TablePropertyDescriptor.layoutType = new TablePropertiesLayoutTypeDescriptor();
TablePropertyDescriptor.shadingInfo = new TablePropertiesShadingInfoDescriptor();
TablePropertyDescriptor.rowAlignment = new TablePropertiesRowAlignmentDescriptor();
TablePropertyDescriptor.styleColumnBandSize = new TablePropertiesStyleColumnBandSizeDescriptor();
TablePropertyDescriptor.styleRowBandSize = new TablePropertiesStyleRowBandSizeDescriptor();
TablePropertyDescriptor.ALL_FIELDS = [
    TablePropertyDescriptor.avoidDoubleBorders,
    TablePropertyDescriptor.topBorder,
    TablePropertyDescriptor.rightBorder,
    TablePropertyDescriptor.bottomBorder,
    TablePropertyDescriptor.leftBorder,
    TablePropertyDescriptor.insideHorizontalBorder,
    TablePropertyDescriptor.insideVerticalBorder,
    TablePropertyDescriptor.topMargin,
    TablePropertyDescriptor.rightMargin,
    TablePropertyDescriptor.bottomMargin,
    TablePropertyDescriptor.leftMargin,
    TablePropertyDescriptor.cellSpacing,
    TablePropertyDescriptor.indent,
    TablePropertyDescriptor.layoutType,
    TablePropertyDescriptor.shadingInfo,
    TablePropertyDescriptor.rowAlignment,
    TablePropertyDescriptor.styleColumnBandSize,
    TablePropertyDescriptor.styleRowBandSize,
];
