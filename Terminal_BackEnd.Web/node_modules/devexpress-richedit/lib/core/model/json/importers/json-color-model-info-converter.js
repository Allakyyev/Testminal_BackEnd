import { ColorModelInfo } from '../../color/color-model-info';
import { ColorType } from '../../color/enums';
import { JSONColorModelInfoProperty } from '../enums/json-character-enums';
export class JSONColorModelInfoConverter {
    static convertFromJSON(obj) {
        switch (obj[JSONColorModelInfoProperty.ColorType]) {
            case ColorType.Auto:
                return ColorModelInfo.auto;
            case ColorType.Index:
                return ColorModelInfo.makeByColorIndex(obj[JSONColorModelInfoProperty.ColorIndex], obj[JSONColorModelInfoProperty.Tint]);
            case ColorType.Rgb:
                return ColorModelInfo.makeByColor(obj[JSONColorModelInfoProperty.Rgb], obj[JSONColorModelInfoProperty.Tint]);
            case ColorType.Theme:
                return ColorModelInfo.makeByThemeColorIndex(obj[JSONColorModelInfoProperty.ThemeColorIndex], obj[JSONColorModelInfoProperty.Tint]);
        }
    }
    static convertToJSON(source) {
        return source.toJSON();
    }
}
