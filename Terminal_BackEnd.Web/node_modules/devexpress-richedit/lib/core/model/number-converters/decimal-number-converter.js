import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class DecimalNumberConverter extends OrdinalBasedNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.Decimal;
    }
    convertNumberCore(value) {
        return value.toString();
    }
}
