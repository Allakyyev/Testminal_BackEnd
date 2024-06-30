import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ToggleFontBoldCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.bold;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, true, false);
    }
}
