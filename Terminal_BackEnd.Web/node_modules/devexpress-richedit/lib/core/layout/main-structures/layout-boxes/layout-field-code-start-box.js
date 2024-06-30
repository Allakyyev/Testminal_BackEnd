import { EncodeUtils } from '@devexpress/utils/lib/utils/encode';
import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutFieldCodeStartBox extends LayoutBox {
    clone() {
        const newObj = new LayoutFieldCodeStartBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    getType() {
        return LayoutBoxType.FieldCodeStart;
    }
    getBoxChar() {
        return "{";
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoNonText(this.getBoxChar(), this.characterProperties));
    }
    popInfoForMeasure(info, _showHiddenSymbols) {
        this.setSize(info.pop().resultSize);
    }
    isVisibleForRowAlign() {
        return true;
    }
    isVisible() {
        return true;
    }
    renderGetContent(_renderer) {
        return EncodeUtils.encodeHtml(this.getBoxChar());
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return false;
    }
}
