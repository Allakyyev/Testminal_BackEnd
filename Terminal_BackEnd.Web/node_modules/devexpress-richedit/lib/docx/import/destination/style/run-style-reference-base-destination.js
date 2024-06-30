import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../destination';
export class RunStyleReferenceBaseDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const styleId = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(styleId)) {
                const style = this.data.stylesImporter.characterManager.getStyleById(styleId);
                if (style)
                    this.assignCharacterStyle(style);
            }
        });
    }
}
