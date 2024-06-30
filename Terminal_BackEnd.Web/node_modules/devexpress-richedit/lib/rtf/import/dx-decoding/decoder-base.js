export class DecoderBase {
    static decode(str, specifiedSymbols) {
        if (str == null) {
            return null;
        }
        let result = "";
        for (let i = 0; i < str.length; i++) {
            const sourceCharCode = str.charCodeAt(i);
            const target = specifiedSymbols[sourceCharCode];
            const targetCharCode = target !== undefined ? target : sourceCharCode;
            result = result + String.fromCharCode(targetCharCode);
        }
        return result;
    }
}
