import { __awaiter } from "tslib";
import { ParagraphAlignment, ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class ParagraphAlignmentDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(value))
                this.setProperty(this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.paragraphAlignmentTable.importMap, ParagraphAlignment.Left));
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.alignment;
    }
}
