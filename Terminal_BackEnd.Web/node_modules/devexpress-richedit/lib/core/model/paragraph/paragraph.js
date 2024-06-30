import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { MaskedParagraphPropertiesBundleFull, ParagraphListInfo } from '../../rich-utils/properties-bundle';
import { MaskedCharacterProperties } from '../character/character-properties';
import { CharacterPropertiesMask } from '../character/enums';
import { NumberConverterCreator } from '../number-converters/number-converter-creator';
import { AbstractNumberingList, NumberingList } from '../numbering-lists/numbering-list';
import { CharacterPropertiesMerger } from '../properties-merger/character-properties-merger';
import { ParagraphPropertiesMerger } from '../properties-merger/paragraph-properties-merger';
import { Table } from '../tables/main-structures/table';
import { TabProperties } from './paragraph-style';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class TabsInfo {
}
export var TabAlign;
(function (TabAlign) {
    TabAlign[TabAlign["Left"] = 0] = "Left";
    TabAlign[TabAlign["Center"] = 1] = "Center";
    TabAlign[TabAlign["Right"] = 2] = "Right";
    TabAlign[TabAlign["Decimal"] = 3] = "Decimal";
    TabAlign[TabAlign["Numbering"] = 4] = "Numbering";
})(TabAlign || (TabAlign = {}));
export class Paragraph {
    constructor(subDocument, startLogPosition, length, paragraphStyle, maskedParagraphProperties, indexInMaskedParagraphProperitesCache = undefined) {
        this.numberingListIndex = NumberingList.NumberingListNotSettedIndex;
        this.listLevelIndex = -1;
        this.subDocument = subDocument;
        this.startLogPosition = startLogPosition;
        this.length = length;
        this.paragraphStyle = paragraphStyle;
        if (indexInMaskedParagraphProperitesCache === undefined) {
            if (maskedParagraphProperties)
                this.setParagraphProperties(maskedParagraphProperties);
            else
                this.maskedParagraphProperties = null;
        }
        else
            this.maskedParagraphProperties = this.subDocument.documentModel.cache.maskedParagraphPropertiesCache.getItemByJsonKey(indexInMaskedParagraphProperitesCache);
        this.mergedParagraphFormatting = null;
        this.tabs = new TabProperties();
    }
    get isEmpty() { return this.length <= 1; }
    getParagraphBundleFull(model) {
        return new MaskedParagraphPropertiesBundleFull(model.cache.maskedParagraphPropertiesCache.getItem(this.maskedParagraphProperties), model.stylesManager.addParagraphStyle(this.paragraphStyle), new ParagraphListInfo(this.numberingListIndex, this.listLevelIndex), this.tabs.clone());
    }
    getTableCell() {
        const parPos = this.startLogPosition.value;
        const tables = this.subDocument.tables;
        const table = Table.getTableByPosition(tables, parPos, true);
        if (!table)
            return null;
        const rowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, (r) => r.getStartPosition(), parPos);
        const row = table.rows[rowIndex];
        const cellIndex = SearchUtils.normedInterpolationIndexOf(row.cells, (c) => c.startParagraphPosition.value, parPos);
        const cell = row.cells[cellIndex];
        return cell;
    }
    isInList() {
        return this.getNumberingListIndex() >= 0;
    }
    isInOwnList() {
        return this.numberingListIndex >= 0;
    }
    isInStyleList() {
        return this.paragraphStyle && this.paragraphStyle.numberingListIndex >= 0;
    }
    getListLevelIndex() {
        if (this.listLevelIndex >= 0)
            return this.listLevelIndex;
        return this.paragraphStyle ? this.paragraphStyle.getListLevelIndex() : -1;
    }
    getListLevel() {
        return this.getNumberingList().levels[this.getListLevelIndex()];
    }
    getNumberingListIndex() {
        if (this.numberingListIndex >= 0 || this.numberingListIndex === NumberingList.NoNumberingListIndex)
            return this.numberingListIndex;
        return this.paragraphStyle ? this.paragraphStyle.getNumberingListIndex() : -1;
    }
    getNumberingList() {
        return this.subDocument.documentModel.numberingLists[this.getNumberingListIndex()];
    }
    getAbstractNumberingList() {
        var numberingList = this.getNumberingList();
        return numberingList ? numberingList.getAbstractNumberingList() : null;
    }
    getAbstractNumberingListIndex() {
        var numberingList = this.getNumberingList();
        return numberingList ? numberingList.abstractNumberingListIndex : -1;
    }
    getNumberingListText() {
        var counters = this.subDocument.documentModel.getRangeListCounters(this);
        return this.getNumberingListTextCore(counters);
    }
    getNumberingListTextCore(counters) {
        var levels = this.getNumberingList().levels;
        var formatString = levels[this.getListLevelIndex()].getListLevelProperties().displayFormatString;
        return this.formatNumberingListText(formatString, counters, levels);
    }
    getNumberingListSeparatorChar() {
        return this.getListLevel().getListLevelProperties().separator;
    }
    getNumerationCharacterProperties() {
        var merger = new CharacterPropertiesMerger();
        merger.mergeCharacterProperties(this.getNumberingList().levels[this.getListLevelIndex()].getCharacterProperties());
        const paragraphRunProperties = this.subDocument.getRunByPosition(this.getEndPosition() - 1).getCharacterMergedProperties();
        const maskedParagraphRunProperties = new MaskedCharacterProperties();
        maskedParagraphRunProperties.copyFrom(paragraphRunProperties);
        maskedParagraphRunProperties.setUseValueFull(CharacterPropertiesMask.UseAll ^ CharacterPropertiesMask.UseFontUnderlineType);
        merger.mergeCharacterProperties(maskedParagraphRunProperties);
        return this.subDocument.documentModel.cache.mergedCharacterPropertiesCache.getItem(merger.getMergedProperties());
    }
    getNumerationLanguageId() {
        const characterProperties = this.getNumerationCharacterProperties();
        if (!isDefined(characterProperties.langInfo))
            return "en";
        const langId = characterProperties.langInfo.latin;
        if (!isDefined(langId))
            return "en";
        return langId;
    }
    formatNumberingListText(formatString, args, levels) {
        var objArgs = new Array(args.length);
        const langId = this.getNumerationLanguageId();
        for (var i = 0; i < args.length; i++) {
            var converter = NumberConverterCreator.createConverter(levels[i].getListLevelProperties().format, this.subDocument.documentModel.simpleFormattersManager, langId);
            objArgs[i] = converter.convertNumber(args[i]);
        }
        try {
            return this.subDocument.documentModel.simpleFormattersManager.formatString(formatString, ...objArgs);
        }
        catch (e) {
            try {
                return objArgs[0];
            }
            catch (e) {
                return "";
            }
        }
    }
    get interval() { return new FixedInterval(this.startLogPosition.value, this.length); }
    getEndPosition() {
        return this.startLogPosition.value + this.length;
    }
    setParagraphProperties(properties) {
        this.maskedParagraphProperties = this.subDocument.documentModel.cache.maskedParagraphPropertiesCache.getItem(properties);
    }
    onParagraphPropertiesChanged() {
        this.resetParagraphMergedProperties();
    }
    resetParagraphMergedProperties() {
        this.mergedParagraphFormatting = null;
    }
    getParagraphMergedProperties() {
        if (!this.mergedParagraphFormatting) {
            var merger = new ParagraphPropertiesMerger();
            merger.mergeMaskedParagraphProperties(this.maskedParagraphProperties);
            if (this.isInOwnList())
                merger.mergeMaskedParagraphProperties(this.getListLevel().getParagraphProperties());
            if (this.numberingListIndex == AbstractNumberingList.NoNumberingListIndex)
                merger.mergeParagraphStyle(this.paragraphStyle);
            else
                merger.mergeParagraphStyleConsiderNumbering(this.paragraphStyle, this.subDocument.documentModel);
            const tableCell = this.getTableCell();
            if (tableCell)
                merger.mergeTableStyle(tableCell);
            merger.mergeMaskedParagraphProperties(this.subDocument.documentModel.defaultParagraphProperties);
            this.mergedParagraphFormatting =
                this.subDocument.documentModel.cache.mergedParagraphPropertiesCache.getItem(merger.getMergedProperties());
        }
        return this.mergedParagraphFormatting;
    }
    setParagraphMergedProperies(properties) {
        this.mergedParagraphFormatting = this.subDocument.documentModel.cache.mergedParagraphPropertiesCache.getItem(properties);
    }
    hasParagraphMergedProperies() {
        return !!this.mergedParagraphFormatting;
    }
    getTabs() {
        var result = new TabsInfo();
        result.defaultTabStop = this.subDocument.documentModel.defaultTabWidth;
        result.positions = [];
        if (this.paragraphStyle) {
            var styleTabs = this.paragraphStyle.getResultTabs().tabsInfo;
            for (var i = 0; i < styleTabs.length; i++)
                if (!styleTabs[i].deleted) {
                    var tabPosition = styleTabs[i].clone();
                    var index = SearchUtils.binaryIndexOf(result.positions, (t) => t.position - styleTabs[i].position);
                    if (index < 0)
                        result.positions.splice(~index, 0, tabPosition);
                    else
                        result.positions[index] = tabPosition;
                }
        }
        var paragraphTabs = this.tabs.tabsInfo;
        for (var i = 0; i < paragraphTabs.length; i++) {
            var index = SearchUtils.binaryIndexOf(result.positions, (t) => t.position - paragraphTabs[i].position);
            if (index < 0) {
                index = ~index;
                if (!paragraphTabs[i].deleted)
                    result.positions.splice(index, 0, paragraphTabs[i].clone());
            }
            else {
                if (paragraphTabs[i].deleted)
                    result.positions.splice(index, 1);
                else
                    result.positions[index] = paragraphTabs[i].clone();
            }
        }
        return result;
    }
    clone(subDocument) {
        const result = new Paragraph(subDocument, subDocument.positionManager.registerPosition(this.startLogPosition.value), this.length, subDocument.documentModel.stylesManager.getParagraphStyleByName(this.paragraphStyle.styleName), this.maskedParagraphProperties);
        result.tabs = this.tabs.clone();
        result.numberingListIndex = this.numberingListIndex;
        result.listLevelIndex = this.listLevelIndex;
        return result;
    }
    copyFrom(from) {
        this.paragraphStyle = from.paragraphStyle;
        this.setParagraphProperties(from.maskedParagraphProperties);
        if (from.hasParagraphMergedProperies())
            this.setParagraphMergedProperies(from.getParagraphMergedProperties());
        this.numberingListIndex = from.numberingListIndex;
        this.listLevelIndex = from.listLevelIndex;
        this.tabs = from.tabs.clone();
    }
}
