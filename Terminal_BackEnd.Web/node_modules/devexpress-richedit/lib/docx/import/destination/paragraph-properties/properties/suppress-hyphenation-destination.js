import { __awaiter } from "tslib";
import { ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class SuppressHyphenationDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setProperty(this.data.readerHelper.getWpSTOnOffValue(reader, 'val'));
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.suppressHyphenation;
    }
}
