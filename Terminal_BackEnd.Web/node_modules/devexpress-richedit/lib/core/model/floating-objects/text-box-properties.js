import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { DrawingTextAnchoringType } from './enums';
export class TextBoxProperties {
    constructor(contentMargins) {
        this.resizeShapeToFitText = true;
        this.upright = false;
        this.verticalAlignment = DrawingTextAnchoringType.Top;
        this.wrapText = true;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.topMargin = 0;
        this.bottomMargin = 0;
        if (contentMargins) {
            this.leftMargin = contentMargins.left;
            this.rightMargin = contentMargins.right;
            this.topMargin = contentMargins.top;
            this.bottomMargin = contentMargins.bottom;
        }
    }
    clone() {
        const textBoxProperties = new TextBoxProperties();
        textBoxProperties.resizeShapeToFitText = this.resizeShapeToFitText;
        textBoxProperties.upright = this.upright;
        textBoxProperties.verticalAlignment = this.verticalAlignment;
        textBoxProperties.wrapText = this.wrapText;
        textBoxProperties.leftMargin = this.leftMargin;
        textBoxProperties.rightMargin = this.rightMargin;
        textBoxProperties.topMargin = this.topMargin;
        textBoxProperties.bottomMargin = this.bottomMargin;
        return textBoxProperties;
    }
    equals(obj) {
        if (!obj)
            return false;
        return obj.resizeShapeToFitText === this.resizeShapeToFitText &&
            obj.upright === this.upright &&
            obj.verticalAlignment === this.verticalAlignment &&
            obj.wrapText === this.wrapText &&
            obj.leftMargin === this.leftMargin &&
            obj.rightMargin === this.rightMargin &&
            obj.topMargin === this.topMargin &&
            obj.bottomMargin === this.bottomMargin;
    }
    getContentMargins() {
        return new Margins(this.leftMargin, this.rightMargin, this.topMargin, this.bottomMargin);
    }
    setMarginsToAnotherMeasuringSystem(converter) {
        this.leftMargin = converter(this.leftMargin);
        this.rightMargin = converter(this.rightMargin);
        this.topMargin = converter(this.topMargin);
        this.bottomMargin = converter(this.bottomMargin);
        return this;
    }
}
