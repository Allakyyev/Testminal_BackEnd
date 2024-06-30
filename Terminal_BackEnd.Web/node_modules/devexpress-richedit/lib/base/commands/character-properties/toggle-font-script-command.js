import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { CharacterFormattingScript } from '../../../core/model/character/enums';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontScriptCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.script;
    }
}
export class ToggleFontSubscriptCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.script;
    }
    getValueForState(val) {
        return val == CharacterFormattingScript.Subscript;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, CharacterFormattingScript.Subscript, CharacterFormattingScript.Normal);
    }
}
export class ToggleFontSuperscriptCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.script;
    }
    getValueForState(val) {
        return val == CharacterFormattingScript.Superscript;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return this.convertBooleanParameterToEnumType(parameter, CharacterFormattingScript.Superscript, CharacterFormattingScript.Normal);
    }
}
