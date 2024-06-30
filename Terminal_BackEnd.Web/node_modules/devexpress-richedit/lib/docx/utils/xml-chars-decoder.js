import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class XmlCharsDecoder {
    static decode(val) {
        return StringUtils.isNullOrEmpty(val) ?
            val :
            val.replace(XmlCharsDecoder.xmlCharDecodingRegex, (allStr, value) => {
                const valueAsInt = parseInt(value, 10);
                return (!isNaN(valueAsInt) && (valueAsInt <= 0x1f || valueAsInt >= 0xffff)) ?
                    String.fromCharCode(valueAsInt) :
                    allStr;
            });
    }
}
XmlCharsDecoder.xmlCharDecodingRegex = new RegExp('_x([\\da-fA-F]{4})_');
