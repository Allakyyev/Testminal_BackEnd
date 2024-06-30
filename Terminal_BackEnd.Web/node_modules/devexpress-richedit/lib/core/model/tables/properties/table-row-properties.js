import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { TableRowAlignment } from '../secondary-structures/table-base-structures';
import { TableWidthUnit } from '../secondary-structures/table-units';
export class TableRowProperties {
    constructor() {
        this.mask = 0;
        this.cellSpacing = TableWidthUnit.createDefault();
        this.cantSplit = false;
        this.hideCellMark = false;
        this.header = false;
        this.tableRowAlignment = TableRowAlignment.Left;
        this.divId = 0;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.mask ^
            MathUtils.somePrimes[1] * this.cellSpacing.getHashCode();
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.mask == obj.mask &&
            this.cellSpacing.equals(obj.cellSpacing) &&
            this.cantSplit == obj.cantSplit &&
            this.hideCellMark == obj.hideCellMark &&
            this.header == obj.header &&
            this.tableRowAlignment == obj.tableRowAlignment &&
            this.divId == obj.divId;
    }
    clone() {
        var result = new TableRowProperties();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.mask = obj.mask;
        this.cellSpacing = obj.cellSpacing.clone();
        this.cantSplit = obj.cantSplit;
        this.hideCellMark = obj.hideCellMark;
        this.header = obj.header;
        this.tableRowAlignment = obj.tableRowAlignment;
        this.divId = obj.divId;
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
export var TableRowPropertiesMask;
(function (TableRowPropertiesMask) {
    TableRowPropertiesMask[TableRowPropertiesMask["UseNone"] = 0] = "UseNone";
    TableRowPropertiesMask[TableRowPropertiesMask["UseCantSplit"] = 2] = "UseCantSplit";
    TableRowPropertiesMask[TableRowPropertiesMask["UseHideCellMark"] = 4] = "UseHideCellMark";
    TableRowPropertiesMask[TableRowPropertiesMask["UseCellSpacing"] = 128] = "UseCellSpacing";
    TableRowPropertiesMask[TableRowPropertiesMask["UseTableRowAlignment"] = 256] = "UseTableRowAlignment";
    TableRowPropertiesMask[TableRowPropertiesMask["UseShadingInfoIndex"] = 2048] = "UseShadingInfoIndex";
    TableRowPropertiesMask[TableRowPropertiesMask["UseHeader"] = 1024] = "UseHeader";
    TableRowPropertiesMask[TableRowPropertiesMask["UseDivId"] = 4096] = "UseDivId";
    TableRowPropertiesMask[TableRowPropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(TableRowPropertiesMask || (TableRowPropertiesMask = {}));
