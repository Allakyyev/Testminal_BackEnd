import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class RichNumberConverter {
    static numberToBinary(num) {
        return (num >>> 0).toString(2);
    }
    static numberToHex(num) {
        return (num >>> 0).toString(16);
    }
    static convertToBinary(num) {
        return StringUtils.padLeft(RichNumberConverter.numberToBinary(num), 2, '0');
    }
    static convertToHexBinary(num) {
        return StringUtils.padLeft(RichNumberConverter.numberToHex(num), 8, '0');
    }
}
