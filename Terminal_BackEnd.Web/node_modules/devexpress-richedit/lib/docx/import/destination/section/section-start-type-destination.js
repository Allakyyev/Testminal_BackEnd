import { __awaiter } from "tslib";
import { SectionStartType } from '../../../../core/model/section/enums';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { LeafElementDestination } from '../destination';
export class SectionStartTypeDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.sectionImporter.properties.startType = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.sectionStartTypeTable.importMap, SectionStartType.NextPage);
        });
    }
}
