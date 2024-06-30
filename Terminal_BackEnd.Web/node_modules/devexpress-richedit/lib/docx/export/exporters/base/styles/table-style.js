import { CharacterPropertiesMask } from '../../../../../core/model/character/enums';
import { NumberingList } from '../../../../../core/model/numbering-lists/numbering-list';
import { ParagraphPropertiesMask } from '../../../../../core/model/paragraph/paragraph-properties';
import { ConditionalTableStyleFormatting } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { WriterHelper } from '../../../utils/writer-helper';
import { TableCellPropertiesExporter } from '../table/table-cell-properties';
import { TableRowPropertiesExporter } from '../table/table-row-properties';
import { StyleBaseExporter } from './style-base';
export class TableStyleExporter extends StyleBaseExporter {
    getStyleId(styleIndex) {
        return 'T' + styleIndex.toString();
    }
    getStyleIndexByName(name) {
        return this.data.model.stylesManager.tableStyleNameToIndex[name];
    }
    getType() { return 'table'; }
    exportCore(style) {
        this.exportTableConditionalStyle(style.baseConditionalStyle);
        if (style.conditionalStyles && !NumberMapUtils.isEmpty(style.conditionalStyles)) {
            NumberMapUtils.forEach(style.conditionalStyles, (condStyle, styleType) => {
                if (condStyle) {
                    this.writer.writeWpStartElement('tblStylePr');
                    this.writer.writeWpStringAttr('type', WriterHelper.getValueFromTables(TranslationTables.conditionalTableStyleFormattingTypesTable, styleType, ConditionalTableStyleFormatting.WholeTable));
                    this.exportTableConditionalStyle(condStyle);
                    this.writer.endElement();
                }
            });
        }
    }
    exportTableConditionalStyle(condStyle) {
        if (condStyle.maskedParagraphProperties.useValue != ParagraphPropertiesMask.UseNone)
            this.data.parPropsExporter.exportStyleParagraphProperties(condStyle.maskedParagraphProperties, condStyle.tabs, NumberingList.NumberingListNotSettedIndex, NumberingList.NumberingListNotSettedIndex);
        if (condStyle.maskedCharacterProperties.getUseValueFull() != CharacterPropertiesMask.UseNone)
            this.data.charPropsExporter.exportStyleCharacterProperties(condStyle.maskedCharacterProperties);
        this.data.tablePropsExporter.exportTablePropertiesForStyle(condStyle.tableProperties);
        new TableRowPropertiesExporter(this.data).exportPropsForStyles(condStyle.tableRowProperties);
        new TableCellPropertiesExporter(this.data).exportTableCellPropertiesForStyle(condStyle.tableCellProperties);
    }
}
