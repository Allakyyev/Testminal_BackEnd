import { __awaiter } from "tslib";
import { TabLeaderType } from '../../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { TabAlign } from '../../../../core/model/paragraph/paragraph';
import { TabInfo } from '../../../../core/model/paragraph/paragraph-style';
import { Constants } from '@devexpress/utils/lib/constants';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { TabsLeafElementDestination } from './tabs-leaf-element-destination';
export class TabDestination extends TabsLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const pos = this.data.readerHelper.getWpSTIntegerValue(reader, 'pos', Constants.MIN_SAFE_INTEGER);
            if (pos == Constants.MIN_SAFE_INTEGER)
                return;
            const leader = this.data.readerHelper.getWpEnumValue(reader, 'leader', TranslationTables.tabLeaderTable.importMap, TabLeaderType.None);
            const value = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            const align = StringUtils.isNullOrEmpty(value) ? TabAlign.Left :
                this.data.readerHelper.getWpEnumValueCore(value, (this.data.constants.strictMode ? TranslationTables.strictTabAlignmentTable : TranslationTables.tabAlignmentTable).importMap, TabAlign.Left);
            this.tabs.add(new TabInfo(pos, align, leader, (value == 'clear'), false));
        });
    }
}
