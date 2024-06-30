import { ListLevel, NumberingListReferenceLevel, OverrideListLevel } from '../../../numbering-lists/list-level';
import { AbstractNumberingList, NumberingList } from '../../../numbering-lists/numbering-list';
import { JSONAbstractNumberingListProperty, JSONNumberingListLevelProperty, JSONNumberingListProperty, JSONNumberingOverrideListLevelProperty } from '../../enums/json-list-enums';
export class JSONNumberingListImporter {
    static importAbstractNumberingLists(documentModel, content) {
        for (let jsonNumbList of content)
            documentModel.abstractNumberingLists.push(JSONNumberingListImporter.getAbstractNumbertingList(documentModel, jsonNumbList));
    }
    static importNumberingLists(documentModel, content) {
        for (let jsonNumbList of content)
            documentModel.numberingLists.push(JSONNumberingListImporter.getNumberingList(documentModel, jsonNumbList));
    }
    static importAbstractNumberingListTemplates(documentModel, content) {
        if (!content)
            return;
        for (let jsonNumbList of content)
            documentModel.abstractNumberingListTemplates.push(JSONNumberingListImporter.getAbstractNumbertingList(documentModel, jsonNumbList));
    }
    static getAbstractNumbertingList(documentModel, content) {
        var abstractNumberingList = new AbstractNumberingList(documentModel);
        abstractNumberingList.deleted = !!content[JSONAbstractNumberingListProperty.Deleted];
        abstractNumberingList.innerId = content[JSONAbstractNumberingListProperty.Id];
        abstractNumberingList.levels = JSONNumberingListImporter.getAbstractNumberingListLevels(documentModel, content[JSONAbstractNumberingListProperty.Levels]);
        return abstractNumberingList;
    }
    static getNumberingList(documentModel, content) {
        var numberingList = new NumberingList(documentModel, content[JSONNumberingListProperty.AlIndex]);
        numberingList.deleted = false;
        numberingList.innerId = content[JSONNumberingListProperty.Id];
        numberingList.levels = JSONNumberingListImporter.getNumberingListLevels(documentModel, content[JSONNumberingListProperty.Levels], numberingList);
        return numberingList;
    }
    static getAbstractNumberingListLevels(documentModel, content) {
        const result = [];
        for (var i = 0, obj; obj = content[i]; i++) {
            const maskedCharacterProperties = documentModel.cache.maskedCharacterPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.CharacterPropertiesIndex]);
            const maskedParagraphProperties = documentModel.cache.maskedParagraphPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.ParagraphPropertiesIndex]);
            const listLevelProperties = documentModel.cache.listLevelPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.ListLevelPropertiesIndex]);
            result.push(new ListLevel(documentModel, maskedCharacterProperties, maskedParagraphProperties, listLevelProperties));
        }
        return result;
    }
    static getNumberingListLevels(documentModel, content, numberingList) {
        const result = [];
        for (let obj of content) {
            let listLevel;
            if (obj[JSONNumberingOverrideListLevelProperty.Level] === undefined) {
                const maskedCharacterProperties = documentModel.cache.maskedCharacterPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.CharacterPropertiesIndex]);
                const maskedParagraphProperties = documentModel.cache.maskedParagraphPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.ParagraphPropertiesIndex]);
                const listLevelProperties = documentModel.cache.listLevelPropertiesCache.getItemByJsonKey(obj[JSONNumberingListLevelProperty.ListLevelPropertiesIndex]);
                listLevel = new OverrideListLevel(documentModel, maskedCharacterProperties, maskedParagraphProperties, listLevelProperties);
            }
            else {
                listLevel = new NumberingListReferenceLevel(numberingList, obj[JSONNumberingOverrideListLevelProperty.Level]);
            }
            listLevel.setNewStart(obj[JSONNumberingOverrideListLevelProperty.NewStart]);
            listLevel.overrideStart = !!obj[JSONNumberingOverrideListLevelProperty.OverrideStart];
            result.push(listLevel);
        }
        return result;
    }
}
