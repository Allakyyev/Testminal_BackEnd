export class CanvasUtils {
    static buildHyperlinkTipString(hyperlinkTip, clickText, settings) {
        if (!hyperlinkTip)
            hyperlinkTip = "";
        return settings.createHyperlinkTooltip(hyperlinkTip, `\nCtrl + ${clickText}`).replace(/['|"]/g, "&quot;");
    }
}
