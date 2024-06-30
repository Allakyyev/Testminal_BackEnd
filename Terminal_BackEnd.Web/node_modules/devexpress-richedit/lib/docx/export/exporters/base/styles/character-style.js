import { StyleBaseExporter } from './style-base';
export class CharacterStyleExporter extends StyleBaseExporter {
    getStyleId(styleIndex) {
        return 'C' + styleIndex.toString();
    }
    getStyleIndexByName(name) {
        return this.data.model.stylesManager.characterStyleNameToIndex[name];
    }
    getType() { return 'character'; }
    exportCore(style) {
        if (style.linkedStyle)
            this.writer.writeWpStringValue('link', this.getStyleId(this.data.parStyleExporter.getStyleIndexByName(style.linkedStyle.styleName)));
        this.data.charPropsExporter.exportStyleCharacterProperties(style.maskedCharacterProperties);
    }
}
