export class LayoutCharacterPropertiesColorInfo {
    constructor(textColor, foregroundColor, strikeoutColor, underlineColor) {
        this.textColor = textColor;
        this.foregroundColor = foregroundColor;
        this.strikeoutColor = strikeoutColor;
        this.underlineColor = underlineColor;
    }
    equals(obj) {
        return obj &&
            this.textColor == obj.textColor &&
            this.foregroundColor == obj.foregroundColor &&
            this.strikeoutColor == obj.strikeoutColor &&
            this.underlineColor == obj.underlineColor;
    }
    clone() {
        return new LayoutCharacterPropertiesColorInfo(this.textColor, this.foregroundColor, this.strikeoutColor, this.underlineColor);
    }
}
