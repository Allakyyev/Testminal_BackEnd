import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class SetSelectionParamsBase {
    constructor() {
        this.endOfLine = true;
        this.keepX = -1;
        this.correctIntervalDueToFields = true;
        this.correctIntervalDueToTables = true;
        this.useFieldUiChecks = true;
    }
    setInterval(interval) {
        this._intervals = [interval.clone()];
        return this;
    }
    resetKeepX() {
        this.keepX = -1;
        return this;
    }
    setPosition(position) {
        this._intervals = [new FixedInterval(position, 0)];
        return this;
    }
    setEndOfLine(endOfLine) {
        this.endOfLine = endOfLine;
        return this;
    }
    setKeepX(keepX) {
        this.keepX = keepX;
        return this;
    }
    setCorrectIntervalDueToFields(correctIntervalDueToFields) {
        this.correctIntervalDueToFields = correctIntervalDueToFields;
        return this;
    }
    setCorrectIntervalDueToTables(correctIntervalDueToTables) {
        this.correctIntervalDueToTables = correctIntervalDueToTables;
        return this;
    }
    setUseFieldUiChecks(useFieldUiChecks) {
        this.useFieldUiChecks = useFieldUiChecks;
        return this;
    }
}
export class SetSelectionParams extends SetSelectionParamsBase {
    get interval() { return this._intervals[0]; }
    ;
}
export class SetSelectionParamsFull extends SetSelectionParamsBase {
    get intervals() { return this._intervals; }
}
