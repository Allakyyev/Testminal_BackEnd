import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class HexNumberConverter extends OrdinalBasedNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.Hex;
    }
    convertNumberCore(value) {
        return value.toString(16);
    }
}
