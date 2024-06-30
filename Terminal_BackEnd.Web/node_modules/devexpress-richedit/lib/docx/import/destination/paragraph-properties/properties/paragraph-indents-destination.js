import { __awaiter } from "tslib";
import { ParagraphFirstLineIndent, ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { Constants } from '@devexpress/utils/lib/constants';
import { WordProcessingMLValue } from '../../../../translation-table/word-processing-mlvalue';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class ParagraphIndentsDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let left = this.data.readerHelper.getWpSTIntegerValue(reader, 'left', Constants.MIN_SAFE_INTEGER);
            if (left == Constants.MIN_SAFE_INTEGER)
                left = this.data.readerHelper.getWpSTIntegerValue(reader, 'start', Constants.MIN_SAFE_INTEGER);
            if (left != Constants.MIN_SAFE_INTEGER)
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.leftIndent, left);
            let right = this.data.readerHelper.getWpSTIntegerValue(reader, 'right', Constants.MIN_SAFE_INTEGER);
            if (right == Constants.MIN_SAFE_INTEGER)
                right = this.data.readerHelper.getWpSTIntegerValue(reader, 'end', Constants.MIN_SAFE_INTEGER);
            if (right != Constants.MIN_SAFE_INTEGER)
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.rightIndent, right);
            const firstLineAttributeName = new WordProcessingMLValue('firstLine', 'first-line');
            const firstLine = this.data.readerHelper.getWpSTIntegerValue(reader, firstLineAttributeName.openXmlValue, Constants.MIN_SAFE_INTEGER);
            if (firstLine != Constants.MIN_SAFE_INTEGER) {
                if (firstLine > 0)
                    this.setProperty(ParagraphFirstLineIndent.Indented);
                else if (firstLine < 0)
                    this.setProperty(ParagraphFirstLineIndent.Hanging);
                else
                    this.setProperty(ParagraphFirstLineIndent.None);
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.firstLineIndent, Math.abs(firstLine));
            }
            const hanging = this.data.readerHelper.getWpSTIntegerValue(reader, 'hanging', Constants.MIN_SAFE_INTEGER);
            if (hanging != Constants.MIN_SAFE_INTEGER) {
                if (hanging > 0)
                    this.setProperty(ParagraphFirstLineIndent.Hanging);
                else if (hanging < 0)
                    this.setProperty(ParagraphFirstLineIndent.Indented);
                else
                    this.setProperty(ParagraphFirstLineIndent.None);
                this.paragraphProperties.setValue(ParagraphPropertyDescriptor.firstLineIndent, Math.abs(hanging));
            }
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.firstLineIndentType;
    }
}
