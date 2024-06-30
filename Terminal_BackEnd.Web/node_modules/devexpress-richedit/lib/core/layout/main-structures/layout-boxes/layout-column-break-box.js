import { LayoutBoxType } from './layout-box';
import { LayoutPageBreakBox } from './layout-page-break-box';
export class LayoutColumnBreakBox extends LayoutPageBreakBox {
    clone() {
        const newObj = new LayoutColumnBreakBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    getType() {
        return LayoutBoxType.ColumnBreak;
    }
    getHiddenText() {
        return "........Column Break........";
    }
    isLineBreak() {
        return true;
    }
}
