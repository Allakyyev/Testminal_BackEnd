import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { DocumentProtectionSettings } from '../options/protection';
import { OfficeTheme } from '../themes/office-theme-base';
import { ColorModelInfo } from './color-model-info';
import { Palette } from './palette';
export class ColorProvider {
    constructor(colorModelInfoCache) {
        this.rangePermissionColors = {};
        this.rangePermissionColorIndex = 0;
        this.colorModelInfoCache = colorModelInfoCache;
        this.officeTheme = new OfficeTheme();
        this.palette = new Palette();
    }
    getRgbaFromModelColor(color) {
        return color.toRgb(this);
    }
    getModelColorFromRgba(rgba) {
        return this.colorModelInfoCache.getItem(ColorModelInfo.makeByColor(rgba));
    }
    getColor() {
        if (this.rangePermissionColorIndex >= DocumentProtectionSettings.defaultColors.length)
            this.rangePermissionColorIndex = 0;
        const result = DocumentProtectionSettings.defaultColors[this.rangePermissionColorIndex];
        this.rangePermissionColorIndex++;
        return result;
    }
    clone(colorModelInfoCache) {
        const result = new ColorProvider(colorModelInfoCache);
        result.officeTheme = this.officeTheme.clone();
        result.palette = this.palette.clone();
        result.rangePermissionColors = StringMapUtils.map(this.rangePermissionColors, val => '' + val);
        return result;
    }
}
