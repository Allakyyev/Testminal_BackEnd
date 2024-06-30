import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class DecimalEnclosedParenthesesNumberConverter extends OrdinalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super();
        this.simpleFormattersManager = simpleFormattersManager;
        this.type = NumberingFormat.DecimalEnclosedParentheses;
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("({0})", value);
    }
}
