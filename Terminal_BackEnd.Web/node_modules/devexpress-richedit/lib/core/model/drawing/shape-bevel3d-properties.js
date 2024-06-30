import { PresetBevelType } from './enums';
export class ShapeBevel3DProperties {
    constructor() {
        this.presetType = ShapeBevel3DProperties.defaultPresetType;
        this.width = ShapeBevel3DProperties.defaultCoordinate;
        this.height = ShapeBevel3DProperties.defaultCoordinate;
    }
    get isDefault() {
        return this.presetType == ShapeBevel3DProperties.defaultPresetType &&
            this.height == ShapeBevel3DProperties.defaultCoordinate &&
            this.width == ShapeBevel3DProperties.defaultCoordinate;
    }
}
ShapeBevel3DProperties.defaultCoordinate = 76200;
ShapeBevel3DProperties.defaultPresetType = PresetBevelType.Circle;
