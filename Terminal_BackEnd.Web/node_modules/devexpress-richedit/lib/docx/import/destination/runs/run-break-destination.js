import { __awaiter } from "tslib";
import { RichUtils } from '../../../../core/model/rich-utils';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { LeafElementDestination } from '../destination';
export class RunBreakDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const breakCharacterAsCode = this.data.readerHelper.getWpEnumValue(reader, 'type', TranslationTables.runBreaksTable.importMap, RichUtils.specialCharacters.LineBreak.charCodeAt(0));
            this.data.subDocumentInfo.characterImporter.insertText(String.fromCharCode(breakCharacterAsCode));
        });
    }
}
