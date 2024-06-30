import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ToggleFontItalicCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.italic;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, true, false);
    }
}
