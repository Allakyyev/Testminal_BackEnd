import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { LineSpacingParagraphCommandBase } from './add-spacing-after-paragraph-command';
export class RemoveSpacingAfterParagraphCommand extends LineSpacingParagraphCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.spacingAfter;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter != null ? parameter : 0;
    }
    isEnabled() {
        return super.isEnabled() && this.inputPosition.getMergedParagraphPropertiesFull().spacingAfter > 0;
    }
}
