import { EncodeUtils } from '@devexpress/utils/lib/utils/encode';
import { BoxWrap } from '../../../layout-formatter/box/box-wrap';
import { MeasureInfoText } from '../../../measurer/measure-info';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutTextBox extends LayoutBox {
    constructor(characterProperties, colorInfo, text) {
        super(characterProperties, colorInfo);
        this.text = text;
    }
    equals(obj) {
        return super.equals(obj) &&
            this.text == obj.text;
    }
    clone() {
        const newObj = new LayoutTextBox(this.characterProperties, this.colorInfo, this.text);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.text = obj.text;
    }
    getType() {
        return LayoutBoxType.Text;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoText(this.text, this.characterProperties));
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
    getLength() {
        return this.text.length;
    }
    getCharOffsetXInPixels(measurer, charOffset) {
        if (charOffset == 0)
            return 0;
        else if (charOffset === this.getLength())
            return this.width;
        else {
            const info = new MeasureInfoText(this.text.substr(0, charOffset), this.characterProperties);
            measurer.measure([info]);
            return info.resultSize.width;
        }
    }
    calculateCharOffsetByPointX(measurer, pointX) {
        const boxRanges = this.getBoxRanges(measurer);
        const boxRangesLength = boxRanges.length;
        for (var i = 0; i < boxRangesLength; i++) {
            if (boxRanges[i].resultSize.width > pointX) {
                const letterWidth = i > 0 ?
                    boxRanges[i].resultSize.width - boxRanges[i - 1].resultSize.width :
                    boxRanges[0].resultSize.width;
                const clickPointOffset = pointX - (i > 0 ? boxRanges[i - 1].resultSize.width : 0);
                if (clickPointOffset / letterWidth > 0.6)
                    i++;
                break;
            }
        }
        return i;
    }
    splitByWidth(measurer, maxWidth, leaveAtLeastOneChar) {
        if (this.getLength() == 1)
            return super.splitByWidth(measurer, maxWidth, leaveAtLeastOneChar);
        const boxRanges = this.getBoxRanges(measurer);
        for (let i = boxRanges.length - 1, info; info = boxRanges[i]; i--)
            if (info.resultSize.width <= maxWidth || i == 0 && leaveAtLeastOneChar) {
                const newBox = this.clone();
                newBox.text = newBox.text.substr(0, info.text.length);
                LayoutBox.initializeWithMeasurer([new BoxWrap(newBox, null)], measurer, false);
                return newBox;
            }
        return null;
    }
    splitBoxByPosition(measurer, offsetAtStartBox) {
        const nextBox = this.clone();
        nextBox.text = nextBox.text.substr(offsetAtStartBox);
        this.text = this.text.substr(0, offsetAtStartBox);
        nextBox.rowOffset = this.getEndPosition();
        LayoutBox.initializeWithMeasurer([new BoxWrap(this, null), new BoxWrap(nextBox, null)], measurer, false);
        return nextBox;
    }
    getCharIndex(char) {
        return this.text.indexOf(char);
    }
    renderGetContent(_renderer) {
        return EncodeUtils.encodeHtml(this.text);
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
    getBoxRanges(measurer) {
        const measureInfos = [];
        const textLength = this.text.length;
        for (let i = 1; i <= textLength; i++)
            measureInfos.push(new MeasureInfoText(this.text.substr(0, i), this.characterProperties));
        measurer.measure(measureInfos);
        return measureInfos;
    }
}
