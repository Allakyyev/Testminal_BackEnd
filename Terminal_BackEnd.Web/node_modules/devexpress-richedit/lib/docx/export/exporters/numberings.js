import { ListLevel, OverrideListLevel } from '../../../core/model/numbering-lists/list-level';
import { ListNumberAlignment, NumberingFormat } from '../../../core/model/numbering-lists/list-level-properties';
import { NumberingList, NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../translation-table/translation-tables';
import { WordProcessingMLValue } from '../../translation-table/word-processing-mlvalue';
import { DocxNsType } from '../../utils/constants';
import { WriterHelper } from '../utils/writer-helper';
import { ExporterBaseWithRootElement } from './base';
export class NumberingsExporter extends ExporterBaseWithRootElement {
    get filePath() { return 'word/numbering.xml'; }
    get rootElement() { return new WordProcessingMLValue('numbering', 'lists').openXmlValue; }
    get rootNSPrefix() { return this.data.constants.namespaces[DocxNsType.WordProcessing].prefix; }
    get rootNSValue() { return this.data.constants.namespaces[DocxNsType.WordProcessing].namespace; }
    static shouldExportNumbering(model) {
        return !!model.numberingLists.length;
    }
    export() {
        if (NumberingsExporter.shouldExportNumbering(this.data.model))
            super.export();
    }
    fillWriter() {
        ListUtils.forEach(this.data.model.abstractNumberingLists, (list, id) => {
            this.writer.writeWpStartElement('abstractNum');
            this.writer.writeWpIntAttr('abstractNumId', id);
            this.writer.writeWpStringValue('nsid', StringUtils.padLeft(WriterHelper.convertToHexString(list.getId()), 8, '0'));
            this.writer.writeWpStringValue('multiLevelType', WriterHelper.getValueFromTables(TranslationTables.numberingListTypeTable, list.getListType(), NumberingType.Bullet));
            const shouldExportLevels = true;
            if (shouldExportLevels)
                this.exportLevels(list.levels);
            this.writer.endElement();
        });
        ListUtils.forEach(this.data.model.numberingLists, (list, id) => {
            this.writer.writeWpStartElement('num');
            this.writer.writeWpIntAttr('numId', id + 1);
            this.writer.writeWpIntValue('abstractNumId', list.abstractNumberingListIndex);
            this.exportOverrideLevels(list.levels);
            this.writer.endElement();
        });
    }
    exportOverrideLevels(levels) {
        ListUtils.forEach(levels, (level, ind) => {
            if (level.overrideStart || level instanceof OverrideListLevel)
                this.exportLevelOverride(level, ind);
        });
    }
    exportLevelOverride(level, levelIndex) {
        this.writer.writeWpStartElement('lvlOverride');
        this.writer.writeWpIntAttr('ilvl', levelIndex);
        if (level.overrideStart)
            this.exportStartOverride(level.getNewStart());
        if (level instanceof OverrideListLevel)
            this.exportLevel(level, levelIndex);
        this.writer.endElement();
    }
    exportStartOverride(newStart) {
        this.writer.writeWpIntValue('startOverride', newStart);
    }
    exportLevel(level, levelIndex) {
        this.writer.writeWpStartElement('lvl');
        this.writer.writeWpIntAttr('ilvl', levelIndex);
        if (level.getListLevelProperties().templateCode)
            this.writer.writeWpStringAttr('tplc', StringUtils.padLeft(level.getListLevelProperties().templateCode.toString(16), 8, '0'));
        this.exportLevelProperties(level, levelIndex);
        this.exportLevelParagraphProperties(level.getParagraphProperties(), null);
        this.exportLevelCharacterProperties(level.getCharacterProperties());
        this.writer.endElement();
    }
    exportLevels(levels) {
        ListUtils.forEach(levels, (level, ind) => {
            this.exportLevel(level, ind);
        });
    }
    exportLevelProperties(level, levelIndex) {
        const properties = level.getListLevelProperties();
        this.writer.writeWpIntValue('start', properties.start);
        this.exportNumberFormatValue(properties);
        if (properties.suppressRestart)
            this.writer.writeWpIntValue('lvlRestart', 0);
        else if (properties.relativeRestartLevel != 0)
            this.writer.writeWpIntValue('lvlRestart', levelIndex - properties.relativeRestartLevel);
        const abstractLevel = level instanceof ListLevel ? level : null;
        if (abstractLevel != null)
            this.exportAbstractLevelProperties(abstractLevel);
        if (properties.convertPreviousLevelNumberingToDecimal)
            this.writer.writeWpBoolValue('isLgl', properties.convertPreviousLevelNumberingToDecimal);
        this.writer.writeWpStringValue('suff', WriterHelper.getValueFromTables(TranslationTables.listNumberSeparatorTable, properties.separator.charCodeAt(0), '\0'.charCodeAt(0)));
        this.writer.writeWpStringValue('lvlText', this.convertFormatString(properties.displayFormatString));
        if (properties.legacy) {
            this.writer.writeWpStartElement('legacy');
            this.writer.writeWpIntAttr('legacy', 1);
            this.writer.writeWpIntAttr('legacyIndent', properties.legacyIndent);
            this.writer.writeWpIntAttr('legacySpace', properties.legacySpace);
            this.writer.endElement();
        }
        this.writer.writeWpStringValue('lvlJc', WriterHelper.getValueFromTables(TranslationTables.listNumberAlignmentTable, properties.alignment, ListNumberAlignment.Left));
    }
    exportLevelParagraphProperties(properties, _tabs) {
        this.writer.writeWpStartElement('pPr');
        this.data.parPropsExporter.exportParagraphPropertiesCore(properties, NumberingList.NumberingListNotSettedIndex, -1, null, false);
        this.writer.endElement();
    }
    exportLevelCharacterProperties(properties) {
        this.writer.writeWpStartElement('rPr');
        this.data.charPropsExporter.exportRunPropertiesCore(properties);
        this.writer.endElement();
    }
    convertFormatString(value) {
        try {
            return this.data.model.simpleFormattersManager.formatString(value, '%1', '%2', '%3', '%4', '%5', '%6', '%7', '%8', '%9');
        }
        catch (_a) {
            return '';
        }
    }
    exportNumberFormatValue(properties) {
        this.writer.writeWpStringValue('numFmt', WriterHelper.getValueFromTables(TranslationTables.pageNumberingFormatTable, properties.format, NumberingFormat.Decimal));
    }
    exportAbstractLevelProperties(_level) {
    }
}
