import { DXColor } from '../../../../../core/model/color/dx-color';
export class DrawingEffectsImportHelper {
    static getColorProperty(colorValue) {
        return DXColor.fromRgb(colorValue & 0x000000FF, (colorValue & 0x0000FF00) >> 8, (colorValue & 0x00FF0000) >> 16);
    }
}
