import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { JSONAbstractNumberingListProperty, JSONNumberingListLevelProperty, JSONNumberingListProperty } from '../enums/json-list-enums';
export class JSONNumberingListExporter {
    static exportAbstractNumberingLists(documentModel) {
        const listLevelPropertiesCache = documentModel.cache.listLevelPropertiesCache;
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        let jsonAbstractNumberingLists = [];
        for (let abstractNumberingList of documentModel.abstractNumberingLists) {
            let jsonAbstractNumberingList = {};
            jsonAbstractNumberingList[JSONAbstractNumberingListProperty.Deleted] = boolToInt(abstractNumberingList.deleted);
            jsonAbstractNumberingList[JSONAbstractNumberingListProperty.Id] = abstractNumberingList.innerId;
            let jsonLevels = [];
            for (let level of abstractNumberingList.levels) {
                let jsonLevel = {};
                jsonLevel[JSONNumberingListLevelProperty.CharacterPropertiesIndex] =
                    maskedCharacterPropertiesCache.indexOf(level.getCharacterProperties());
                jsonLevel[JSONNumberingListLevelProperty.ParagraphPropertiesIndex] =
                    maskedParagraphPropertiesCache.indexOf(level.getParagraphProperties());
                jsonLevel[JSONNumberingListLevelProperty.ListLevelPropertiesIndex] =
                    listLevelPropertiesCache.indexOf(level.getListLevelProperties());
                jsonLevels.push(jsonLevel);
            }
            jsonAbstractNumberingList[JSONAbstractNumberingListProperty.Levels] = jsonLevels;
            jsonAbstractNumberingLists.push(jsonAbstractNumberingList);
        }
        return jsonAbstractNumberingLists;
    }
    static exportNumberingLists(documentModel) {
        const listLevelPropertiesCache = documentModel.cache.listLevelPropertiesCache;
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        let jsonNumberingLists = [];
        for (let numberingList of documentModel.numberingLists) {
            let jsonNumberingList = {};
            jsonNumberingList[JSONNumberingListProperty.AlIndex] = numberingList.abstractNumberingListIndex;
            jsonNumberingList[JSONNumberingListProperty.Id] = numberingList.innerId;
            let jsonLevels = [];
            for (let level of numberingList.levels) {
                let jsonLevel = {};
                jsonLevel[JSONNumberingListLevelProperty.CharacterPropertiesIndex] =
                    maskedCharacterPropertiesCache.indexOf(level.getCharacterProperties());
                jsonLevel[JSONNumberingListLevelProperty.ParagraphPropertiesIndex] =
                    maskedParagraphPropertiesCache.indexOf(level.getParagraphProperties());
                jsonLevel[JSONNumberingListLevelProperty.ListLevelPropertiesIndex] =
                    listLevelPropertiesCache.indexOf(level.getListLevelProperties());
                jsonLevels.push(jsonLevel);
            }
            jsonNumberingList[JSONNumberingListProperty.Levels] = jsonLevels;
            jsonNumberingLists.push(jsonNumberingList);
        }
        return jsonNumberingLists;
    }
    static exportAbstractNumberingListTemplates(documentModel) {
        const listLevelPropertiesCache = documentModel.cache.listLevelPropertiesCache;
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        let jsonAbstractNumberingListTemplates = [];
        for (let abstractNumberingListTemplate of documentModel.abstractNumberingListTemplates) {
            let jsonAbstractNumberingListTemplate = {};
            jsonAbstractNumberingListTemplate[JSONAbstractNumberingListProperty.Deleted] = boolToInt(abstractNumberingListTemplate.deleted);
            jsonAbstractNumberingListTemplate[JSONAbstractNumberingListProperty.Id] = abstractNumberingListTemplate.innerId;
            let jsonLevels = [];
            for (let level of abstractNumberingListTemplate.levels) {
                let jsonLevel = {};
                jsonLevel[JSONNumberingListLevelProperty.CharacterPropertiesIndex] =
                    maskedCharacterPropertiesCache.indexOf(level.getCharacterProperties());
                jsonLevel[JSONNumberingListLevelProperty.ParagraphPropertiesIndex] =
                    maskedParagraphPropertiesCache.indexOf(level.getParagraphProperties());
                jsonLevel[JSONNumberingListLevelProperty.ListLevelPropertiesIndex] =
                    listLevelPropertiesCache.indexOf(level.getListLevelProperties());
                jsonLevels.push(jsonLevel);
            }
            jsonAbstractNumberingListTemplate[JSONAbstractNumberingListProperty.Levels] = jsonLevels;
            jsonAbstractNumberingListTemplates.push(jsonAbstractNumberingListTemplate);
        }
        return jsonAbstractNumberingListTemplates;
    }
}
