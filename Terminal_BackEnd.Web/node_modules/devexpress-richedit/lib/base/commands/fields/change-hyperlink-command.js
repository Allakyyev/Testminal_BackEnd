import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeHyperlinkCommandOptions extends CommandOptions {
    constructor(control, fieldIndex, hyperlinkInfo, text) {
        super(control);
        this.fieldIndex = fieldIndex;
        this.hyperlinkInfo = hyperlinkInfo;
        this.text = text;
    }
}
export class ChangeHyperlinkCommand extends CommandBase {
    getState(options) {
        return new SimpleCommandState(this.isEnabled() && options.fieldIndex >= 0);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, options) {
        const field = options.subDocument.fields[options.fieldIndex];
        return this.modelManipulator.field.changeHyperlinkInfo(options.subDocument, field, options.hyperlinkInfo, options.text);
    }
}
