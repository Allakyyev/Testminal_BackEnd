import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { CharacterPropertyDescriptor } from '../../../../core/model/character/character-property-descriptor';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RtfFontType } from './enums';
import { RtfFormattingInfo } from './rtf-formatting-info';
export class RtfCharacterProperties {
    constructor() {
        this.coreProperties = new MaskedCharacterProperties();
        this.parentStyleIndex = -1;
        this.fontType = RtfFontType.Undefined;
        this.rtfFormattingInfo = new RtfFormattingInfo();
    }
    setFont(rtfFontInfo, fontInfo) {
        const fontName = rtfFontInfo.name;
        this.coreProperties.setValue(CharacterPropertyDescriptor.fontInfo, fontInfo);
        if (this.fontType == RtfFontType.Undefined) {
            this.resetUseAssociatedProperties();
        }
        else {
            if (this.fontType == RtfFontType.DoubleByteCharactersFont)
                this.doubleByteCharactersFontName = fontName;
            else if (this.fontType == RtfFontType.HighAnsiCharactersFont)
                this.highAnsiCharactersFontName = fontName;
            else if (this.fontType == RtfFontType.LowAnsiCharactersFont)
                this.lowAnsiCharactersFontName = fontName;
            this.recalcUseAssociatedProperties();
            this.fontType = RtfFontType.Undefined;
        }
    }
    resetUseAssociatedProperties() {
        this.highAnsiCharactersFontName = '';
        this.lowAnsiCharactersFontName = '';
        this.doubleByteCharactersFontName = '';
        this.useHighAnsiCharactersFontName = false;
        this.useLowAnsiCharactersFontName = false;
        this.useDoubleByteCharactersFontName = false;
    }
    recalcUseAssociatedProperties() {
        this.useHighAnsiCharactersFontName = !StringUtils.isNullOrEmpty(this.highAnsiCharactersFontName);
        this.useLowAnsiCharactersFontName = !StringUtils.isNullOrEmpty(this.lowAnsiCharactersFontName);
        this.useDoubleByteCharactersFontName = !StringUtils.isNullOrEmpty(this.doubleByteCharactersFontName);
    }
    clone() {
        const obj = new RtfCharacterProperties();
        obj.copyFrom(this);
        return obj;
    }
    copyFrom(obj) {
        this.coreProperties = obj.coreProperties.clone();
        this.parentStyleIndex = obj.parentStyleIndex;
        this.fontType = obj.fontType;
        this.doubleByteCharactersFontName = obj.doubleByteCharactersFontName;
        this.lowAnsiCharactersFontName = obj.lowAnsiCharactersFontName;
        this.highAnsiCharactersFontName = obj.highAnsiCharactersFontName;
        this.useDoubleByteCharactersFontName = obj.useDoubleByteCharactersFontName;
        this.useLowAnsiCharactersFontName = obj.useLowAnsiCharactersFontName;
        this.useHighAnsiCharactersFontName = obj.useHighAnsiCharactersFontName;
        this.rtfFormattingInfo = obj.rtfFormattingInfo.clone();
    }
}
