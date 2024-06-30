import * as DxLocDate from 'devextreme/localization/date';
import * as DxLocNumber from 'devextreme/localization/number';
export class ClientFormattersOptions {
    get locDate() { var _a; return (_a = DxLocDate.default) !== null && _a !== void 0 ? _a : DxLocDate; }
    get locNumber() { var _a; return (_a = DxLocNumber.default) !== null && _a !== void 0 ? _a : DxLocNumber; }
    get twoDigitYearMax() { return 2029; }
    get ts() { return this.locDate.getTimeSeparator(); }
    get ds() { return '/'; }
    get am() { return this.locDate.getPeriodNames()[0]; }
    get pm() { return this.locDate.getPeriodNames()[1]; }
    get monthNames() { return this.locDate.getMonthNames(); }
    get genMonthNames() { return this.locDate.getMonthNames(undefined, "format"); }
    get abbrMonthNames() { return this.locDate.getMonthNames('abbreviated'); }
    get abbrDayNames() { return this.locDate.getDayNames('abbreviated'); }
    get dayNames() { return this.locDate.getDayNames(); }
    get shortTime() { return `h${this.ts}mm tt`; }
    get longTime() { return `h${this.ts}mm${this.ts}ss tt`; }
    get shortDate() { return `M${this.ds}d${this.ds}yyyy`; }
    get longDate() { return "dddd, MMMM d, yyyy"; }
    get monthDay() { return "MMMM d"; }
    get yearMonth() { return "MMMM yyyy"; }
    get numDecimalPoint() { return this.locNumber.getDecimalSeparator(); }
    get numPrec() { return 2; }
    get numGroupSeparator() { return this.locNumber.getThousandsSeparator(); }
    get numGroups() { return [3]; }
    get numNegPattern() { return 1; }
    get numPosInf() { return 'Infinity'; }
    get numNegInf() { return '-Infinity'; }
    get numNan() { return 'NaN'; }
    get currency() { return '$'; }
    get currDecimalPoint() { return this.locNumber.getDecimalSeparator(); }
    get currPrec() { return 2; }
    get currGroupSeparator() { return this.locNumber.getThousandsSeparator(); }
    get currGroups() { return [3]; }
    get currPosPattern() { return 0; }
    get currNegPattern() { return 0; }
    get percentPattern() { return 0; }
    clone() {
        return new ClientFormattersOptions();
    }
}
