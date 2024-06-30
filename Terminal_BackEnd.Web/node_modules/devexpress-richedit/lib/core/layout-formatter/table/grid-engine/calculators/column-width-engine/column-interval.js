import { TableWidthUnitType } from '../../../../../model/tables/secondary-structures/table-units';
export class ColumnInterval {
    constructor(width, colSpan, type) {
        this.width = width;
        this.colSpan = colSpan;
        this.type = type;
    }
    substract(b) {
        const colSpan = this.colSpan - b.colSpan;
        if (this.type == b.type)
            return new ColumnInterval(Math.max(0, this.width - b.width), colSpan, this.type);
        switch (this.type) {
            case TableWidthUnitType.FiftiethsOfPercent: return new ColumnInterval(b.width, colSpan, b.type);
            case TableWidthUnitType.ModelUnits: return new ColumnInterval(this.width, colSpan, this.type);
            default:
                const type = this.type == TableWidthUnitType.Auto || b.type == TableWidthUnitType.Auto ?
                    TableWidthUnitType.Auto : TableWidthUnitType.Nil;
                return new ColumnInterval(0, colSpan, type);
        }
    }
}
