import { __awaiter } from "tslib";
import { OpenXmlColorImportHelper } from '../../color/open-xml-color-import-helper';
import { LeafElementDestination } from '../destination';
export class BackgroundDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.documentModel.setPageColor(this.documentModel.cache.colorModelInfoCache.getItem(OpenXmlColorImportHelper.createColorModelInfo(this.data, reader, 'color')).
                toRgb(this.data.documentModel.colorProvider));
        });
    }
}
