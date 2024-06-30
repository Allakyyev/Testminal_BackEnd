import { MeasureInfoText } from '../../../measurer/measure-info';
import { CharacterProperties } from '../../../model/character/character-properties';
import { LayoutBox, LayoutBoxType, LayoutRenderCharacterProperties } from './layout-box';
export class LayoutPageBreakBox extends LayoutBox {
    constructor(characterProperties, colorInfo) {
        super(characterProperties, colorInfo);
        if (!LayoutPageBreakBox.renderCharacterProperties && characterProperties) {
            LayoutPageBreakBox.renderCharacterProperties = new CharacterProperties();
            LayoutPageBreakBox.renderCharacterProperties.fontSize = 10;
            LayoutPageBreakBox.renderCharacterProperties.fontInfo = this.characterProperties.fontInfo.clone();
            LayoutPageBreakBox.renderCharacterProperties.fontInfo.measurer = this.characterProperties.fontInfo.measurer;
            LayoutPageBreakBox.renderCharacterProperties.fontInfo.name = "Arial";
            LayoutPageBreakBox.renderCharacterProperties.fontInfo.cssString = "Arial";
            LayoutPageBreakBox.renderCharacterProperties.fontInfo.scriptMultiplier = 0.65;
        }
    }
    equals(obj) {
        return super.equals(obj) &&
            this.text == obj.text;
    }
    clone() {
        const newObj = new LayoutPageBreakBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.text = obj.text;
    }
    getType() {
        return LayoutBoxType.PageBreak;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoText(this.getHiddenText(), this.renderGetCharacterProperties().initProps));
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        var elem = info.pop();
        this.text = showHiddenSymbols ? elem.text : "&nbsp;";
        this.setSize(elem.resultSize);
    }
    renderGetContent(_renderer) {
        return this.text;
    }
    renderNoStrikeoutAndNoUnderlineIfBoxInEndRow() {
        return true;
    }
    renderGetCharacterProperties() {
        LayoutPageBreakBox.renderCharacterProperties.hidden = this.characterProperties.hidden;
        return new LayoutRenderCharacterProperties(LayoutPageBreakBox.renderCharacterProperties, this.colorInfo);
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return true;
    }
    getHiddenText() {
        return "........Page Break........";
    }
}
