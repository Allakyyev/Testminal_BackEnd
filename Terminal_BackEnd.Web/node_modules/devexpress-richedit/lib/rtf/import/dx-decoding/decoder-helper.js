import { CodePages } from '../encoding/code-pages';
import { HangulDecoderHelper } from './hangul949-decoder-helper';
import { DecoderBase } from './decoder-base';
import { GB2315DecoderHelper } from './gb2315-decoder-helper';
import { RussianDecoder } from './russian-decoder';
import { windows1250specifiedSymbols, windows1252specifiedSymbols, windows1253specifiedSymbols, windows1254specifiedSymbols, windows1255specifiedSymbols, windows1256specifiedSymbols, windows1257specifiedSymbols, windows1258specifiedSymbols } from './specified-symbols';
export class DecoderHelper {
    static decode(str, codePage) {
        if (codePage == CodePages.Russian)
            return RussianDecoder.decode(str);
        else if (codePage == CodePages.default)
            return DecoderBase.decode(str, windows1250specifiedSymbols);
        else if (codePage == CodePages.Ansi)
            return DecoderBase.decode(str, windows1252specifiedSymbols);
        else if (codePage == CodePages.Greek)
            return DecoderBase.decode(str, windows1253specifiedSymbols);
        else if (codePage == CodePages.Turkis)
            return DecoderBase.decode(str, windows1254specifiedSymbols);
        else if (codePage == CodePages.Hebrew)
            return DecoderBase.decode(str, windows1255specifiedSymbols);
        else if (codePage == CodePages.Arabic)
            return DecoderBase.decode(str, windows1256specifiedSymbols);
        else if (codePage == CodePages.Baltic)
            return DecoderBase.decode(str, windows1257specifiedSymbols);
        else if (codePage == CodePages.Vietnamese)
            return DecoderBase.decode(str, windows1258specifiedSymbols);
        return str;
    }
    static getChars(bytes, codePage) {
        if (codePage == CodePages.GB2315)
            return GB2315DecoderHelper.getChars(bytes);
        else if (codePage == CodePages.Hangul)
            return HangulDecoderHelper.getChars(bytes);
        return bytes;
    }
}
