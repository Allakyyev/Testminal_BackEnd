import { __awaiter } from "tslib";
import { LeafElementDestination } from '../destination';
import { LineNumberDefaults } from '../../../../core/model/section/line-numbering-properties';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { Constants } from '@devexpress/utils/lib/constants';
export class SectionLineNumberingDestination extends LeafElementDestination {
    get secProps() {
        return this.data.sectionImporter.properties;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineNumber = this.secProps.lineNumbering;
            lineNumber.countBy = Math.max(0, this.data.readerHelper.getWpSTIntegerValue(reader, 'countBy', LineNumberDefaults.countBy));
            const start = this.data.readerHelper.getWpSTIntegerValue(reader, 'start', Constants.MIN_SAFE_INTEGER);
            if (start !== Constants.MIN_SAFE_INTEGER)
                lineNumber.start = Math.max(0, start) + 1;
            const distance = this.data.readerHelper.getWpSTIntegerValue(reader, 'distance', LineNumberDefaults.distance);
            if (distance >= 0)
                lineNumber.distance = distance;
            lineNumber.restart = this.data.readerHelper.getWpEnumValue(reader, 'restart', TranslationTables.lineNumberingRestartTable.importMap, LineNumberDefaults.restart);
        });
    }
}
