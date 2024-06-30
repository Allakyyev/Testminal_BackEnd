import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { RichEditClientCommand } from '../client-command';
import { ChangeParagraphPropertiesCommandBase } from './change-paragraph-properties-command-base';
export class LineSpacingParagraphCommandBase extends ChangeParagraphPropertiesCommandBase {
    getRelatedCommands() {
        return {
            [RichEditClientCommand.AddSpacingAfterParagraph]: true,
            [RichEditClientCommand.AddSpacingBeforeParagraph]: true,
            [RichEditClientCommand.SetSingleParagraphSpacing]: true,
            [RichEditClientCommand.SetSesquialteralParagraphSpacing]: true,
            [RichEditClientCommand.SetDoubleParagraphSpacing]: true,
            [RichEditClientCommand.RemoveSpacingAfterParagraph]: true,
            [RichEditClientCommand.RemoveSpacingBeforeParagraph]: true,
        };
    }
}
export class AddSpacingAfterParagraphCommand extends LineSpacingParagraphCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.spacingAfter;
    }
    isEnabled() {
        return super.isEnabled() && this.getCurrentValue() === 0;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter == null ? UnitConverter.pointsToTwips(12) : parameter;
    }
}
