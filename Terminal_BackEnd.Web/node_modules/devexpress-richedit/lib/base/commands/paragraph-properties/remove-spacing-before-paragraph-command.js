import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { LineSpacingParagraphCommandBase } from './add-spacing-after-paragraph-command';
export class RemoveSpacingBeforeParagraphCommand extends LineSpacingParagraphCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.spacingBefore;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter != null ? parameter : 0;
    }
    isEnabled() {
        return super.isEnabled() && this.inputPosition.getMergedParagraphPropertiesFull().spacingBefore > 0;
    }
}
