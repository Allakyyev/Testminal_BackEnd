import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { OpenXmlColorImportHelper } from '../../../color/open-xml-color-import-helper';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class ForeColorDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const colorModelInfo = OpenXmlColorImportHelper.createColorModelInfo(this.data, reader, 'val', true);
            if (colorModelInfo != null)
                this.setProperty(this.data.documentModel.cache.colorModelInfoCache.getItem(colorModelInfo));
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.textColor;
    }
}
