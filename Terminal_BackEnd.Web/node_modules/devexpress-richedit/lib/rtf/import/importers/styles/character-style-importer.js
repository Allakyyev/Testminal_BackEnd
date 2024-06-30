import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { CharacterStyle } from '../../../../core/model/character/character-style';
import { RtfBaseStyleImporter } from './base-style-importer';
import { StylesManager } from '../../../../core/model/styles-manager';
export class RtfCharacterStyleImporter extends RtfBaseStyleImporter {
    get styleCollection() { return this.data.documentModel.characterStyles; }
    ;
    constructor(data) {
        super(data, true);
    }
    addStyle(style) {
        const result = this.documentModel.stylesManager.addCharacterStyle(style);
        result.localizedName = StylesManager.getPresetCharacterStyleLocalizedName(style.styleName);
        return result;
    }
    createEmpty() {
        return new CharacterStyle('', '', false, false, false, false, new MaskedCharacterProperties(), '');
    }
}
