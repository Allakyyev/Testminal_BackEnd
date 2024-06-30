import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontHighlightColorCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.highlightColor;
    }
    getValueForState(val) {
        return val ? val.toRgb(this.control.modelManager.model.colorProvider) : undefined;
    }
    isLockUpdateValue() {
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorModelInfo.makeByColor(ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR));
    }
}
export class ChangeFontShadingInfoCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.shadingInfo;
    }
    getValueForState(val) {
        return val ? val.getActualColor(this.colorProvider) : undefined;
    }
    isLockUpdateValue() {
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ShadingInfo.createByColor(ColorModelInfo.makeByColor(ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR)));
    }
}
