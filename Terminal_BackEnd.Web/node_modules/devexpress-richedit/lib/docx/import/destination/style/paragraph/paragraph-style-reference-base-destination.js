import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../../destination';
export class ParagraphStyleReferenceBaseDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(value)) {
                const style = this.data.stylesImporter.paragraphManager.getStyleById(value);
                if (style)
                    this.assignParagraphStyle(style);
            }
        });
    }
}
