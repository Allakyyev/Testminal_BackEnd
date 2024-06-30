import { StrikeoutType, UnderlineType } from '../../core/model/character/enums';
import { ColorHelper } from '../../core/model/color/color';
export class CharacterPropertiesExportHelper {
    static ShouldExportInlinePictureRunCharacterProperties(props, colorProvider) {
        return (props.hidden) ||
            (props.fontUnderlineType != UnderlineType.None) ||
            (props.fontStrikeoutType != StrikeoutType.None) ||
            (props.highlightColor.toRgb(colorProvider) != ColorHelper.NO_COLOR) ||
            (props.shadingInfo.getActualColor(colorProvider) != ColorHelper.NO_COLOR);
    }
}
