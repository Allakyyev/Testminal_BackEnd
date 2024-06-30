import { RichUtils } from '../../model/rich-utils';
export class StringHelper {
    static removeSpecialSymbols(text) {
        if (!StringHelper.containsSpecialSymbols(text))
            return text;
        let sb = "";
        let count = text.length;
        for (let i = 0; i < count; i++) {
            const ch = text[i];
            const charCode = text.charCodeAt(i);
            if (charCode > StringHelper.lastLowSpecial && charCode < StringHelper.firstHighSpecial)
                sb += ch;
            else {
                if (charCode == StringHelper.horizontalTabulationCharCode || charCode == StringHelper.newLineCharCode
                    || charCode == StringHelper.carriageReturnCharCode)
                    sb += ch;
            }
        }
        return sb;
    }
    static replaceParagraphMarksWithLineBreaks(text) {
        if (!this.containsParagraphMarksOrUnitSeparators(text))
            return text;
        const sb = [];
        const count = text.length;
        for (let i = 0; i < count; i++) {
            const ch = text[i];
            const charCode = text.charCodeAt(i);
            if (charCode != StringHelper.newLineCharCode && charCode != StringHelper.carriageReturnCharCode
                && charCode != StringHelper.unitSeparatorCharCode && charCode != StringHelper.recordSeparatorCharCode)
                sb.push(ch);
            else if (charCode != StringHelper.unitSeparatorCharCode && charCode != StringHelper.recordSeparatorCharCode) {
                sb.push(RichUtils.specialCharacters.LineBreak);
                if (i != count - 1) {
                    const nextCh = text[i + 1];
                    const newtCharCode = text.charCodeAt(i + 1);
                    if ((newtCharCode == StringHelper.newLineCharCode || newtCharCode == StringHelper.carriageReturnCharCode) && nextCh != ch)
                        i++;
                }
            }
            else if (charCode == StringHelper.recordSeparatorCharCode) {
                sb.push(RichUtils.specialCharacters.Dash);
            }
        }
        return sb.join('');
    }
    static containsParagraphMarksOrUnitSeparators(text) {
        const count = text.length;
        for (let i = 0; i < count; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode == StringHelper.newLineCharCode || charCode == StringHelper.carriageReturnCharCode
                || charCode == StringHelper.unitSeparatorCharCode || charCode == StringHelper.recordSeparatorCharCode)
                return true;
        }
        return false;
    }
    static containsSpecialSymbols(text) {
        let count = text.length;
        for (var i = 0; i < count; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode <= StringHelper.lastLowSpecial || charCode >= StringHelper.firstHighSpecial) {
                if (charCode != StringHelper.horizontalTabulationCharCode && charCode != StringHelper.newLineCharCode
                    && charCode != StringHelper.carriageReturnCharCode)
                    return true;
            }
        }
        return false;
    }
}
StringHelper.lastLowSpecial = 0x1f;
StringHelper.firstHighSpecial = 0xffff;
StringHelper.horizontalTabulationCharCode = 0x09;
StringHelper.newLineCharCode = 0x0A;
StringHelper.carriageReturnCharCode = 0x0D;
StringHelper.recordSeparatorCharCode = 0x1E;
StringHelper.unitSeparatorCharCode = 0x1f;
