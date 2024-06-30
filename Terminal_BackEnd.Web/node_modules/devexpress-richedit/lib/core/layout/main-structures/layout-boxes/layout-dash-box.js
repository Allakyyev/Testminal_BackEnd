import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutDashBox extends LayoutBox {
    constructor(characterProperties, colorInfo, text) {
        super(characterProperties, colorInfo);
        this.text = text;
    }
    get isDashBox() { return true; }
    equals(obj) {
        return super.equals(obj) &&
            this.text == obj.text;
    }
    getType() {
        return LayoutBoxType.Dash;
    }
    clone() {
        const newObj = new LayoutDashBox(this.characterProperties, this.colorInfo, this.text);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.text = obj.text;
    }
    renderGetContent(_renderer) {
        return this.text;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoNonText(this.text, this.characterProperties));
    }
    popInfoForMeasure(info, _showHiddenSymbols) {
        this.setSize(info.pop().resultSize);
    }
    isVisible() {
        return true;
    }
    isVisibleForRowAlign() {
        return true;
    }
    renderIsWordBox() {
        return true;
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return false;
    }
}
