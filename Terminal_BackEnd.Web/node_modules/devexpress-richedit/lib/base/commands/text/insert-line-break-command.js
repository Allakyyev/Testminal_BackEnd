import { RichUtils } from '../../../core/model/rich-utils';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertLineBreakCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        this.insertTextWithSelection(options.intervalsInfo.subDocInterval, RichUtils.specialCharacters.LineBreak);
        return true;
    }
}
