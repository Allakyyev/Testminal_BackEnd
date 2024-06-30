import { ParagraphAlignment, ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { RichEditClientCommand } from '../client-command';
import { ChangeParagraphPropertiesCommandBase } from './change-paragraph-properties-command-base';
export class ToggleParagraphAlignmentCommand extends ChangeParagraphPropertiesCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.alignment;
    }
    getValueForState(val) {
        return val == this.getParagraphAlignment();
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, this.getParagraphAlignment(), this.getOppositeAlignment());
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.ToggleParagraphAlignmentCenter]: true,
            [RichEditClientCommand.ToggleParagraphAlignmentJustify]: true,
            [RichEditClientCommand.ToggleParagraphAlignmentLeft]: true,
            [RichEditClientCommand.ToggleParagraphAlignmentRight]: true,
        };
    }
    getOppositeAlignment() {
        return ParagraphAlignment.Left;
    }
}
export class ToggleParagraphAlignmentLeftCommand extends ToggleParagraphAlignmentCommand {
    getParagraphAlignment() {
        return ParagraphAlignment.Left;
    }
    getOppositeAlignment() {
        return ParagraphAlignment.Justify;
    }
}
export class ToggleParagraphAlignmentCenterCommand extends ToggleParagraphAlignmentCommand {
    getParagraphAlignment() {
        return ParagraphAlignment.Center;
    }
}
export class ToggleParagraphAlignmentRightCommand extends ToggleParagraphAlignmentCommand {
    getParagraphAlignment() {
        return ParagraphAlignment.Right;
    }
}
export class ToggleParagraphAlignmentJustifyCommand extends ToggleParagraphAlignmentCommand {
    getParagraphAlignment() {
        return ParagraphAlignment.Justify;
    }
}
