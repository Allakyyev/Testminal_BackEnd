import { LineNumberingRestartType } from './enums';
export class LineNumberDefaults {
}
LineNumberDefaults.countBy = 0;
LineNumberDefaults.start = 1;
LineNumberDefaults.distance = 360;
LineNumberDefaults.restart = LineNumberingRestartType.NewPage;
export class LineNumberingProperties {
    constructor(countBy = LineNumberDefaults.countBy, start = LineNumberDefaults.start, distance = LineNumberDefaults.distance, restart = LineNumberDefaults.restart) {
        this.countBy = countBy;
        this.start = start;
        this.distance = distance;
        this.restart = restart;
    }
    get isDefined() {
        return this.countBy !== LineNumberDefaults.countBy;
    }
    copyFrom(obj) {
        this.countBy = obj.countBy;
        this.distance = obj.distance;
        this.restart = obj.restart;
        this.start = obj.start;
    }
    clone() {
        const result = new LineNumberingProperties();
        result.copyFrom(this);
        return result;
    }
    equals(obj) {
        return obj &&
            this.countBy === obj.countBy &&
            this.distance === obj.distance &&
            this.restart === obj.restart &&
            this.start === obj.start;
    }
}
