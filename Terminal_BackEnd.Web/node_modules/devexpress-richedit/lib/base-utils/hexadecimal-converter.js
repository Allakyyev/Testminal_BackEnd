import { RichNumberConverter } from './number-converter';
const tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const table = tableStr.split("");
export function hexToBase64(hexStr) {
    const stringArray = hexStr.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ");
    const binLength = stringArray.length;
    const result = [];
    for (let i = 0; i < binLength; i++)
        result.push(String.fromCharCode(+stringArray[i]));
    return btoa(result.join(""));
}
export function base64ToHex(base64Str) {
    for (var i = 0, bin = atob(base64Str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}
export function byteToHex(value) {
    let tmp = RichNumberConverter.numberToHex(value);
    return tmp.length === 1 ? "0" + tmp : tmp;
}
function btoa(bin) {
    for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
        var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
        if ((a | b | c) > 255)
            throw new Error("String contains an invalid character");
        base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
            (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
            (isNaN(b + c) ? "=" : table[c & 63]);
    }
    return base64.join("");
}
function atob(base64) {
    if (/(=[^=]+|={3,})$/.test(base64))
        throw new Error("String contains an invalid character");
    base64 = base64.replace(/=/g, "");
    var n = base64.length & 3;
    if (n === 1)
        throw new Error("String contains an invalid character");
    for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
        var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
        var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
        if ((a | b | c | d) < 0)
            throw new Error("String contains an invalid character");
        bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
        bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
        bin[bin.length] = ((c << 6) | d) & 255;
    }
    ;
    const binLength = bin.length + n - 4;
    const result = [];
    for (let i = 0; i < binLength; i++)
        result.push(String.fromCharCode(bin[i]));
    return result.join('');
}
