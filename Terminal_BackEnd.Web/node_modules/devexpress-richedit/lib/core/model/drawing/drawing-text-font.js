import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DrawingBulletType } from './enums';
export class DrawingTextFont {
    constructor() {
        this.stringArray = ["", ""];
        this.byteArray = [DrawingTextFont.DefaultCharset, DrawingTextFont.DefaultPitchFamily];
    }
    get typeface() {
        return this.stringArray[DrawingTextFont.typefaceIndex];
    }
    set typeface(value) {
        this.setStringArray(DrawingTextFont.typefaceIndex, value);
    }
    get panose() {
        return this.stringArray[DrawingTextFont.panoseIndex];
    }
    set panose(value) {
        this.setStringArray(DrawingTextFont.panoseIndex, value);
    }
    get charset() {
        return this.byteArray[DrawingTextFont.charsetIndex];
    }
    set charset(value) {
        this.setByteArray(DrawingTextFont.charsetIndex, value);
    }
    get pitchFamily() {
        return this.byteArray[DrawingTextFont.pitchFamilyIndex];
    }
    set pitchFamily(value) {
        this.setByteArray(DrawingTextFont.pitchFamilyIndex, value);
    }
    get isDefault() {
        return StringUtils.isNullOrEmpty(this.stringArray[DrawingTextFont.typefaceIndex]) &&
            StringUtils.isNullOrEmpty(this.stringArray[DrawingTextFont.panoseIndex]) &&
            this.byteArray[DrawingTextFont.charsetIndex] == DrawingTextFont.DefaultCharset &&
            this.byteArray[DrawingTextFont.pitchFamilyIndex] == DrawingTextFont.DefaultPitchFamily;
    }
    copyFrom(value) {
        this.stringArray[DrawingTextFont.typefaceIndex] = value.stringArray[DrawingTextFont.typefaceIndex];
        this.stringArray[DrawingTextFont.panoseIndex] = value.stringArray[DrawingTextFont.panoseIndex];
        this.byteArray[DrawingTextFont.charsetIndex] = value.byteArray[DrawingTextFont.charsetIndex];
        this.byteArray[DrawingTextFont.pitchFamilyIndex] = value.byteArray[DrawingTextFont.pitchFamilyIndex];
    }
    clone() {
        var result = new DrawingTextFont();
        result.copyFrom(this);
        return result;
    }
    equals(other) {
        return other &&
            this.stringArray[DrawingTextFont.typefaceIndex] == other.stringArray[DrawingTextFont.typefaceIndex] &&
            this.stringArray[DrawingTextFont.panoseIndex] == other.stringArray[DrawingTextFont.panoseIndex] &&
            this.byteArray[DrawingTextFont.charsetIndex] == other.byteArray[DrawingTextFont.charsetIndex] &&
            this.byteArray[DrawingTextFont.pitchFamilyIndex] == other.byteArray[DrawingTextFont.pitchFamilyIndex];
    }
    clear() {
        this.typeface = "";
        this.panose = "";
        this.charset = DrawingTextFont.DefaultCharset;
        this.pitchFamily = DrawingTextFont.DefaultPitchFamily;
    }
    get type() {
        return DrawingBulletType.Typeface;
    }
    setStringArray(index, value) {
        if (this.stringArray[index] != value)
            this.stringArray[index] = value;
    }
    setByteArray(index, value) {
        if (this.byteArray[index] != value)
            this.byteArray[index] = value;
    }
}
DrawingTextFont.DefaultCharset = 1;
DrawingTextFont.DefaultPitchFamily = 0;
DrawingTextFont.typefaceIndex = 0;
DrawingTextFont.panoseIndex = 1;
DrawingTextFont.charsetIndex = 0;
DrawingTextFont.pitchFamilyIndex = 1;
