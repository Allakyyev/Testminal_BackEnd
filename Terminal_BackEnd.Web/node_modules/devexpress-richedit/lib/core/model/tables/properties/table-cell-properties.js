import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { BorderInfo } from '../../borders/border-info';
import { TableCellBorders } from '../../borders/table-cell-borders';
import { ShadingInfo } from '../../shadings/shading-info';
import { TableCellMargins, TableCellVerticalAlignment, TextDirection } from '../secondary-structures/table-base-structures';
import { TableWidthUnit } from '../secondary-structures/table-units';
import { TableCellPropertiesBottomBorderDescriptor, TableCellPropertiesBottomMarginDescriptor, TableCellPropertiesFitTextDescriptor, TableCellPropertiesHideCellMarkDescriptor, TableCellPropertiesLeftBorderDescriptor, TableCellPropertiesLeftMarginDescriptor, TableCellPropertiesNoWrapDescriptor, TableCellPropertiesRightBorderDescriptor, TableCellPropertiesRightMarginDescriptor, TableCellPropertiesShadingInfoDescriptor, TableCellPropertiesTextDirectionDescriptor, TableCellPropertiesTopBorderDescriptor, TableCellPropertiesTopLeftDiagonalBorderDescriptor, TableCellPropertiesTopMarginDescriptor, TableCellPropertiesTopRightDiagonalBorderDescriptor, TableCellPropertiesVerticalAlignmentDescriptor } from './table-cell-descriptors';
export class TableCellProperties {
    constructor() {
        this.mask = TableCellPropertiesMask.UseNone;
        this.cellMargins = TableCellMargins.create(TableWidthUnit.createDefault(), TableWidthUnit.createDefault(), TableWidthUnit.createDefault(), TableWidthUnit.createDefault());
        this.borders = TableCellBorders.create(new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo(), new BorderInfo());
        this.hideCellMark = false;
        this.noWrap = false;
        this.fitText = false;
        this.textDirection = TextDirection.LeftToRightTopToBottom;
        this.verticalAlignment = TableCellVerticalAlignment.Top;
        this.shadingInfo = ShadingInfo.noColor;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.mask ^
            MathUtils.somePrimes[1] * this.borders.getHashCode() ^
            MathUtils.somePrimes[2] * this.verticalAlignment ^
            MathUtils.somePrimes[3] * this.shadingInfo.getHashCode();
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.mask == obj.mask &&
            this.cellMargins.equals(obj.cellMargins) &&
            this.borders.equals(obj.borders) &&
            this.hideCellMark == obj.hideCellMark &&
            this.noWrap == obj.noWrap &&
            this.fitText == obj.fitText &&
            this.textDirection == obj.textDirection &&
            this.verticalAlignment == obj.verticalAlignment &&
            this.shadingInfo.equals(obj.shadingInfo);
    }
    clone() {
        var result = new TableCellProperties();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.mask = obj.mask;
        this.cellMargins = obj.cellMargins.clone();
        this.borders = obj.borders.clone();
        this.hideCellMark = obj.hideCellMark;
        this.noWrap = obj.noWrap;
        this.fitText = obj.fitText;
        this.textDirection = obj.textDirection;
        this.verticalAlignment = obj.verticalAlignment;
        if (obj.shadingInfo)
            this.shadingInfo = obj.shadingInfo.clone();
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
export var TableCellPropertiesMask;
(function (TableCellPropertiesMask) {
    TableCellPropertiesMask[TableCellPropertiesMask["UseNone"] = 0] = "UseNone";
    TableCellPropertiesMask[TableCellPropertiesMask["UseHideCellMark"] = 2] = "UseHideCellMark";
    TableCellPropertiesMask[TableCellPropertiesMask["UseNoWrap"] = 4] = "UseNoWrap";
    TableCellPropertiesMask[TableCellPropertiesMask["UseFitText"] = 8] = "UseFitText";
    TableCellPropertiesMask[TableCellPropertiesMask["UseLeftMargin"] = 16] = "UseLeftMargin";
    TableCellPropertiesMask[TableCellPropertiesMask["UseRightMargin"] = 32] = "UseRightMargin";
    TableCellPropertiesMask[TableCellPropertiesMask["UseTopMargin"] = 64] = "UseTopMargin";
    TableCellPropertiesMask[TableCellPropertiesMask["UseBottomMargin"] = 128] = "UseBottomMargin";
    TableCellPropertiesMask[TableCellPropertiesMask["UseTextDirection"] = 256] = "UseTextDirection";
    TableCellPropertiesMask[TableCellPropertiesMask["UseVerticalAlignment"] = 512] = "UseVerticalAlignment";
    TableCellPropertiesMask[TableCellPropertiesMask["UseCellConditionalFormatting"] = 2048] = "UseCellConditionalFormatting";
    TableCellPropertiesMask[TableCellPropertiesMask["UseLeftBorder"] = 4096] = "UseLeftBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseRightBorder"] = 8192] = "UseRightBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseTopBorder"] = 16384] = "UseTopBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseBottomBorder"] = 32768] = "UseBottomBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseTopLeftDiagonalBorder"] = 262144] = "UseTopLeftDiagonalBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseTopRightDiagonalBorder"] = 524288] = "UseTopRightDiagonalBorder";
    TableCellPropertiesMask[TableCellPropertiesMask["UseShadingInfoIndex"] = 1048576] = "UseShadingInfoIndex";
    TableCellPropertiesMask[TableCellPropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(TableCellPropertiesMask || (TableCellPropertiesMask = {}));
export class TableCellPropertyDescriptor {
}
TableCellPropertyDescriptor.topBorder = new TableCellPropertiesTopBorderDescriptor();
TableCellPropertyDescriptor.rightBorder = new TableCellPropertiesRightBorderDescriptor();
TableCellPropertyDescriptor.bottomBorder = new TableCellPropertiesBottomBorderDescriptor();
TableCellPropertyDescriptor.leftBorder = new TableCellPropertiesLeftBorderDescriptor();
TableCellPropertyDescriptor.topLeftDiagonalBorder = new TableCellPropertiesTopLeftDiagonalBorderDescriptor();
TableCellPropertyDescriptor.topRightDiagonalBorder = new TableCellPropertiesTopRightDiagonalBorderDescriptor();
TableCellPropertyDescriptor.topMargin = new TableCellPropertiesTopMarginDescriptor();
TableCellPropertyDescriptor.rightMargin = new TableCellPropertiesRightMarginDescriptor();
TableCellPropertyDescriptor.bottomMargin = new TableCellPropertiesBottomMarginDescriptor();
TableCellPropertyDescriptor.leftMargin = new TableCellPropertiesLeftMarginDescriptor();
TableCellPropertyDescriptor.fitText = new TableCellPropertiesFitTextDescriptor();
TableCellPropertyDescriptor.hideCellMark = new TableCellPropertiesHideCellMarkDescriptor();
TableCellPropertyDescriptor.noWrap = new TableCellPropertiesNoWrapDescriptor();
TableCellPropertyDescriptor.shadingInfo = new TableCellPropertiesShadingInfoDescriptor();
TableCellPropertyDescriptor.textDirection = new TableCellPropertiesTextDirectionDescriptor();
TableCellPropertyDescriptor.vertivalAlignment = new TableCellPropertiesVerticalAlignmentDescriptor();
TableCellPropertyDescriptor.ALL_FIELDS = [
    TableCellPropertyDescriptor.topBorder,
    TableCellPropertyDescriptor.rightBorder,
    TableCellPropertyDescriptor.bottomBorder,
    TableCellPropertyDescriptor.leftBorder,
    TableCellPropertyDescriptor.topLeftDiagonalBorder,
    TableCellPropertyDescriptor.topRightDiagonalBorder,
    TableCellPropertyDescriptor.topMargin,
    TableCellPropertyDescriptor.rightMargin,
    TableCellPropertyDescriptor.bottomMargin,
    TableCellPropertyDescriptor.leftMargin,
    TableCellPropertyDescriptor.fitText,
    TableCellPropertyDescriptor.hideCellMark,
    TableCellPropertyDescriptor.noWrap,
    TableCellPropertyDescriptor.shadingInfo,
    TableCellPropertyDescriptor.textDirection,
    TableCellPropertyDescriptor.vertivalAlignment,
];
