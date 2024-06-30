import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { StrikeoutType } from '../../../core/model/character/enums';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ToggleFontStrikeoutCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.strikeoutType;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, StrikeoutType.Single, StrikeoutType.None);
    }
}
