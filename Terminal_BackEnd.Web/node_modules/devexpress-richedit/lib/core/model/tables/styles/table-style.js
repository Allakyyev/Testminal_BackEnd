import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StyleBase } from '../../style-base';
export class TableStyle extends StyleBase {
    constructor(styleName, localizedName, deleted, hidden, semihidden, isDefault, conditionalStyles, baseConditionalStyle, base64EncodedImage, id) {
        super(styleName, localizedName, deleted, hidden, semihidden, isDefault, base64EncodedImage, id);
        this.conditionalStyles = {};
        this.conditionalStyles = conditionalStyles;
        this.baseConditionalStyle = baseConditionalStyle;
    }
    clone() {
        const newStyle = new TableStyle(this.styleName, this.localizedName, this.deleted, this.hidden, this.semihidden, this.isDefault, NumberMapUtils.map(this.conditionalStyles, cs => cs.clone()), this.baseConditionalStyle.clone(), this.base64EncodedImage, this.id);
        return newStyle;
    }
}
TableStyle.SIMPLE_STYLENAME = "Table Simple 1";
TableStyle.DEFAULT_STYLENAME = "Normal Table";
TableStyle.DEFAULT_STYLENAME_2 = "Table Normal";
