import { ColorHelper } from '../color/color';
export class Shape {
    constructor(fillColor = ColorHelper.NO_COLOR, outlineColor = ColorHelper.NO_COLOR, outlineWidth = 0) {
        this.fillColor = ColorHelper.NO_COLOR;
        this.outlineColor = ColorHelper.NO_COLOR;
        this.outlineWidth = 0;
        this.fillColor = fillColor;
        this.outlineColor = outlineColor;
        this.outlineWidth = outlineWidth;
    }
    clone() {
        return new Shape(this.fillColor, this.outlineColor, this.outlineWidth);
    }
    copyFrom(obj) {
        this.fillColor = obj.fillColor;
        this.outlineColor = obj.outlineColor;
        this.outlineWidth = obj.outlineWidth;
    }
    applyConverter(converter) {
        this.outlineWidth = converter(this.outlineWidth);
        return this;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.fillColor == obj.fillColor &&
            this.outlineColor == obj.outlineColor &&
            this.outlineWidth == obj.outlineWidth;
    }
}
