import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutNonBreakingSpaceBox extends LayoutBox {
    equals(obj) {
        return super.equals(obj) &&
            this.spaceWidth == obj.spaceWidth &&
            this.hiddenSpaceWidth == obj.hiddenSpaceWidth;
    }
    clone() {
        const newObj = new LayoutNonBreakingSpaceBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.spaceWidth = obj.spaceWidth;
        this.hiddenSpaceWidth = obj.hiddenSpaceWidth;
    }
    getType() {
        return LayoutBoxType.NonBreakingSpace;
    }
    pushInfoForMeasure(info, showHiddenSymbols) {
        info.push(new MeasureInfoNonText("&nbsp;", this.characterProperties));
        if (showHiddenSymbols)
            info.push(new MeasureInfoNonText(LayoutNonBreakingSpaceBox.SYMBOL, this.characterProperties));
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        this.hiddenSpaceWidth = showHiddenSymbols ? info.pop().resultSize.width : 0;
        const elem = info.pop();
        this.setSize(elem.resultSize);
        this.spaceWidth = elem.resultSize.width;
    }
    isVisible() {
        return true;
    }
    isVisibleForRowAlign() {
        return true;
    }
    renderGetContent(_renderer) {
        const numNbsps = Math.ceil((this.width - this.hiddenSpaceWidth) / Math.max(1, this.spaceWidth));
        return (this.hiddenSpaceWidth > 0 ? LayoutNonBreakingSpaceBox.SYMBOL : "") +
            StringUtils.repeat("&nbsp;", numNbsps);
    }
    renderIsWordBox() {
        return true;
    }
    isWhitespace() {
        return true;
    }
    isLineBreak() {
        return false;
    }
}
LayoutNonBreakingSpaceBox.SYMBOL = "˚";
