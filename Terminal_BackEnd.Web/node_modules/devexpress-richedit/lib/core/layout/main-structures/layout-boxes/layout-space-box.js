import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { RichUtils } from '../../../model/rich-utils';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutSpaceBox extends LayoutBox {
    equals(obj) {
        return super.equals(obj) &&
            this.spaceWidth == obj.spaceWidth &&
            this.hiddenSpaceWidth == obj.hiddenSpaceWidth;
    }
    clone() {
        const newObj = new LayoutSpaceBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.spaceWidth = obj.spaceWidth;
        this.hiddenSpaceWidth = obj.hiddenSpaceWidth;
    }
    getType() {
        return LayoutBoxType.Space;
    }
    pushInfoForMeasure(info, showHiddenSymbols) {
        info.push(new MeasureInfoNonText("&nbsp;", this.characterProperties));
        if (showHiddenSymbols)
            info.push(new MeasureInfoNonText(RichUtils.specialCharacters.HiddenSpace, this.characterProperties));
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
    renderGetContent(_renderer) {
        const numNbsps = Math.ceil((this.width - this.hiddenSpaceWidth) / Math.max(1, this.spaceWidth));
        return (this.hiddenSpaceWidth > 0 ? RichUtils.specialCharacters.HiddenSpace : "") +
            StringUtils.repeat("&nbsp;", numNbsps);
    }
    renderNoStrikeoutAndNoUnderlineIfBoxInEndRow() {
        return true;
    }
    isWhitespace() {
        return true;
    }
    isLineBreak() {
        return false;
    }
}
