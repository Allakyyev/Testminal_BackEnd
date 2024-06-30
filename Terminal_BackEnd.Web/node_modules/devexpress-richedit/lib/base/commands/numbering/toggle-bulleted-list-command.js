import { NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../../core/model/options/control';
import { ToggleNumberingListCommand } from './toggle-numbering-list-command';
export class ToggleBulletedListCommand extends ToggleNumberingListCommand {
    getNumberingListType() {
        return NumberingType.Bullet;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingBulleted);
    }
}
