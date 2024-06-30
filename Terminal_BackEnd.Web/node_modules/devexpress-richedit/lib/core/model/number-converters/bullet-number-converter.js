import { NumberingFormat } from '../numbering-lists/list-level-properties';
import { OrdinalBasedNumberConverter } from './ordinal-based-number-converter';
export class BulletNumberConverter extends OrdinalBasedNumberConverter {
    constructor() {
        super();
        this.type = NumberingFormat.Bullet;
    }
    convertNumberCore(_value) {
        return "•";
    }
}
