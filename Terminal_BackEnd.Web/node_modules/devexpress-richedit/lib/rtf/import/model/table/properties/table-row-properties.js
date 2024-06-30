import { TableRowProperties } from '../../../../../core/model/tables/properties/table-row-properties';
import { TableHeightUnit, TableWidthUnit } from '../../../../../core/model/tables/secondary-structures/table-units';
import { TableFloatingPositionInfo } from './table-floating-position-info';
export class RtfTableRowProperties {
    constructor() {
        this.left = 0;
        this.widthBefore = TableWidthUnit.createDefault();
        this.widthAfter = TableWidthUnit.createDefault();
        this.gridBefore = 0;
        this.gridAfter = 0;
        this.height = TableHeightUnit.createDefault();
        this.coreProperties = new TableRowProperties();
        this.cellSpacing = TableWidthUnit.createDefault();
        this.floatingPosition = new TableFloatingPositionInfo();
    }
    copyFrom(obj) {
        this.coreProperties.copyFrom(obj.coreProperties);
        this.left = obj.left;
        this.foreColorIndex = obj.foreColorIndex;
        this.backColorIndex = obj.backColorIndex;
        this.cellSpacing.copyFrom(obj.cellSpacing);
        this.floatingPosition = obj.floatingPosition;
        this.shadingPattern = obj.shadingPattern;
        this.foreColor = obj.foreColor;
        this.backColor = obj.backColor;
        this.widthAfter = obj.widthAfter;
        this.widthBefore = obj.widthBefore;
        this.gridBefore = obj.gridBefore;
        this.gridAfter = obj.gridAfter;
        this.height = obj.height;
    }
    apply(row) {
        row.widthBefore = this.widthBefore;
        row.widthAfter = this.widthAfter;
        row.gridBefore = this.gridBefore;
        row.gridAfter = this.gridAfter;
        row.height = this.height;
    }
}
