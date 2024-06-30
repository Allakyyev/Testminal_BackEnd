import { ColorModelInfoCache } from '../../../core/model/caches/hashed-caches/color-model-info-cache';
import { DXColor } from '../../../core/model/color/dx-color';
import { ShadingHelper } from '../../../core/model/shadings/shading-pattern-helper';
export class RtfShadingInfoExportHelper {
    static exportShadingPattern(rtfBuilder, colorProvider, info, command) {
        const shadingPatternValue = ShadingHelper.calculateShadingPatternValue(info.shadingPattern);
        if (shadingPatternValue >= 0) {
            if (DXColor.isTransparentOrEmpty(info.backColor.toRgb(colorProvider)) && ColorModelInfoCache.defaultItem.equals(info.foreColor) && shadingPatternValue == 0)
                return;
            rtfBuilder.writeIntegerCommand(command, shadingPatternValue * 10);
        }
    }
    static exportShadingForeColorIndex(rtfBuilder, helper, colorProvider, info, command) {
        if (!ColorModelInfoCache.defaultItem.equals(info.foreColor)) {
            RtfShadingInfoExportHelper.exportShadingColorIndexCore(rtfBuilder, helper, colorProvider, info.foreColor, command);
        }
    }
    static exportShadingBackColorIndex(rtfBuilder, helper, colorProvider, info, command) {
        if (!ColorModelInfoCache.defaultItem.equals(info.backColor))
            RtfShadingInfoExportHelper.exportShadingColorIndexCore(rtfBuilder, helper, colorProvider, info.backColor, command);
    }
    static exportShadingColorIndexCore(rtfBuilder, helper, colorProvider, color, command) {
        if (ColorModelInfoCache.defaultItem.equals(color) || DXColor.isTransparentOrEmpty(color.toRgb(colorProvider)))
            return;
        const rtfColorIndex = helper.getColorIndex(color);
        rtfBuilder.writeIntegerCommand(command, rtfColorIndex);
    }
}
