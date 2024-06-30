import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { UnderlineType } from '../../../core/model/character/enums';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontUnderlineCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.underlineType;
    }
}
export class ToggleFontSingleUnderlineCommand extends ChangeFontUnderlineCommand {
    getActualValue(_parameter, currentValue) {
        return currentValue ? UnderlineType.None : UnderlineType.Single;
    }
    getValueForState(val) {
        return val == UnderlineType.Single;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, UnderlineType.Single, UnderlineType.None);
    }
}
export class ToggleFontDoubleUnderlineCommand extends ChangeFontUnderlineCommand {
    getActualValue(_parameter, currentValue) {
        return currentValue ? UnderlineType.None : UnderlineType.Double;
    }
    getValueForState(val) {
        return val == UnderlineType.Double;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, UnderlineType.Double, UnderlineType.None);
    }
}
