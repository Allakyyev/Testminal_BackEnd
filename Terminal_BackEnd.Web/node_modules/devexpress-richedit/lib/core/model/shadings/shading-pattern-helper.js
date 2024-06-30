import { DXColor } from '../color/dx-color';
import { ShadingPattern } from './shading-pattern';
class ShadingPatternInfo {
    constructor(shadingPatternValue, shadingPattern) {
        this.shadingPatternValue = shadingPatternValue;
        this.shadingPattern = shadingPattern;
    }
}
export class ShadingHelper {
    static initStatics() {
        ShadingHelper.infos = [
            new ShadingPatternInfo(0, ShadingPattern.Clear),
            new ShadingPatternInfo(25, ShadingPattern.Pct2),
            new ShadingPatternInfo(50, ShadingPattern.Pct5),
            new ShadingPatternInfo(75, ShadingPattern.Pct7),
            new ShadingPatternInfo(100, ShadingPattern.Pct10),
            new ShadingPatternInfo(125, ShadingPattern.Pct12),
            new ShadingPatternInfo(150, ShadingPattern.Pct15),
            new ShadingPatternInfo(175, ShadingPattern.Pct17),
            new ShadingPatternInfo(200, ShadingPattern.Pct20),
            new ShadingPatternInfo(225, ShadingPattern.Pct22),
            new ShadingPatternInfo(250, ShadingPattern.Pct25),
            new ShadingPatternInfo(275, ShadingPattern.Pct27),
            new ShadingPatternInfo(300, ShadingPattern.Pct30),
            new ShadingPatternInfo(325, ShadingPattern.Pct32),
            new ShadingPatternInfo(350, ShadingPattern.Pct35),
            new ShadingPatternInfo(375, ShadingPattern.Pct37),
            new ShadingPatternInfo(400, ShadingPattern.Pct40),
            new ShadingPatternInfo(425, ShadingPattern.Pct42),
            new ShadingPatternInfo(450, ShadingPattern.Pct45),
            new ShadingPatternInfo(475, ShadingPattern.Pct47),
            new ShadingPatternInfo(500, ShadingPattern.Pct50),
            new ShadingPatternInfo(525, ShadingPattern.Pct52),
            new ShadingPatternInfo(550, ShadingPattern.Pct55),
            new ShadingPatternInfo(575, ShadingPattern.Pct57),
            new ShadingPatternInfo(600, ShadingPattern.Pct60),
            new ShadingPatternInfo(625, ShadingPattern.Pct62),
            new ShadingPatternInfo(650, ShadingPattern.Pct65),
            new ShadingPatternInfo(675, ShadingPattern.Pct67),
            new ShadingPatternInfo(700, ShadingPattern.Pct70),
            new ShadingPatternInfo(725, ShadingPattern.Pct72),
            new ShadingPatternInfo(750, ShadingPattern.Pct75),
            new ShadingPatternInfo(775, ShadingPattern.Pct77),
            new ShadingPatternInfo(800, ShadingPattern.Pct80),
            new ShadingPatternInfo(825, ShadingPattern.Pct82),
            new ShadingPatternInfo(850, ShadingPattern.Pct85),
            new ShadingPatternInfo(875, ShadingPattern.Pct87),
            new ShadingPatternInfo(900, ShadingPattern.Pct90),
            new ShadingPatternInfo(925, ShadingPattern.Pct92),
            new ShadingPatternInfo(950, ShadingPattern.Pct95),
            new ShadingPatternInfo(975, ShadingPattern.Pct97),
            new ShadingPatternInfo(1000, ShadingPattern.Solid),
        ];
        ShadingHelper.shadingPatterns = {};
        ShadingHelper.patternMultipliers = {};
        for (let info of ShadingHelper.infos) {
            ShadingHelper.shadingPatterns[info.shadingPatternValue] = info.shadingPattern;
            ShadingHelper.patternMultipliers[info.shadingPattern] = info.shadingPatternValue;
        }
        return ShadingHelper.infos;
    }
    static calculateShadingPattern(shadingPatternValue) {
        const value = ShadingHelper.shadingPatterns[shadingPatternValue];
        return value === undefined ? ShadingPattern.Clear : value;
    }
    static getShadingPattern(index) {
        return ShadingHelper.infos[index].shadingPattern;
    }
    static calculateShadingPatternValue(shadingPattern) {
        const value = ShadingHelper.patternMultipliers[shadingPattern];
        return value === undefined ? -1 : value;
    }
    static getActualBackColor(fill, patternColor, pattern) {
        if (pattern == ShadingPattern.Clear || pattern == ShadingPattern.Nil)
            return fill;
        const white = DXColor.white;
        if ((DXColor.isTransparentOrEmpty(fill) || fill == white) && DXColor.isTransparentOrEmpty(patternColor)) {
            const multiplier = ShadingHelper.patternMultipliers[pattern];
            if (multiplier !== undefined) {
                const intensity = 255 * (1000 - multiplier) / 1000;
                return DXColor.fromRgb(intensity, intensity, intensity);
            }
        }
        return pattern != ShadingPattern.Solid && !DXColor.isTransparentOrEmpty(fill) ? fill : patternColor;
    }
    static getActualBackColorByMultiplier(fill, patternColor, multiplier) {
        const white = DXColor.white;
        if ((DXColor.isTransparentOrEmpty(fill) || fill == white) && DXColor.isTransparentOrEmpty(patternColor)) {
            const intensity = 255 * (1000 - multiplier) / 1000;
            return DXColor.fromRgb(intensity, intensity, intensity);
        }
        return multiplier == 1000 ? fill : patternColor;
    }
}
ShadingHelper.infos = ShadingHelper.initStatics();
