import { MeasureInfoNonText } from '../../../measurer/measure-info';
import { CharacterProperties } from '../../../model/character/character-properties';
import { RichUtils } from '../../../model/rich-utils';
import { LayoutBox, LayoutBoxType, LayoutRenderCharacterProperties } from './layout-box';
export class LayoutLineBreakBox extends LayoutBox {
    constructor(characterProperties, colorInfo) {
        super(characterProperties, colorInfo);
        if (!LayoutLineBreakBox.renderCharacterProperties && characterProperties) {
            LayoutLineBreakBox.renderCharacterProperties = new CharacterProperties();
            LayoutLineBreakBox.renderCharacterProperties.fontSize = 8;
            LayoutLineBreakBox.renderCharacterProperties.fontInfo = this.characterProperties.fontInfo.clone();
            LayoutLineBreakBox.renderCharacterProperties.fontInfo.measurer = this.characterProperties.fontInfo.measurer;
            LayoutLineBreakBox.renderCharacterProperties.fontInfo.name = "Arial";
            LayoutLineBreakBox.renderCharacterProperties.fontInfo.cssString = "Arial";
            LayoutLineBreakBox.renderCharacterProperties.fontInfo.scriptMultiplier = 0.65;
        }
    }
    equals(obj) {
        return super.equals(obj) &&
            this.lineBreakSymbol == obj.lineBreakSymbol;
    }
    clone() {
        const newObj = new LayoutLineBreakBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.lineBreakSymbol = obj.lineBreakSymbol;
    }
    getType() {
        return LayoutBoxType.LineBreak;
    }
    pushInfoForMeasure(info, _showHiddenSymbols) {
        info.push(new MeasureInfoNonText("a", this.characterProperties));
    }
    popInfoForMeasure(info, showHiddenSymbols) {
        this.lineBreakSymbol = showHiddenSymbols ? RichUtils.specialCharacters.HiddenLineBreak : "&nbsp;";
        this.renderGetCharacterProperties();
        this.setSize(info.pop().resultSize);
    }
    renderGetContent(_renderer) {
        return this.lineBreakSymbol;
    }
    renderNoStrikeoutAndNoUnderlineIfBoxInEndRow() {
        return true;
    }
    renderGetCharacterProperties() {
        LayoutLineBreakBox.renderCharacterProperties.hidden = this.characterProperties.hidden;
        return new LayoutRenderCharacterProperties(LayoutLineBreakBox.renderCharacterProperties, this.colorInfo);
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return true;
    }
}
