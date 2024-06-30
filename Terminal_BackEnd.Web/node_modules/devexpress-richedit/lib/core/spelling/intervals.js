import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class SpellCheckerInterval extends FixedInterval {
    setStart(start) {
        this.start = start;
        this.onChanged();
    }
    setLength(length) {
        this.length = length;
        this.onChanged();
    }
    onChanged() { }
}
export class UncheckedInterval extends SpellCheckerInterval {
    constructor(start, length, isSplitted = true) {
        super(start, length);
        this.info = new UncheckedIntervalInfo(isSplitted);
    }
    onChanged() {
        this.info.isChecking = false;
    }
}
export class UncheckedIntervalInfo {
    constructor(isSplitted) {
        this.isSplitted = isSplitted;
        this.isChecking = false;
    }
}
export class MisspelledInterval extends SpellCheckerInterval {
    constructor(start, length, errorInfo) {
        super(start, length);
        this.errorInfo = errorInfo;
    }
}
export class IgnoredInterval extends SpellCheckerInterval {
    constructor(start, length, word) {
        super(start, length);
        this.word = word;
    }
}
