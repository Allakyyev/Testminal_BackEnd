import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { WordProcessingMLValue } from '../../../../translation-table/word-processing-mlvalue';
import { DocxNsType } from '../../../../utils/constants';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class FontNameDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const fontName = this.readFontName(reader);
            if (!StringUtils.isNullOrEmpty(fontName)) {
                const fontInfo = this.documentModel.cache.fontInfoCache.getItemByName(fontName);
                this.setProperty(fontInfo ? fontInfo : this.documentModel.cache.fontInfoCache.addFont(fontName, fontName));
            }
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.fontInfo;
    }
    readFontName(reader) {
        let value = reader.getAttributeNS('ascii', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        if (!StringUtils.isNullOrEmpty(value))
            return value;
        const attribute = new WordProcessingMLValue('hAnsi', 'h-ansi');
        value = reader.getAttributeNS(attribute.openXmlValue, this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        return StringUtils.isNullOrEmpty(value) ? '' : value;
    }
}
