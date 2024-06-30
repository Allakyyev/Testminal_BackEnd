import { NumberingListIndexConstants } from '../../../../core/formats/utils/numbering-list-index-constants';
import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { MaskedParagraphProperties } from '../../../../core/model/paragraph/paragraph-properties';
import { ParagraphStyle, TabProperties } from '../../../../core/model/paragraph/paragraph-style';
import { RtfBaseStyleImporter } from './base-style-importer';
import { StylesManager } from '../../../../core/model/styles-manager';
export class RtfParagraphStyleImporter extends RtfBaseStyleImporter {
    constructor(data) {
        super(data, false);
        this.paragraphTableStyles = {};
    }
    addStyle(style) {
        const result = this.documentModel.stylesManager.addParagraphStyle(style);
        result.localizedName = StylesManager.getPresetParagraphStyleLocalizedName(style.styleName);
        return result;
    }
    ensureStyleExist() {
        this.rtfStyleIndex = Math.max(0, this.rtfStyleIndex);
        this.rtfParentStyleIndex = Math.max(0, this.rtfParentStyleIndex);
    }
    get styleCollection() { return this.data.documentModel.paragraphStyles; }
    ;
    createEmpty() {
        return new ParagraphStyle("", "", false, false, false, false, new MaskedCharacterProperties(), new MaskedParagraphProperties(), new TabProperties(), false, NumberingListIndexConstants.listIndexNotSetted, -1, "");
    }
}
