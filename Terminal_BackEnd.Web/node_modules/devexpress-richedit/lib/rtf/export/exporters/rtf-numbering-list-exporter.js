import { MapCreator } from '../../../base-utils/map-creator';
import { CharacterPropertiesMask } from '../../../core/model/character/enums';
import { OverrideListLevel } from '../../../core/model/numbering-lists/list-level';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfNumberingFormats } from '../../utils/numbering-formats';
import { Characters } from '../characters';
import { RtfBuilder } from '../rtf-builder';
import { RtfCharacterPropertiesExporter } from './rtf-character-properties-exporter';
import { RtfParagraphPropertiesExporter } from './rtf-paragraph-properties-exporter';
export class RtfNumberingListExporter {
    constructor(rtfExporter) {
        this.text = "";
        this.number = "";
        this.rtfExporter = rtfExporter;
        this.rtfBuilder = rtfExporter.createRtfBuilder();
        this.characterPropertiesExporter = new RtfCharacterPropertiesExporter(rtfExporter.documentModel, rtfExporter.rtfExportHelper, this.rtfBuilder, rtfExporter.options);
        this.paragraphPropertiesExporter = new RtfParagraphPropertiesExporter(rtfExporter.documentModel, rtfExporter.rtfExportHelper, this.rtfBuilder);
    }
    export(numberingLists, startIndex, count) {
        if (numberingLists.length <= 0)
            return;
        const abstractNumberingLists = this.getAbstractNumberingLists(numberingLists, startIndex, count);
        if (abstractNumberingLists.length > 0)
            this.exportAbstractNumberingLists(abstractNumberingLists);
        this.exportListOverrideTable(numberingLists, startIndex, count);
    }
    getAbstractNumberingLists(numberingLists, startIndex, count) {
        const result = [];
        const lastIndex = startIndex + (count - 1);
        for (let i = startIndex; i <= lastIndex; i++) {
            const list = numberingLists[i].getAbstractNumberingList();
            if (!ListUtils.unsafeAnyOf(result, (val) => val.innerId == list.innerId))
                result.push(list);
        }
        return result;
    }
    exportAbstractNumberingLists(abstractNumberingLists) {
        for (let i = 0; i < abstractNumberingLists.length; i++) {
            this.rtfBuilder.clear();
            this.exportAbstractNumberingList(abstractNumberingLists[i]);
        }
    }
    exportAbstractNumberingList(list) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.NumberingList);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.NumberingListTemplateId, -1);
        if (list.isHybridList())
            this.rtfBuilder.writeCommand(RtfExportSR.NumberingListHybrid);
        this.exportListLevels(list.levels);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.NumberingListName);
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.NumberingListId, list.getId());
        this.rtfBuilder.closeGroup();
        const listCollectionHandler = new MapCreator(this.rtfExporter.rtfExportHelper.numberingListCollection);
        if (!this.rtfExporter.rtfExportHelper.numberingListCollection[list.getId()])
            listCollectionHandler.add(list.getId(), this.rtfBuilder.rtfContent.getText());
    }
    exportListLevels(listLevels) {
        const count = listLevels.length;
        for (let i = 0; i < count; i++)
            this.exportListLevel(listLevels[i]);
    }
    exportListOverrideTable(numberingLists, startIndex, count) {
        if (numberingLists.length <= 0)
            return;
        const lastIndex = startIndex + (count - 1);
        for (let i = startIndex; i <= lastIndex; i++) {
            this.rtfBuilder.clear();
            this.exportListOverride(numberingLists[i]);
        }
    }
    exportListOverride(numberingList) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListOverride);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.NumberingListId, numberingList.getAbstractNumberingList().getId());
        const listOverrideCount = this.getListOverrideCount(numberingList);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListOverrideCount, listOverrideCount);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListIndex, numberingList.getId());
        this.exportListOverrideLevels(numberingList);
        this.rtfBuilder.closeGroup();
        const index = this.rtfExporter.rtfExportHelper.listOverrideCollection.length;
        this.rtfExporter.rtfExportHelper.listOverrideCollection.push(this.rtfBuilder.rtfContent.getText());
        const listOverrideCollectionHandler = new MapCreator(this.rtfExporter.rtfExportHelper.listOverrideCollectionIndex);
        if (!this.rtfExporter.rtfExportHelper.listOverrideCollectionIndex[numberingList.getId()])
            listOverrideCollectionHandler.add(numberingList.getId(), index);
    }
    getListOverrideCount(numberingList) {
        const levels = numberingList.levels;
        const count = levels.length;
        let result = 0;
        for (let i = 0; i < count; i++)
            if (this.isOverrideLevel(levels[i]))
                result++;
        return result;
    }
    isOverrideLevel(listLevel) {
        if (listLevel instanceof OverrideListLevel)
            return true;
        return listLevel.overrideStart;
    }
    exportListOverrideLevels(numberingList) {
        const levels = numberingList.levels;
        const count = levels.length;
        for (let i = 0; i < count; i++)
            if (this.isOverrideLevel(levels[i]))
                this.exportListOverrideLevel(levels[i]);
    }
    exportListOverrideLevel(level) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListOverrideLevel);
        if (level.overrideStart)
            this.rtfBuilder.writeCommand(RtfExportSR.ListOverrideStart);
        const overrideLevel = level;
        if (overrideLevel != null) {
            this.rtfBuilder.writeCommand(RtfExportSR.ListOverrideFormat);
            this.exportListLevel(level);
        }
        else {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelStart, level.getNewStart());
        }
        this.rtfBuilder.closeGroup();
    }
    exportListLevel(listLevel) {
        const properties = listLevel.getListLevelProperties();
        const numberingListFormat = this.getNumberingListFormat(properties.format);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListLevel);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelNumberingFormat, numberingListFormat);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelNumberingFormatN, numberingListFormat);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelAlignment, properties.alignment);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelAlignmentN, properties.alignment);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelFollow, RtfNumberingListExporter.getListLevelSeparator(properties.separator));
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelStart, properties.start);
        if (properties.legacy) {
            this.rtfBuilder.writeCommand(RtfExportSR.ListLevelLegacy);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelLegacySpace, properties.legacySpace);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelLegacyIndent, properties.legacyIndent);
        }
        this.exportListLevelTextAndNumber(properties.displayFormatString, properties.templateCode);
        if (properties.convertPreviousLevelNumberingToDecimal)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelLegal, 1);
        else
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelLegal, 0);
        if (properties.suppressRestart)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelNoRestart, 1);
        else
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListLevelNoRestart, 0);
        this.exportListLevelCharacterAndParagraphProperties(listLevel);
        this.rtfBuilder.closeGroup();
    }
    getNumberingListFormat(numberingFormat) {
        const result = RtfNumberingFormats.indexOf(numberingFormat);
        return result >= 0 ? result : 0;
    }
    static getListLevelSeparator(separator) {
        switch (separator) {
            case Characters.TabMark:
                return 0;
            case ' ':
                return 1;
            default:
                return 2;
        }
    }
    exportListLevelTextAndNumber(displayFormatString, levelTemplateId) {
        this.text = "";
        this.number = "";
        this.getTextAndNumber(displayFormatString);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListLevelText);
        if (levelTemplateId != 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.LevelTemplateId, levelTemplateId);
        this.rtfBuilder.writeTextDirect(this.rtfExporter.documentModel.simpleFormattersManager.formatString("\\'{0:x2}", this.textLength));
        this.rtfBuilder.writeTextDirect(this.text, true);
        this.rtfBuilder.writeChar(';');
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListLevelNumbers, this.number + ";");
        this.rtfBuilder.closeGroup();
    }
    getTextAndNumber(displayFormatString) {
        this.textLength = 0;
        const count = displayFormatString.length;
        let i = 0;
        while (i < count) {
            const ch = displayFormatString[i];
            if (!RtfBuilder.isSpecialSymbol(ch))
                i = this.addChar(ch, i);
            else
                i = this.addLevelNumber(displayFormatString, i);
        }
    }
    addLevelNumber(displayFormatString, i) {
        if (this.doubleBrackets(displayFormatString, i)) {
            i = this.addEscapedChar(displayFormatString[i], i);
            return i + 1;
        }
        if (displayFormatString[i] == '\\')
            return this.addEscapedChar(displayFormatString[i], i);
        return this.addLevelNumberCore(displayFormatString, i);
    }
    addLevelNumberCore(displayFormatString, i) {
        let value = "";
        i++;
        value = displayFormatString.substr(i, displayFormatString.indexOf('}', i) - i);
        this.text += this.rtfExporter.documentModel.simpleFormattersManager.formatString("\\'{0:x2}", parseInt(value));
        this.textLength += value.length;
        this.number += this.rtfExporter.documentModel.simpleFormattersManager.formatString("\\'{0:x2}", this.textLength);
        return i + value.length + 1;
    }
    doubleBrackets(displayFormatString, i) {
        return (displayFormatString[i] == '}' && displayFormatString[i + 1] == '}') ||
            (displayFormatString[i] == '{' && displayFormatString[i + 1] == '{');
    }
    addChar(ch, i) {
        this.text += ch;
        this.textLength++;
        return i + 1;
    }
    addEscapedChar(ch, i) {
        const str = "\\'" + RtfBuilder.byteToHexString[ch.charCodeAt(0)];
        this.text += str;
        this.textLength++;
        return i + 1;
    }
    exportListLevelCharacterAndParagraphProperties(listLevel) {
        const characterProperties = listLevel.getCharacterProperties();
        const mergedCharacterProperties = listLevel.getCharacterMergedProperties();
        this.characterPropertiesExporter.exportCharacterProperties(mergedCharacterProperties, true, !characterProperties.getUseValue(CharacterPropertiesMask.UseDoubleFontSize), !characterProperties.getUseValue(CharacterPropertiesMask.UseFontName));
        const mergedParagraphProperties = listLevel.getParagraphMergedProperties();
        this.paragraphPropertiesExporter.writeParagraphIndents(mergedParagraphProperties);
    }
}
