import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class DecimalZeroNumberConverter extends OrdinalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super();
        this.simpleFormattersManager = simpleFormattersManager;
        this.type = NumberingFormat.DecimalZero;
    }
    convertNumberCore(value) {
        if (value < 10)
            return this.simpleFormattersManager.formatString("0{0}", value);
        else
            return value.toString();
    }
}
