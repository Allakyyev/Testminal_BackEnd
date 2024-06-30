import { TableProperties, TablePropertiesMask } from '../../../../../core/model/tables/properties/table-properties';
import { TableLayoutType, TableLookTypes } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnit } from '../../../../../core/model/tables/secondary-structures/table-units';
export class RtfTableProperties {
    constructor() {
        this.style = 0;
        this.preferredWidth = TableWidthUnit.createDefault();
        this.lookTypes = TableLookTypes.None;
        this.coreProperties = new TableProperties();
        this.coreProperties.layoutType = TableLayoutType.Fixed;
        this.coreProperties.setUseValue(TablePropertiesMask.UseTableLayout, true);
    }
    get halfSpace() { return this._halfSpace; }
    set halfSpace(value) {
        this._halfSpace = value;
        this.useHalfSpace = true;
    }
    isChanged() {
        return this.useHalfSpace ||
            (this.coreProperties.layoutType == TableLayoutType.Autofit) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseLeftMargin) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseRightMargin) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseTopMargin) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseBottomMargin) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseCellSpacing) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseIsTableOverlap) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseTableIndent) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseTableStyleColBandSize) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseTableStyleRowBandSize) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseBottomBorder) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseInsideHorizontalBorder) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseInsideVerticalBorder) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseLeftBorder) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseRightBorder) ||
            this.coreProperties.getUseValue(TablePropertiesMask.UseTopBorder);
    }
    copyFrom(obj) {
        this.coreProperties.copyFrom(obj.coreProperties);
        this._halfSpace = obj._halfSpace;
        this.useHalfSpace = obj.useHalfSpace;
        this.rightToLeft = obj.rightToLeft;
        this.style = obj.style;
        this.preferredWidth = obj.preferredWidth;
        this.lookTypes = obj.lookTypes;
    }
    apply(table) {
        table.lookTypes = this.lookTypes;
        table.preferredWidth = this.preferredWidth;
    }
}
