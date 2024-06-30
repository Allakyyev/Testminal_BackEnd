import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
export class HtmlImporterFontUtils {
    static getFontSize(font, parentFont) {
        const fontSize = HtmlImporterFontUtils.getFontSizeCore(font);
        if (fontSize !== null)
            return fontSize;
        const parentFontSize = HtmlImporterFontUtils.getFontSizeCore(parentFont);
        const currentFontSize = parentFontSize !== null ? parentFontSize : 12;
        if (font.indexOf("em") > 0)
            return parseInt(font) * currentFontSize;
        if (font.indexOf("%") > 0)
            return parseInt(font) * currentFontSize / 100;
        return null;
    }
    static getFontSizeCore(font) {
        if (!font)
            return null;
        if (font.indexOf("px") > 0)
            return UnitConverter.pixelsToPoints(parseInt(font));
        if (font.indexOf("pt") > 0)
            return parseInt(font);
        return null;
    }
}
