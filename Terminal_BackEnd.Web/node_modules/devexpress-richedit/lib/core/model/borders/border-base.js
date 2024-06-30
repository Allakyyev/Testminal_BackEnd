import { ColorHelper } from '../color/color';
import { BorderLineStyle } from './enums';
export class BorderBase {
    constructor(style, width, color) {
        this.style = style;
        this.width = width;
        this.color = color;
    }
    static getEmpty() {
        return BorderBase.empty.clone();
    }
    clone() {
        return new BorderBase(this.style, this.width, this.color);
    }
    equals(obj) {
        return obj &&
            this.style == obj.style &&
            this.width == obj.width &&
            this.color == obj.color;
    }
}
BorderBase.empty = new BorderBase(BorderLineStyle.None, 0, ColorHelper.AUTOMATIC_COLOR);
