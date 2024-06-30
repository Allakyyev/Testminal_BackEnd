import { NumberingListIndexConstants } from '../../../../core/formats/utils/numbering-list-index-constants';
import { OverrideListLevel } from '../../../../core/model/numbering-lists/list-level';
import { NumberingHelper } from '../../../../core/model/numbering-lists/numbering-helper';
import { AbstractNumberingList, NumberingList } from '../../../../core/model/numbering-lists/numbering-list';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfNumberingListType } from './rtf-numbering-list';
export class RtfListConverter {
    constructor(importer) {
        this.styleCrossTable = {};
        this.importer = importer;
    }
    get documentModel() { return this.importer.documentModel; }
    convert(listTable, listOverrideTable) {
        this.createAbstractNumberingLists(listTable);
        this.fixBrokenListStyles();
        this.createNumberingListsCore(listOverrideTable, listTable);
    }
    fixBrokenListStyles() {
        ListUtils.forEach(this.documentModel.numberingListStyles, (style, i) => {
            const abstractListIndex = this.findAbstractNumberingListByStyle(i);
            if (style.numberingListIndex < NumberingListIndexConstants.minValue && abstractListIndex != -1) {
                this.documentModel.numberingLists.push(new NumberingList(this.documentModel, abstractListIndex));
                style.numberingListIndex = this.documentModel.numberingLists.length - 1;
            }
        });
    }
    findAbstractNumberingListByStyle(_styleIndex) {
        return -1;
    }
    createNumberingListsCore(listOverrideTable, _listTable) {
        const count = listOverrideTable.length;
        const abstractNumberingLists = this.documentModel.abstractNumberingLists;
        for (let i = 0; i < count; i++) {
            const rtfList = listOverrideTable[i];
            const sourceListIndex = this.getListIndex(rtfList.listId, abstractNumberingLists);
            if (sourceListIndex < 0)
                continue;
            const list = new NumberingList(this.documentModel, sourceListIndex);
            const overrideId = rtfList.id;
            this.documentModel.numberingLists.push(list);
            this.convertRtfOverrideToNumbering(list, rtfList);
            const numberingListIndex = this.documentModel.numberingLists.length - 1;
            this.importer.importers.numbering.listOverrideIndexToNumberingListIndexMap[overrideId] = numberingListIndex;
            list.innerId = this.documentModel.numberingLists.length;
        }
    }
    createAbstractNumberingLists(listTable) {
        listTable.forEach((rtfList) => {
            this.createAbstractNumberingList(rtfList);
        });
    }
    createAbstractNumberingList(rtfList) {
        let list = ListUtils.elementBy(this.documentModel.abstractNumberingLists, list => list.innerId == rtfList.id);
        if (rtfList.id == -1 || !list) {
            list = new AbstractNumberingList(this.documentModel);
            this.convertRtfListToNumberingList(rtfList.levels, list);
            if (this.isHybridList(rtfList))
                this.setHybridListType(list);
            list.innerId = rtfList.id;
            this.documentModel.abstractNumberingLists.push(list);
        }
        return list;
    }
    isHybridList(rtfList) {
        if (rtfList.numberingListType != RtfNumberingListType.Unknown)
            return true;
        const levels = rtfList.levels;
        for (let value of levels) {
            if (value.listLevelProperties.templateCode != 0)
                return true;
        }
        return false;
    }
    setHybridListType(list) {
        list.levels.forEach((listLevel) => {
            listLevel.changeListLevelProperties((properties) => {
                if (properties.templateCode === 0)
                    properties.templateCode = NumberingHelper.generateNewTemplateCode(this.documentModel);
            });
        });
    }
    getListIndex(listId, lists) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].getId() == listId)
                return i;
        }
        return -1;
    }
    convertRtfOverrideToNumbering(list, rtfOverride) {
        rtfOverride.levels.forEach((level, index) => {
            const restart = level.overrideStartAt;
            const reformat = level.overrideFormat;
            if (reformat) {
                this.convertPropertyRtfToNumbering(level.level, level.level.listLevelProperties, true, true);
                const overrideLevel = new OverrideListLevel(this.documentModel, level.level.characterProperties, level.level.paragraphProperties, level.level.listLevelProperties);
                list.levels[index] = overrideLevel;
                if (restart)
                    overrideLevel.overrideStart = true;
            }
            else {
                if (restart) {
                    const referenceLevel = list.levels[index];
                    referenceLevel.overrideStart = true;
                    referenceLevel.setNewStart(rtfOverride.levels[index].startAt);
                }
            }
        });
    }
    convertRtfListToNumberingList(rtfLevels, list) {
        rtfLevels.forEach((rtfLevel, index) => {
            const level = list.createLevel(index);
            list.levels[index] = level;
            level.setParagraphProperties(rtfLevel.paragraphProperties);
            level.setCharacterProperties(rtfLevel.characterProperties);
            level.changeListLevelProperties((properties) => { this.convertPropertyRtfToNumbering(rtfLevel, properties, true, true); });
        });
    }
    convertPropertyRtfToNumbering(rtfLevel, level, restart, reformat) {
        const levelProperties = rtfLevel.listLevelProperties;
        if (restart == true)
            level.start = levelProperties.start;
        if (reformat == true) {
            level.format = levelProperties.format;
            level.alignment = levelProperties.alignment;
            level.suppressBulletResize = levelProperties.suppressBulletResize;
            level.suppressRestart = levelProperties.suppressRestart;
            level.separator = levelProperties.separator;
            level.convertPreviousLevelNumberingToDecimal = levelProperties.convertPreviousLevelNumberingToDecimal;
            level.displayFormatString = rtfLevel.createDisplayFormatString();
            level.templateCode = levelProperties.templateCode;
        }
        if (levelProperties.legacy) {
            level.legacy = levelProperties.legacy;
            level.legacySpace = levelProperties.legacySpace;
            level.legacyIndent = levelProperties.legacyIndent;
        }
    }
}
