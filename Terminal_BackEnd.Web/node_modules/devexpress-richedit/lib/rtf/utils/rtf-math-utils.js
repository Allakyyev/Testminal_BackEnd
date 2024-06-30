export class RtfMathUtils {
    static getShortValue(value) {
        return value & 0x7FFF;
    }
    static isShortValue(value) {
        return value == RtfMathUtils.getShortValue(value);
    }
    static getUInt16(value) {
        return 0xffff & value;
    }
}
