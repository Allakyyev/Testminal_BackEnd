import { Int32Constants } from '@devexpress/utils/lib/constants';
import { RtfListLevel } from './rtf-list-level';
export class RtfListOverrideLevel {
    constructor() {
        this.startAt = Int32Constants.MAX_VALUE;
        this.level = new RtfListLevel();
    }
}
