import { Constants } from '@devexpress/utils/lib/constants';
import { NumberingFormat } from '../numbering-lists/list-level-properties';
export class OrdinalBasedNumberConverter {
    constructor() {
        this.maxValue = Constants.MAX_SAFE_INTEGER;
        this.minValue = Constants.MIN_SAFE_INTEGER;
    }
    convertNumber(value) {
        if (value >= this.minValue && value <= this.maxValue) {
            return this.convertNumberCore(value);
        }
        throw new Error("InvalidNumberConverterValue");
    }
}
export class OrdinalLocalBasedNumberConverter extends OrdinalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super();
        this.simpleFormattersManager = simpleFormattersManager;
        this.type = NumberingFormat.Ordinal;
    }
}
export class OrdinalEnglishNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
        this.ending = ["st", "nd", "rd", "th"];
    }
    convertNumberCore(value) {
        var temp = value % 100;
        if (temp < 21) {
            switch (temp) {
                case 1:
                    return this.simpleFormattersManager.formatString("{0}{1}", value, this.ending[0]);
                case 2:
                    return this.simpleFormattersManager.formatString("{0}{1}", value, this.ending[1]);
                case 3:
                    return this.simpleFormattersManager.formatString("{0}{1}", value, this.ending[2]);
                default:
                    return this.simpleFormattersManager.formatString("{0}{1}", value, this.ending[3]);
            }
        }
        value--;
        temp = value % 10;
        if (temp < 3)
            return this.simpleFormattersManager.formatString("{0}{1}", value + 1, this.ending[temp % 3]);
        return this.simpleFormattersManager.formatString("{0}{1}", value + 1, this.ending[3]);
    }
}
export class OrdinalFrenchNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        if (value == 1)
            return this.simpleFormattersManager.formatString("{0}er", value);
        else
            return this.simpleFormattersManager.formatString("{0}e", value);
    }
}
export class OrdinalGermanNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}.", value);
    }
}
export class OrdinalItalianNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}°", value);
    }
}
export class OrdinalTurkishNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}.", value);
    }
}
export class OrdinalGreekNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}ο", value);
    }
}
export class OrdinalSpanishNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}°", value);
    }
}
export class OrdinalPortugueseNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}º", value);
    }
}
export class OrdinalUkrainianNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}-й", value);
    }
}
export class OrdinalRussianNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        return this.simpleFormattersManager.formatString("{0}-й", value);
    }
}
export class OrdinalSwedishNumberConverter extends OrdinalLocalBasedNumberConverter {
    constructor(simpleFormattersManager) {
        super(simpleFormattersManager);
    }
    convertNumberCore(value) {
        if ((value % 10 == 1) || (value % 10 == 2))
            return this.simpleFormattersManager.formatString("{0}:a", value);
        else
            return this.simpleFormattersManager.formatString("{0}:e", value);
    }
}
