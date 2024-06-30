import { __awaiter } from "tslib";
import { ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class OutlineLevelDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const level = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', 9);
            this.setProperty(level < 0 || level >= 9 ? 0 : level + 1);
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.outlineLevel;
    }
}
