import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { RichUtils } from '../../../model/rich-utils';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutParagraphMarkBox extends LayoutBox {
    constructor(characterProperties, colorInfo, isLastParagraphInCell) {
        super(characterProperties, colorInfo);
        this.isLastParagraphInCell = isLastParagraphInCell;
    }
    equals(obj) {
        return super.equals(obj) &&
            this.paragraphMarkSymbol == obj.paragraphMarkSymbol &&
            this.isLastParagraphInCell == obj.isLastParagraphInCell;
    }
    clone() {
        const newObj = new LayoutParagraphMarkBox(this.characterProperties, this.colorInfo, this.isLastParagraphInCell);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.paragraphMarkSymbol = obj.paragraphMarkSymbol;
        this.isLastParagraphInCell = obj.isLastParagraphInCell;
    }
    getType() {
        return LayoutBoxType.ParagraphMark;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoNonText(this.getSymbolForMesure(), this.characterProperties));
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        this.paragraphMarkSymbol = this.getSymbol(showHiddenSymbols);
        this.setSize(info.pop().resultSize);
    }
    renderGetContent(_renderer) {
        return this.paragraphMarkSymbol;
    }
    renderNoStrikeoutAndNoUnderlineIfBoxInEndRow() {
        return true;
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return true;
    }
    getSymbolForMesure() {
        if (this.isLastParagraphInCell)
            return RichUtils.specialCharacters.CurrencySign;
        return RichUtils.specialCharacters.HiddenParagraphMark;
    }
    getSymbol(showHiddenSymbols) {
        if (!showHiddenSymbols)
            return "&nbsp;";
        return this.getSymbolForMesure();
    }
}
