import { __awaiter } from "tslib";
import { BorderInfo } from '../../../../../../core/model/borders/border-info';
import { BorderLineStyle } from '../../../../../../core/model/borders/enums';
import { ColorModelInfo } from '../../../../../../core/model/color/color-model-info';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Constants } from '@devexpress/utils/lib/constants';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { OpenXmlColorImportHelper } from '../../../../color/open-xml-color-import-helper';
import { ParagraphFormattingLeafElementDestination } from '../../paragraph-formatting-leaf-element-destination';
export class ParagraphBorderDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const borderLineStyle = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.borderLineStyleTable.importMap, BorderLineStyle.None);
            const colorModelInfo = this.data.documentModel.cache.colorModelInfoCache.getItem(OpenXmlColorImportHelper.createColorModelInfo(this.data, reader, 'color'));
            const frame = this.data.readerHelper.getWpSTOnOffValue(reader, 'frame', false);
            const shadow = this.data.readerHelper.getWpSTOnOffValue(reader, 'shadow', false);
            const isDefaultValue = borderLineStyle == BorderLineStyle.None && colorModelInfo.equals(ColorModelInfo.empty) &&
                frame == false && shadow == false;
            const border = new BorderInfo();
            if (!isDefaultValue) {
                border.style = borderLineStyle;
                border.color = colorModelInfo;
                border.frame = frame;
                border.shadow = shadow;
            }
            const offset = this.data.readerHelper.getWpSTIntegerValue(reader, 'space');
            if (offset != Constants.MIN_SAFE_INTEGER)
                border.offset = UnitConverter.pointsToTwips(offset);
            const width = this.data.readerHelper.getWpSTIntegerValue(reader, 'sz');
            if (width != Constants.MIN_SAFE_INTEGER)
                border.width = UnitConverter.pointsToTwipsF(width * 0.125);
            this.setProperty(border);
        });
    }
}
