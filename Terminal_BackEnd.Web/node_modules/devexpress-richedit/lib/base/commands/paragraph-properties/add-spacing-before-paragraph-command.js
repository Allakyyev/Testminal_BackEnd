import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { LineSpacingParagraphCommandBase } from './add-spacing-after-paragraph-command';
export class AddSpacingBeforeParagraphCommand extends LineSpacingParagraphCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.spacingBefore;
    }
    isEnabled() {
        return super.isEnabled() && this.getCurrentValue() === 0;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter == null ? UnitConverter.pointsToTwips(12) : parameter;
    }
}
