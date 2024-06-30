import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class NumberInDashNumberConverter extends OrdinalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super();
        this.simpleFormattersManager = simpleFormattersManager;
        this.type = NumberingFormat.NumberInDash;
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("- {0} -", value);
    }
}
