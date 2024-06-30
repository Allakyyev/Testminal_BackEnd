import { __awaiter } from "tslib";
import { Constants } from '@devexpress/utils/lib/constants';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { TableBorderElementDestinationBase } from './table-border-element-destination-base';
export class TableBorderElementDestination extends TableBorderElementDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const borderLineStyle = this.data.readerHelper.getWpEnumOnOffNullValue(reader, 'val', TranslationTables.borderLineStyleTable.importMap);
            if (borderLineStyle != null)
                this.setBorderLineStyle(borderLineStyle);
            const color = this.data.readerHelper.getWpSTColorOrNullValue(reader, 'color');
            if (color != null) {
                this.border.color = this.getColor(reader);
                this.properties.setValue(this.desc, this.border);
            }
            const frame = this.data.readerHelper.getWpSTOnOffNullValue(reader, 'frame');
            if (frame != null) {
                this.border.frame = frame;
                this.properties.setValue(this.desc, this.border);
            }
            const shadow = this.data.readerHelper.getWpSTOnOffNullValue(reader, 'shadow');
            if (shadow != null) {
                this.border.shadow = shadow;
                this.properties.setValue(this.desc, this.border);
            }
            const space = this.data.readerHelper.getWpSTIntegerValue(reader, 'space', Constants.MIN_SAFE_INTEGER);
            if (space != Constants.MIN_SAFE_INTEGER)
                this.setBorderOffset(space);
            const size = this.data.readerHelper.getWpSTIntegerValue(reader, 'sz', Constants.MIN_SAFE_INTEGER);
            if (size != Constants.MIN_SAFE_INTEGER)
                this.setBorderWidth(size);
        });
    }
}
