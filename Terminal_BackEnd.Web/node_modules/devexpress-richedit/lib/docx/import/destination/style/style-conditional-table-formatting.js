import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { ConditionalTableStyleFormatting } from '../../../../core/model/tables/secondary-structures/table-base-structures';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { OpenXmlStyleConditionalTableFormattingInfo } from '../../model/open-xml-style-conditional-table-formatting-info';
import { StyleDestinationBase } from './style-destination-base';
export class StyleConditionalTableFormatting extends StyleDestinationBase {
    constructor() {
        super(...arguments);
        this.conditionType = ConditionalTableStyleFormatting.WholeTable;
    }
    get elementHandlerTable() {
        return StyleDestinationBase.handlerTable;
    }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            const value = reader.getAttributeNS('type', this.data.constants.wordProcessingNamespaceConst);
            this.conditionType = !StringUtils.isNullOrEmpty(value) ?
                this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.conditionalTableStyleFormattingTypesTable.importMap, ConditionalTableStyleFormatting.WholeTable) :
                ConditionalTableStyleFormatting.WholeTable;
        });
    }
    processElementClose(reader) {
        super.processElementClose(reader);
        const result = new OpenXmlStyleConditionalTableFormattingInfo();
        result.conditionType = this.conditionType;
        result.characterFormatting = this.characterFormatting;
        result.paragraphFormatting = this.paragraphFormatting;
        result.tableProperties = this.tableProperties;
        result.tableCellProperties = this.tableCellProperties;
        result.tableRowProperties = this.tableRowProperties;
        result.tabs = this.tabs;
        this.data.stylesImporter.tableManager.conditionalTableFormattingInfoList.push(result);
    }
}
StyleConditionalTableFormatting.condtionTypesTable = new MapCreator()
    .add('band1Horz', ConditionalTableStyleFormatting.OddRowBanding)
    .add('band1Vert', ConditionalTableStyleFormatting.OddColumnBanding)
    .add('band2Horz', ConditionalTableStyleFormatting.EvenRowBanding)
    .add('band2Vert', ConditionalTableStyleFormatting.EvenColumnBanding)
    .add('firstCol', ConditionalTableStyleFormatting.FirstColumn)
    .add('firstRow', ConditionalTableStyleFormatting.FirstRow)
    .add('lastCol', ConditionalTableStyleFormatting.LastColumn)
    .add('lastRow', ConditionalTableStyleFormatting.LastRow)
    .add('neCell', ConditionalTableStyleFormatting.TopRightCell)
    .add('nwCell', ConditionalTableStyleFormatting.TopLeftCell)
    .add('seCell', ConditionalTableStyleFormatting.BottomRightCell)
    .add('swCell', ConditionalTableStyleFormatting.BottomLeftCell)
    .add('wholeTable', ConditionalTableStyleFormatting.WholeTable)
    .get();
