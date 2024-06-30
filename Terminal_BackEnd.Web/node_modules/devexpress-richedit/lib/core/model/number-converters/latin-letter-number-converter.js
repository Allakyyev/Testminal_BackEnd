import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { AlphabetBasedNumberConverter } from './alphabet-based-number-converter';
export class UpperLatinLetterNumberConverter extends AlphabetBasedNumberConverter {
    constructor() {
        super(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
        this.type = NumberingFormat.UpperLetter;
    }
}
export class LowerLatinLetterNumberConverter extends AlphabetBasedNumberConverter {
    constructor() {
        super(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
        this.type = NumberingFormat.LowerLetter;
    }
}
