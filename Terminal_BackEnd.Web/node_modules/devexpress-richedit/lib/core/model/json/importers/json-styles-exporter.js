import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { CharacterStyle } from '../../character/character-style';
import { NumberingListStyle } from '../../numbering-lists/numbering-list-style';
import { ParagraphStyle } from '../../paragraph/paragraph-style';
import { TableStyle } from '../../tables/styles/table-style';
import { JSONCharacterStyleProperty, JSONNumberingListStyleProperty, JSONParagraphStyleProperty, JSONStyleBaseProperty, JSONStylesProperty, JSONTableStyleProperty } from '../enums/json-style-enums';
import { JSONTabConverter } from './json-tab-converter';
import { JSONTableConditionalStyleConverter } from './table/json-table-conditional-style-converter';
export class JSONStylesExporter {
    static importStyles(documentModel, content) {
        JSONStylesExporter.importCharacterStyles(documentModel, content[JSONStylesProperty.Character]);
        JSONStylesExporter.importParagraphStyles(documentModel, content[JSONStylesProperty.Paragraph]);
        JSONStylesExporter.importNumberingStyles(documentModel, content[JSONStylesProperty.NumberingList]);
        JSONStylesExporter.importTableStyles(documentModel, content[JSONStylesProperty.Table]);
        JSONStylesExporter.finishCharacterStylesImport(documentModel, content[JSONStylesProperty.Character]);
        JSONStylesExporter.finishParagraphStylesImport(documentModel, content[JSONStylesProperty.Paragraph]);
        JSONStylesExporter.finishNumberingListStylesImport(documentModel, content[JSONStylesProperty.NumberingList]);
        JSONStylesExporter.finishTableStylesImport(documentModel, content[JSONStylesProperty.Table]);
    }
    static exportStyles(documentModel) {
        let jsonStyles = {};
        jsonStyles[JSONStylesProperty.Character] = JSONStylesExporter.exportCharacterStyles(documentModel);
        jsonStyles[JSONStylesProperty.Paragraph] = JSONStylesExporter.exportParagraphStyles(documentModel);
        jsonStyles[JSONStylesProperty.NumberingList] = JSONStylesExporter.exportNumberingStyles(documentModel);
        jsonStyles[JSONStylesProperty.Table] = JSONStylesExporter.exportTableStyles(documentModel);
        return jsonStyles;
    }
    ;
    static exportCharacterStyles(documentModel) {
        let jsonCharacterStyles = [];
        for (let characterStyle of documentModel.characterStyles) {
            let jsonCharacterStyle = {};
            jsonCharacterStyle[JSONStyleBaseProperty.StyleName] = characterStyle.styleName;
            jsonCharacterStyle[JSONStyleBaseProperty.Deleted] = boolToInt(characterStyle.deleted);
            jsonCharacterStyle[JSONStyleBaseProperty.Hidden] = boolToInt(characterStyle.hidden);
            jsonCharacterStyle[JSONStyleBaseProperty.ParentStyleName] = characterStyle.parent ? characterStyle.parent.styleName : "";
            jsonCharacterStyle[JSONStyleBaseProperty.Semihidden] = boolToInt(characterStyle.semihidden);
            jsonCharacterStyle[JSONStyleBaseProperty.LocalizedStyleName] = characterStyle.localizedName;
            jsonCharacterStyle[JSONStyleBaseProperty.IsDefault] = boolToInt(characterStyle.isDefault);
            jsonCharacterStyle[JSONStyleBaseProperty.Base64EncodedImage] = characterStyle.base64EncodedImage;
            jsonCharacterStyle[JSONCharacterStyleProperty.LinkedStyleName] = characterStyle.linkedStyle ? characterStyle.linkedStyle.styleName : "";
            jsonCharacterStyle[JSONCharacterStyleProperty.CharacterPropertiesCacheIndex] = documentModel.characterStyles.indexOf(characterStyle);
            jsonCharacterStyles.push(jsonCharacterStyle);
        }
        return jsonCharacterStyles;
    }
    static exportParagraphStyles(documentModel) {
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        let jsonParagraphStyles = [];
        for (let paragraphStyle of documentModel.paragraphStyles) {
            let jsonParagraphStyle = {};
            jsonParagraphStyle[JSONStyleBaseProperty.StyleName] = paragraphStyle.styleName;
            jsonParagraphStyle[JSONStyleBaseProperty.Deleted] = boolToInt(paragraphStyle.deleted);
            jsonParagraphStyle[JSONStyleBaseProperty.Hidden] = boolToInt(paragraphStyle.hidden);
            jsonParagraphStyle[JSONStyleBaseProperty.ParentStyleName] = paragraphStyle.parent ? paragraphStyle.parent.styleName : "";
            jsonParagraphStyle[JSONStyleBaseProperty.Semihidden] = boolToInt(paragraphStyle.semihidden);
            jsonParagraphStyle[JSONStyleBaseProperty.LocalizedStyleName] = paragraphStyle.localizedName;
            jsonParagraphStyle[JSONStyleBaseProperty.IsDefault] = boolToInt(paragraphStyle.isDefault);
            jsonParagraphStyle[JSONStyleBaseProperty.Base64EncodedImage] = paragraphStyle.base64EncodedImage;
            jsonParagraphStyle[JSONParagraphStyleProperty.CharacterPropertiesCacheIndex] =
                maskedCharacterPropertiesCache.indexOf(paragraphStyle.maskedCharacterProperties);
            jsonParagraphStyle[JSONParagraphStyleProperty.ParagraphPropertiesCacheIndex] =
                maskedParagraphPropertiesCache.indexOf(paragraphStyle.maskedParagraphProperties);
            jsonParagraphStyle[JSONParagraphStyleProperty.LinkedStyleName] =
                paragraphStyle.linkedStyle ? paragraphStyle.linkedStyle.styleName : "";
            jsonParagraphStyle[JSONParagraphStyleProperty.NextParagraphStyleName] =
                paragraphStyle.nextParagraphStyle ? paragraphStyle.nextParagraphStyle.styleName : "";
            jsonParagraphStyle[JSONParagraphStyleProperty.AutoUpdate] = boolToInt(paragraphStyle.autoUpdate);
            jsonParagraphStyle[JSONParagraphStyleProperty.Tabs] = JSONTabConverter.convertFromTabPropertiesToJSON(paragraphStyle.tabs);
            jsonParagraphStyle[JSONParagraphStyleProperty.NumberingListIndex] = paragraphStyle.numberingListIndex;
            jsonParagraphStyle[JSONParagraphStyleProperty.ListLevelIndex] = paragraphStyle.listLevelIndex;
            jsonParagraphStyles.push(jsonParagraphStyle);
        }
        return jsonParagraphStyles;
    }
    static exportNumberingStyles(documentModel) {
        let jsonNumberingStyles = [];
        for (let numberingStyle of documentModel.numberingListStyles) {
            let jsonNumberingStyle = {};
            jsonNumberingStyle[JSONStyleBaseProperty.StyleName] = numberingStyle.styleName;
            jsonNumberingStyle[JSONStyleBaseProperty.Deleted] = boolToInt(numberingStyle.deleted);
            jsonNumberingStyle[JSONStyleBaseProperty.Hidden] = boolToInt(numberingStyle.hidden);
            jsonNumberingStyle[JSONStyleBaseProperty.ParentStyleName] = numberingStyle.parent ? numberingStyle.parent.styleName : "";
            jsonNumberingStyle[JSONStyleBaseProperty.Semihidden] = boolToInt(numberingStyle.semihidden);
            jsonNumberingStyle[JSONStyleBaseProperty.LocalizedStyleName] = numberingStyle.localizedName;
            jsonNumberingStyle[JSONStyleBaseProperty.IsDefault] = boolToInt(numberingStyle.isDefault);
            jsonNumberingStyle[JSONStyleBaseProperty.Base64EncodedImage] = numberingStyle.base64EncodedImage;
            jsonNumberingStyle[JSONNumberingListStyleProperty.NumberingListIndex] = numberingStyle.numberingListIndex;
            jsonNumberingStyles.push(jsonNumberingStyle);
        }
        return jsonNumberingStyles;
    }
    static exportTableStyles(documentModel) {
        let jsonTableStyles = [];
        for (let tableStyle of documentModel.tableStyles) {
            let jsonTableStyle = {};
            jsonTableStyle[JSONStyleBaseProperty.StyleName] = tableStyle.styleName;
            jsonTableStyle[JSONStyleBaseProperty.Deleted] = boolToInt(tableStyle.deleted);
            jsonTableStyle[JSONStyleBaseProperty.Hidden] = boolToInt(tableStyle.hidden);
            jsonTableStyle[JSONStyleBaseProperty.ParentStyleName] = tableStyle.parent ? tableStyle.parent.styleName : "";
            jsonTableStyle[JSONStyleBaseProperty.Semihidden] = boolToInt(tableStyle.semihidden);
            jsonTableStyle[JSONStyleBaseProperty.LocalizedStyleName] = tableStyle.localizedName;
            jsonTableStyle[JSONStyleBaseProperty.IsDefault] = boolToInt(tableStyle.isDefault);
            jsonTableStyle[JSONStyleBaseProperty.Base64EncodedImage] = tableStyle.base64EncodedImage;
            jsonTableStyle[JSONTableStyleProperty.BaseConditionalStyle] =
                JSONTableConditionalStyleConverter.convertToJSON(documentModel, tableStyle.baseConditionalStyle);
            jsonTableStyle[JSONTableStyleProperty.ConditionalStyles] =
                JSONTableConditionalStyleConverter.convertStylesToJSON(documentModel, tableStyle.conditionalStyles);
            jsonTableStyles.push(jsonTableStyle);
        }
        return jsonTableStyles;
    }
    static importCharacterStyles(documentModel, content) {
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const charStyles = documentModel.characterStyles;
        for (let jsonStyle of content) {
            charStyles.push(new CharacterStyle(jsonStyle[JSONStyleBaseProperty.StyleName], jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], maskedCharacterPropertiesCache.getItemByJsonKey(jsonStyle[JSONCharacterStyleProperty.CharacterPropertiesCacheIndex]), jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
        }
    }
    static importParagraphStyles(documentModel, content) {
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        const parStyles = documentModel.paragraphStyles;
        for (let jsonStyle of content) {
            parStyles.push(new ParagraphStyle(jsonStyle[JSONStyleBaseProperty.StyleName], jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], maskedCharacterPropertiesCache.getItemByJsonKey(jsonStyle[JSONParagraphStyleProperty.CharacterPropertiesCacheIndex]), maskedParagraphPropertiesCache.getItemByJsonKey(jsonStyle[JSONParagraphStyleProperty.ParagraphPropertiesCacheIndex]), JSONTabConverter.convertFromJSONToTabProperties(jsonStyle[JSONParagraphStyleProperty.Tabs]), !!jsonStyle[JSONParagraphStyleProperty.AutoUpdate], jsonStyle[JSONParagraphStyleProperty.NumberingListIndex], jsonStyle[JSONParagraphStyleProperty.ListLevelIndex], jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
        }
    }
    static importNumberingStyles(documentModel, content) {
        const numListStyles = documentModel.numberingListStyles;
        for (let jsonStyle of content)
            numListStyles.push(new NumberingListStyle(jsonStyle[JSONStyleBaseProperty.StyleName], jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], jsonStyle[JSONNumberingListStyleProperty.NumberingListIndex]));
    }
    static importTableStyles(documentModel, content) {
        const tblStyles = documentModel.tableStyles;
        for (let jsonStyle of content) {
            tblStyles.push(new TableStyle(jsonStyle[JSONStyleBaseProperty.StyleName], jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], JSONTableConditionalStyleConverter.convertStylesFromJSON(jsonStyle[JSONTableStyleProperty.ConditionalStyles], documentModel.cache), JSONTableConditionalStyleConverter.convertFromJSON(jsonStyle[JSONTableStyleProperty.BaseConditionalStyle], documentModel.cache), jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
        }
    }
    static finishCharacterStylesImport(documentModel, content) {
        for (var i = 0, style; style = documentModel.characterStyles[i]; i++) {
            const jsonStyle = content[i];
            const parentStyleName = jsonStyle[JSONStyleBaseProperty.ParentStyleName];
            if (parentStyleName)
                style.parent = documentModel.getCharacterStyleByName(parentStyleName);
            const linkedStyle = jsonStyle[JSONCharacterStyleProperty.LinkedStyleName];
            if (linkedStyle !== undefined)
                style.linkedStyle = documentModel.getParagraphStyleByName(linkedStyle);
        }
    }
    static finishParagraphStylesImport(documentModel, content) {
        for (var i = 0, style; style = documentModel.paragraphStyles[i]; i++) {
            const jsonStyle = content[i];
            const parentStyleName = jsonStyle[JSONStyleBaseProperty.ParentStyleName];
            if (parentStyleName)
                style.parent = documentModel.getParagraphStyleByName(parentStyleName);
            const linkedStyle = jsonStyle[JSONParagraphStyleProperty.LinkedStyleName];
            if (linkedStyle !== undefined)
                style.linkedStyle = documentModel.getCharacterStyleByName(linkedStyle);
            const nextParStyleName = jsonStyle[JSONParagraphStyleProperty.NextParagraphStyleName];
            if (nextParStyleName !== undefined)
                style.nextParagraphStyle = documentModel.getParagraphStyleByName(nextParStyleName);
        }
    }
    static finishNumberingListStylesImport(documentModel, content) {
        for (var i = 0, style; style = documentModel.numberingListStyles[i]; i++)
            style.parent = documentModel.getNumberingListStyleByName(content[i][JSONStyleBaseProperty.ParentStyleName]);
    }
    static finishTableStylesImport(documentModel, content) {
        for (var i = 0, style; style = documentModel.tableStyles[i]; i++)
            style.parent = documentModel.getTableStyleByName(content[i][JSONStyleBaseProperty.ParentStyleName]);
    }
}
