import { DrawingFillType, DrawingUnderlineFillType } from './enums';
export class DrawingFill {
    constructor(fillType) {
        this.fillType = fillType;
    }
    get type() {
        return DrawingUnderlineFillType.Fill;
    }
    clone() {
        return new DrawingFill(this.fillType);
    }
    equals(obj) {
        return obj &&
            this.fillType == obj.fillType;
    }
}
DrawingFill.Automatic = new DrawingFill(DrawingFillType.Automatic);
DrawingFill.None = new DrawingFill(DrawingFillType.None);
DrawingFill.Group = new DrawingFill(DrawingFillType.Group);
