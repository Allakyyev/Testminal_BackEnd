import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { CharacterFormattingScript, StrikeoutType, UnderlineType } from '../model/character/enums';
import { ColorHelper } from '../model/color/color';
export class HtmlConverter {
    static getCssRules(charProps, textColor, isWordBox, noStrikeoutAndUnderline, important) {
        var rules = HtmlConverter.getSizeSignificantRules(charProps, important);
        rules.push(this.getForeColorRule(textColor));
        if (!noStrikeoutAndUnderline) {
            if (charProps.fontStrikeoutType != StrikeoutType.None && (isWordBox || !charProps.strikeoutWordsOnly))
                rules.push("text-decoration: line-through");
            if (charProps.fontUnderlineType != UnderlineType.None && (isWordBox || !charProps.underlineWordsOnly))
                rules.push("text-decoration: underline");
        }
        return rules;
    }
    static getForeColorRule(textColor) {
        textColor = textColor !== ColorHelper.AUTOMATIC_COLOR ? textColor : ColorHelper.BLACK_COLOR;
        return "color: " + ColorHelper.getCssStringInternal(textColor);
    }
    static getSizeSignificantCssString(characterProperties) {
        return HtmlConverter.getSizeSignificantRules(characterProperties).join(";");
    }
    static getSizeSignificantRules(characterProperties, important = true) {
        var rules = [];
        if (characterProperties.allCaps)
            rules.push("text-transform: uppercase");
        else if (characterProperties.smallCaps)
            rules.push("font-variant: small-caps");
        rules.push("font-family: " + HtmlConverter.buildFontFamilyRule(characterProperties.fontInfo.cssString) +
            (important ? HtmlConverter.importantTag : ''));
        if (characterProperties.fontBold)
            rules.push("font-weight: bold");
        if (characterProperties.fontItalic)
            rules.push("font-style: italic");
        var fontSizePx = UnitConverter.pointsToPixelsF(characterProperties.fontSize);
        if (characterProperties.script == CharacterFormattingScript.Normal)
            rules.push("font-size: " + MathUtils.round(fontSizePx, 3) + "px" + (important ? HtmlConverter.importantTag : ''));
        else {
            rules.push("font-size: " + MathUtils.round(fontSizePx * characterProperties.fontInfo.scriptMultiplier, 3) + "px" +
                (important ? HtmlConverter.importantTag : ''));
        }
        return rules;
    }
    static buildFontFamilyRule(cssString) {
        var result = cssString.replace(/"/g, "&quot;");
        if (result.replace(/</g, '&lt;').replace(/>/g, '&gt;') != result)
            result = result.replace(/'/g, "&quot;");
        return result;
    }
}
HtmlConverter.importantTag = ' !important';
