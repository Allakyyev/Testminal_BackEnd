import { __awaiter } from "tslib";
import { BorderLineStyle } from '../../../../core/model/borders/enums';
import { DXColor } from '../../../../core/model/color/dx-color';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { TableBorderElementDestinationBase } from './table-border-element-destination-base';
export class TableCellBorderElementDestination extends TableBorderElementDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const borderLineStyle = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.borderLineStyleTable.importMap, BorderLineStyle.None);
            const color = this.data.readerHelper.getWpSTColorValue(reader, 'color');
            const colorModel = this.getColor(reader);
            const frame = this.data.readerHelper.getWpSTOnOffValue(reader, 'frame', false);
            const shadow = this.data.readerHelper.getWpSTOnOffValue(reader, 'shadow', false);
            const offset = this.data.readerHelper.getWpSTIntegerValue(reader, 'space', 0);
            const width = this.data.readerHelper.getWpSTIntegerValue(reader, 'sz', 0);
            const isDefaultValue = borderLineStyle == BorderLineStyle.None && color == DXColor.empty &&
                frame == false && shadow == false && offset == 0 && width == 0;
            if (!isDefaultValue) {
                this.border.color = colorModel;
                this.border.frame = frame;
                this.border.shadow = shadow;
                this.setBorderOffset(offset);
                this.setBorderWidth(width);
                this.setBorderLineStyle(borderLineStyle);
            }
        });
    }
}
