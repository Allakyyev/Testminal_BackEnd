import { LayoutBoxType } from './layout-box';
import { LayoutPageBreakBox } from './layout-page-break-box';
export class LayoutSectionMarkBox extends LayoutPageBreakBox {
    get isSectionBreakBox() { return true; }
    clone() {
        const newObj = new LayoutSectionMarkBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    getType() {
        return LayoutBoxType.SectionMark;
    }
    getHiddenText() {
        return "::::::::Section Break::::::::";
    }
}
