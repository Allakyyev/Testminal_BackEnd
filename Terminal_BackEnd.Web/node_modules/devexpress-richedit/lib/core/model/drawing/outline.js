import { DrawingFill } from './drawing-fill';
import { DrawingStrokeUnderlineType } from './enums';
export class Outline {
    constructor(fill = DrawingFill.Automatic) {
        this._fill = fill;
    }
    get fill() {
        return this.fill;
    }
    set fill(value) {
        if (value == null)
            value = DrawingFill.Automatic;
        if (!this._fill.equals(value))
            this._fill = value;
    }
    get type() {
        return DrawingStrokeUnderlineType.Outline;
    }
    clone() {
        return new Outline(this._fill.clone());
    }
}
