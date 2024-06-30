import { StyleBase } from '../../style-base';
export class TableCellStyle extends StyleBase {
    constructor(styleName, localizedName, deleted, hidden, semihidden, isDefault, tableCellProperties, characterProperties) {
        super(styleName, localizedName, deleted, hidden, semihidden, isDefault);
        this.tableCellProperties = tableCellProperties;
        this.characterProperties = characterProperties;
    }
    clone() {
        return new TableCellStyle(this.styleName, this.localizedName, this.deleted, this.hidden, this.semihidden, this.isDefault, this.tableCellProperties, this.characterProperties);
    }
}
TableCellStyle.DEFAULT_STYLENAME = "";
