import { ControlOptions } from '../../../core/model/options/control';
import { ParagraphStyle } from '../../../core/model/paragraph/paragraph-style';
import { StylesManager } from '../../../core/model/styles-manager';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SetParagraphLevelCommandBase extends CommandBase {
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphFormatting);
    }
    getState() {
        const state = new SimpleCommandState(this.isEnabled());
        state.value = this.control.commandManager.getCommand(RichEditClientCommand.ChangeHeadingLevel).getState().value == this.getLevel(null);
        return state;
    }
    executeCore(_state, options) {
        const level = this.getLevel(options.param);
        const styleName = level > 0 ? `${ParagraphStyle.headingStyleName} ${level}` : ParagraphStyle.normalStyleName;
        let paragraphStyle = this.control.modelManager.model.getParagraphStyleByName(styleName);
        if (!paragraphStyle)
            paragraphStyle = StylesManager.getPresetParagraphStyleByName(styleName);
        if (paragraphStyle)
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeStyle).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, StylesManager.paragraphPrefix + styleName));
        else
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeHeadingLevel).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, level));
        return true;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetParagraphBodyTextLevel]: true,
            [RichEditClientCommand.SetParagraphHeading1Level]: true,
            [RichEditClientCommand.SetParagraphHeading2Level]: true,
            [RichEditClientCommand.SetParagraphHeading3Level]: true,
            [RichEditClientCommand.SetParagraphHeading4Level]: true,
            [RichEditClientCommand.SetParagraphHeading5Level]: true,
            [RichEditClientCommand.SetParagraphHeading6Level]: true,
            [RichEditClientCommand.SetParagraphHeading7Level]: true,
            [RichEditClientCommand.SetParagraphHeading8Level]: true,
            [RichEditClientCommand.SetParagraphHeading9Level]: true,
        };
    }
}
export class SetParagraphLevelCommand extends SetParagraphLevelCommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.value = this.control.commandManager.getCommand(RichEditClientCommand.ChangeHeadingLevel).getState().value;
        return state;
    }
    getLevel(parameter) {
        return parameter;
    }
}
export class SetParagraphBodyTextLevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 0; }
}
export class SetParagraphHeading1LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 1; }
}
export class SetParagraphHeading2LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 2; }
}
export class SetParagraphHeading3LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 3; }
}
export class SetParagraphHeading4LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 4; }
}
export class SetParagraphHeading5LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 5; }
}
export class SetParagraphHeading6LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 6; }
}
export class SetParagraphHeading7LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 7; }
}
export class SetParagraphHeading8LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 8; }
}
export class SetParagraphHeading9LevelCommand extends SetParagraphLevelCommandBase {
    getLevel(_parameter) { return 9; }
}
