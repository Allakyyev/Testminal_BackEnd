import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { CharacterPropertyDescriptor } from '../../../../core/model/character/character-property-descriptor';
import { ElementDestination } from '../destination';
export class SymbolDestination extends ElementDestination {
    get elementHandlerTable() {
        return {};
    }
    processElementOpen(reader) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const fontName = reader.getAttributeNS('font', this.data.constants.wordProcessingNamespaceConst);
            const code = reader.getAttributeNS('char', this.data.constants.wordProcessingNamespaceConst);
            if (StringUtils.isNullOrEmpty(fontName) || StringUtils.isNullOrEmpty(code))
                return;
            const charCode = parseInt(code, 16);
            if (isNaN(charCode))
                return;
            const symbol = String.fromCharCode(charCode);
            const characterFormatting = this.data.subDocumentInfo.characterImporter.properties;
            const prevFormatting = characterFormatting.clone();
            const fontInfo = (_a = this.documentModel.cache.fontInfoCache.getItemByName(fontName)) !== null && _a !== void 0 ? _a : this.documentModel.cache.fontInfoCache.addFont(fontName);
            characterFormatting.setValue(CharacterPropertyDescriptor.fontInfo, fontInfo);
            this.data.subDocumentInfo.characterImporter.insertText(symbol);
            this.data.subDocumentInfo.characterImporter.resetProperties();
            this.data.subDocumentInfo.characterImporter.properties.copyFrom(prevFormatting);
        });
    }
}
