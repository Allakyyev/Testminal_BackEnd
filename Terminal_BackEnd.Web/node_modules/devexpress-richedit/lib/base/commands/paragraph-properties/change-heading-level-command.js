import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { ChangeParagraphPropertiesCommandBase } from './change-paragraph-properties-command-base';
export class ChangeHeadingLevelCommand extends ChangeParagraphPropertiesCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.outlineLevel;
    }
    isLockUpdateValue() {
        return true;
    }
}
