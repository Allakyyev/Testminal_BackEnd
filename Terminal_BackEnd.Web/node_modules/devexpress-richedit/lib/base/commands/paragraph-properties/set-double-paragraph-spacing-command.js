import { ParagraphLineSpacingType, ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { LineSpacingParagraphCommandBase } from './add-spacing-after-paragraph-command';
export class SetParagraphSpacingTypeCommandBase extends LineSpacingParagraphCommandBase {
    getDescriptor() {
        return ParagraphPropertyDescriptor.lineSpacingType;
    }
    getValueForState(val) {
        return val == this.getSpacingType();
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, this.getSpacingType(), this.getSpacingType());
    }
}
export class SetSingleParagraphSpacingCommand extends SetParagraphSpacingTypeCommandBase {
    getSpacingType() {
        return ParagraphLineSpacingType.Single;
    }
}
export class SetSesquialteralParagraphSpacingCommand extends SetParagraphSpacingTypeCommandBase {
    getSpacingType() {
        return ParagraphLineSpacingType.Sesquialteral;
    }
}
export class SetDoubleParagraphSpacingCommand extends SetParagraphSpacingTypeCommandBase {
    getSpacingType() {
        return ParagraphLineSpacingType.Double;
    }
}
