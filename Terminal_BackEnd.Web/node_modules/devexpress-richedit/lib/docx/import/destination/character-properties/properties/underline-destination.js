import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { CharacterPropertiesMask, UnderlineType } from '../../../../../core/model/character/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { DocxNsType } from '../../../../utils/constants';
import { OpenXmlColorImportHelper } from '../../../color/open-xml-color-import-helper';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class UnderlineDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.importUnderlineType(reader);
            this.importUnderlineColor(reader);
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.underlineType;
    }
    importUnderlineType(reader) {
        const value = reader.getAttributeNS('val', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        if (!StringUtils.isNullOrEmpty(value)) {
            if (value == 'words') {
                this.setProperty(UnderlineType.Single);
                this.characterProperties.underlineWordsOnly = true;
                this.characterProperties.setUseValue(CharacterPropertiesMask.UseUnderlineWordsOnly, true);
            }
            else
                this.setProperty(TranslationTables.underlineTables.getValueOnImport(value, UnderlineType.Single));
        }
        else
            this.setProperty(UnderlineType.None);
    }
    importUnderlineColor(reader) {
        const colorModelInfo = OpenXmlColorImportHelper.createColorModelInfo(this.data, reader, 'color');
        this.characterProperties.underlineColor = this.data.documentModel.cache.colorModelInfoCache.getItem(colorModelInfo);
        this.characterProperties.setUseValue(CharacterPropertiesMask.UseUnderlineColorIndex, true);
    }
}
