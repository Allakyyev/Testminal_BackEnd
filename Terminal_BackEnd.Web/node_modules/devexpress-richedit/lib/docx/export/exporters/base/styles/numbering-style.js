import { StyleBaseExporter } from './style-base';
export class NumberingStyleExporter extends StyleBaseExporter {
    getStyleId(styleIndex) {
        return 'N' + styleIndex.toString();
    }
    getStyleIndexByName(name) {
        return this.data.model.stylesManager.characterStyleNameToIndex[name];
    }
    getType() { return ''; }
    exportCore(_style) {
    }
}
