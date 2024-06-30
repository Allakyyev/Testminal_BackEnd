import { RichNumberConverter } from '../../../base-utils/number-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { gb2312date } from './specified-symbols';
export class GB2315DecoderHelper {
    static get specifiedPairSymbols() {
        if (!GB2315DecoderHelper._specifiedPairSymbols) {
            const date = gb2312date.match(/.{1,4}/g);
            const result = {};
            let gbDate;
            ListUtils.forEach(date, (item) => {
                if (!gbDate)
                    gbDate = item;
                else {
                    result[gbDate.toLowerCase()] = parseInt(item, 16);
                    gbDate = null;
                }
            });
            GB2315DecoderHelper._specifiedPairSymbols = result;
        }
        return GB2315DecoderHelper._specifiedPairSymbols;
    }
    static getChars(bytes) {
        const result = [];
        let firstByte = 0;
        const bytesLength = bytes.length;
        ListUtils.forEach(bytes, (currentByte, index) => {
            const isLast = bytesLength - 1 == index;
            if (firstByte < 128) {
                firstByte = currentByte.charCodeAt(0);
                if (firstByte < 128 || isLast)
                    result.push(currentByte);
            }
            else {
                const secondByte = RichNumberConverter.numberToHex(currentByte.charCodeAt(0));
                const charCode = GB2315DecoderHelper.specifiedPairSymbols[RichNumberConverter.numberToHex(firstByte) + secondByte];
                result.push(charCode ? String.fromCharCode(charCode) : '');
                firstByte = 0;
            }
        });
        return result;
    }
}
GB2315DecoderHelper._specifiedPairSymbols = null;
