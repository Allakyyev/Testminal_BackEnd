import { TabProperties } from '../../../../core/model/paragraph/paragraph-style';
import { TableConditionalStyle } from '../../../../core/model/tables/styles/table-conditional-style';
import { TableStyle } from '../../../../core/model/tables/styles/table-style';
import { RtfBaseStyleImporter } from './base-style-importer';
import { StylesManager } from '../../../../core/model/styles-manager';
export class RtfTableStyleImporter extends RtfBaseStyleImporter {
    get styleCollection() { return this.data.documentModel.tableStyles; }
    ;
    constructor(data) {
        super(data, true);
    }
    createEmpty() {
        return new TableStyle('', '', false, false, false, false, {}, new TableConditionalStyle(null, null, null, null, null, new TabProperties()), '');
    }
    addStyle(style) {
        const result = this.documentModel.stylesManager.addTableStyle(style);
        result.localizedName = StylesManager.getPresetTableStyleLocalizedName(style.styleName);
        return result;
    }
}
