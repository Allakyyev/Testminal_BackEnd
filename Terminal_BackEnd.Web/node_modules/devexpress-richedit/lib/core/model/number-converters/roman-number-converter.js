import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class RomanNumberConverter extends OrdinalBasedNumberConverter {
    convertNumberCore(value) {
        var result = "";
        for (var i = this.romans.length - 1; i >= 0; i--) {
            while (value >= this.arabics[i]) {
                value -= this.arabics[i];
                result += this.romans[i];
            }
        }
        return result;
    }
}
export class UpperRomanNumberConverterClassic extends RomanNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.UpperRoman;
        this.arabics = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
        this.romans = ["I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM", "M"];
    }
}
export class LowerRomanNumberConverterClassic extends RomanNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.LowerRoman;
        this.arabics = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
        this.romans = ["i", "iv", "v", "ix", "x", "xl", "l", "xc", "c", "cd", "d", "cm", "m"];
    }
}
