import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { SHA512 } from './sha512';
export class SHA384 extends SHA512 {
    constructor() {
        super();
    }
    getDefaultCache() {
        return [
            new MinMaxNumber(3238371032, 3418070365),
            new MinMaxNumber(914150663, 1654270250),
            new MinMaxNumber(812702999, 2438529370),
            new MinMaxNumber(4144912697, 355462360),
            new MinMaxNumber(4290775857, 1731405415),
            new MinMaxNumber(1750603025, 2394180231),
            new MinMaxNumber(1694076839, 3675008525),
            new MinMaxNumber(3204075428, 1203062813)
        ];
    }
    computeHash(source) {
        const words = super.computeHash(source);
        words.length -= 16 / 4;
        return words;
    }
}
