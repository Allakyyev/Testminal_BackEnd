import { __awaiter } from "tslib";
import { ParagraphLineSpacingType, ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { Constants } from '@devexpress/utils/lib/constants';
import { WordProcessingMLValue } from '../../../../translation-table/word-processing-mlvalue';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class ParagraphSpacingDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const spacingAfter = this.data.readerHelper.getWpSTIntegerValue(reader, 'after', Constants.MIN_SAFE_INTEGER);
            if (spacingAfter >= 0)
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.spacingAfter, spacingAfter);
            const spacingBefore = this.data.readerHelper.getWpSTIntegerValue(reader, 'before', Constants.MIN_SAFE_INTEGER);
            if (spacingBefore >= 0)
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.spacingBefore, spacingBefore);
            this.paragraphProperties.setValue(ParagraphPropertyDescriptor.beforeAutoSpacing, spacingBefore == -1 ||
                this.data.readerHelper.getWpSTOnOffValue(reader, new WordProcessingMLValue('beforeAutospacing', 'before-autospacing').openXmlValue, false));
            this.paragraphProperties.setValue(ParagraphPropertyDescriptor.afterAutoSpacing, spacingAfter == -1 ||
                this.data.readerHelper.getWpSTOnOffValue(reader, new WordProcessingMLValue('afterAutospacing', 'after-autospacing').openXmlValue, false));
            const lineSpacing = this.data.readerHelper.getWpSTIntegerValue(reader, 'line', Constants.MIN_SAFE_INTEGER);
            if (lineSpacing != Constants.MIN_SAFE_INTEGER && lineSpacing > 0) {
                const attribute = new WordProcessingMLValue('lineRule', 'line-rule');
                const lineSpacingRule = reader.getAttributeNS(attribute.openXmlValue, this.data.constants.wordProcessingNamespaceConst);
                this.applyLineSpacingValue(lineSpacing, lineSpacingRule);
            }
            else if (lineSpacing != Constants.MIN_SAFE_INTEGER)
                this.setProperty(ParagraphLineSpacingType.Single);
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.lineSpacingType;
    }
    applyLineSpacingValue(lineSpacing, lineSpacingRule) {
        switch (lineSpacingRule) {
            case 'at-least':
            case 'atLeast':
                this.setProperty(ParagraphLineSpacingType.AtLeast);
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.lineSpacing, lineSpacing);
                break;
            case 'exact':
                this.setProperty(ParagraphLineSpacingType.Exactly);
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.lineSpacing, lineSpacing);
                break;
            default:
                if (lineSpacing == 240)
                    this.setProperty(ParagraphLineSpacingType.Single);
                else if (lineSpacing == 360)
                    this.setProperty(ParagraphLineSpacingType.Sesquialteral);
                else if (lineSpacing == 480)
                    this.setProperty(ParagraphLineSpacingType.Double);
                else {
                    this.setProperty(ParagraphLineSpacingType.Multiple);
                    this.paragraphProperties.setValue(ParagraphPropertyDescriptor.lineSpacing, lineSpacing / 240.0);
                }
                break;
        }
    }
}
