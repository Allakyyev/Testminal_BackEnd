import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontColorCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.textColor;
    }
    getValueForState(val) {
        return val ? val.toRgb(this.control.modelManager.model.colorProvider) : undefined;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorModelInfo.makeByColor(ColorHelper.anyToColor(parameter, ColorHelper.AUTOMATIC_COLOR));
    }
    isLockUpdateValue() {
        return true;
    }
}
