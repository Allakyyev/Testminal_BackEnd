import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class AlphabetBasedNumberConverter extends OrdinalBasedNumberConverter {
    constructor(alphabet) {
        super();
        this.minValue = 0;
        this.maxValue = 780;
        this.alphabet = alphabet;
    }
    convertNumberCore(value) {
        if (value == 0)
            return "";
        value--;
        var alphabetSize = this.alphabet.length;
        var count = Math.floor(value / alphabetSize + 1);
        var symbol = this.alphabet[value % alphabetSize];
        return Array(count + 1).join(symbol);
    }
}
