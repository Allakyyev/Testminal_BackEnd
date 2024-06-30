import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { specified_949 } from "./specified-symbols-949";
export class HangulDecoderHelper {
    static get cptable() {
        if (!HangulDecoderHelper._cptable) {
            const data = {};
            NumberMapUtils.forEach(specified_949, (value, key) => {
                ListUtils.forEach(value.split(''), (char, index) => {
                    data[key + index] = char;
                });
            });
            HangulDecoderHelper._cptable = data;
        }
        return HangulDecoderHelper._cptable;
    }
    static getChars(data) {
        const cpTable = HangulDecoderHelper.cptable;
        const result = [];
        const prefixToIndex = 33089;
        let step = 0;
        const length = data.length;
        for (let i = 0; i < length; i += step) {
            step = 2;
            let currentChar;
            if (i + 1 < length)
                currentChar = cpTable[(data[i].charCodeAt(0) << 8) + data[i + 1].charCodeAt(0) - prefixToIndex];
            if (!currentChar) {
                step = 1;
                currentChar = cpTable[data[i].charCodeAt(0) - prefixToIndex];
            }
            result.push(currentChar !== null && currentChar !== void 0 ? currentChar : data[i]);
        }
        return result;
    }
}
