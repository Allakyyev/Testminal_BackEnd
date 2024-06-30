import { BaseExporter } from '../../base';
export class StyleBaseExporter extends BaseExporter {
    export(style, styleIndex) {
        if (style.deleted)
            return;
        this.writer.writeWpStartElement('style');
        this.writer.writeWpStringAttr('type', this.getType());
        this.writer.writeWpStringAttr('styleId', this.getStyleId(styleIndex));
        if (styleIndex == 0)
            this.writer.writeWpBoolAttr('default', true);
        if (style.hidden)
            this.writer.writeWpEmptyElement('hidden');
        if (style.semihidden)
            this.writer.writeWpEmptyElement('semiHidden');
        this.exportStyleName(style);
        this.exportParentStyle(style);
        this.exportCore(style);
        this.writer.writeWpBoolValueAsTag('qFormat', style.primary);
        this.writer.endElement();
    }
    exportStyleName(style) {
        this.writer.writeWpStringValue('name', style.styleName);
    }
    exportParentStyle(style) {
        if (style.parent != null)
            this.writer.writeWpStringValue('basedOn', this.getStyleId(this.getStyleIndexByName(style.parent.styleName)));
    }
}
