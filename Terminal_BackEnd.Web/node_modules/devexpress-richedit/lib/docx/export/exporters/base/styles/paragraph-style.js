import { StyleBaseExporter } from './style-base';
export class ParagraphStyleExporter extends StyleBaseExporter {
    getStyleId(styleIndex) {
        return 'P' + styleIndex.toString();
    }
    getStyleIndexByName(name) {
        return this.data.model.stylesManager.paragraphStyleNameToIndex[name];
    }
    getType() { return 'paragraph'; }
    exportCore(style) {
        if (style.nextParagraphStyle != null)
            this.writer.writeWpStringValue('next', this.getStyleId(this.getStyleIndexByName(style.nextParagraphStyle.styleName)));
        if (style.linkedStyle)
            this.writer.writeWpStringValue('link', this.getStyleId(this.data.charStyleExporter.getStyleIndexByName(style.linkedStyle.styleName)));
        if (style.autoUpdate)
            this.writer.writeWpBoolValue('autoRedefine', style.autoUpdate);
        this.data.parPropsExporter.exportStyleParagraphProperties(style.maskedParagraphProperties, style.tabs, style.numberingListIndex, style.listLevelIndex);
        this.data.charPropsExporter.exportStyleCharacterProperties(style.maskedCharacterProperties);
    }
}
