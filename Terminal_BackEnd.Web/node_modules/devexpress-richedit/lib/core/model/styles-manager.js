import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { DocumentCache } from './caches/caches';
import { FontInfoCache } from './caches/hashed-caches/font-info-cache';
import { CharacterStyle } from './character/character-style';
import { JSONCharacterStyleProperty, JSONParagraphStyleProperty, JSONStyleBaseProperty, JSONStylesGalleryHeader, JSONStylesProperty, JSONTableStyleProperty } from './json/enums/json-style-enums';
import { JSONTabConverter } from './json/importers/json-tab-converter';
import { JSONTableConditionalStyleConverter } from './json/importers/table/json-table-conditional-style-converter';
import { WebCachesExporter } from './json/web-caches-exporter';
import { ParagraphStyle } from './paragraph/paragraph-style';
import { TableCellStyle } from './tables/styles/table-cell-style';
import { TableConditionalStyle } from './tables/styles/table-conditional-style';
import { TableStyle } from './tables/styles/table-style';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class StylesManager {
    constructor(documentModel) {
        this.characterAndParagraphStyleGalleryItems = [[], []];
        this.characterStyleNameToIndex = {};
        this.paragraphStyleNameToIndex = {};
        this.numberingListStyleNameToIndex = {};
        this.tableStyleNameToIndex = {};
        this.tableCellStyleNameToIndex = {};
        this.documentModel = documentModel;
    }
    static isParagraphStyle(styleNameWithPrefix) {
        return StringUtils.startsAt(styleNameWithPrefix, StylesManager.paragraphPrefix);
    }
    static getStyleNameWithoutPrefix(styleName) {
        if (StylesManager.paragraphPrefix && StylesManager.isParagraphStyle(styleName))
            return styleName.substr(StylesManager.paragraphPrefix.length);
        return styleName.substr(StylesManager.characterPrefix.length);
    }
    initCharacterAndParagraphStyleGalleryItems() {
        const items = [[], []];
        for (let ps of this.documentModel.paragraphStyles) {
            if (!ps.deleted && !ps.hidden && !ps.semihidden)
                items[0].push({ value: StylesManager.paragraphPrefix + ps.styleName, text: ps.localizedName, data: ps.base64EncodedImage });
        }
        for (let cs of this.documentModel.characterStyles) {
            if (!cs.deleted && !cs.hidden && !cs.semihidden && !cs.linkedStyle)
                items[1].push({ value: StylesManager.characterPrefix + cs.styleName, text: cs.localizedName, data: cs.base64EncodedImage });
        }
        for (let ps of StylesManager.presetParagraphStyles) {
            if (!ps.deleted && !ps.hidden && !ps.semihidden && !this.documentModel.getParagraphStyleByName(ps.styleName))
                items[0].push({ value: StylesManager.paragraphPrefix + ps.styleName, text: ps.localizedName, data: ps.base64EncodedImage });
        }
        for (let cs of StylesManager.presetCharacterStyles) {
            if (!cs.deleted && !cs.hidden && !cs.semihidden && !cs.linkedStyle && !this.documentModel.getCharacterStyleByName(cs.styleName))
                items[1].push({ value: StylesManager.characterPrefix + cs.styleName, text: cs.localizedName, data: cs.base64EncodedImage });
        }
        this.characterAndParagraphStyleGalleryItems = items;
    }
    registerLink(characterStyle, paragraphStyle) {
        characterStyle.linkedStyle = paragraphStyle;
        paragraphStyle.linkedStyle = characterStyle;
    }
    unregisterLink(characterStyle, paragraphStyle) {
        characterStyle.linkedStyle = null;
        paragraphStyle.linkedStyle = null;
    }
    getCharacterStyleByName(styleName) {
        return StylesManager.getStyleByNameCore(styleName, this.documentModel.characterStyles, this.characterStyleNameToIndex);
    }
    getParagraphStyleByName(styleName) {
        return StylesManager.getStyleByNameCore(styleName, this.documentModel.paragraphStyles, this.paragraphStyleNameToIndex);
    }
    getNumberingListStyleByName(styleName) {
        return StylesManager.getStyleByNameCore(styleName, this.documentModel.numberingListStyles, this.numberingListStyleNameToIndex);
    }
    getTableStyleByName(styleName) {
        return StylesManager.getStyleByNameCore(styleName, this.documentModel.tableStyles, this.tableStyleNameToIndex);
    }
    getTableCellStyleByName(styleName) {
        return StylesManager.getStyleByNameCore(styleName, this.documentModel.tableCellStyles, this.tableCellStyleNameToIndex);
    }
    getDefaultCharacterStyle() {
        return this.defaultCharacterStyle || this.getDefaultStyleCore(this.documentModel.characterStyles, (style) => {
            this.defaultCharacterStyle = style;
        });
    }
    getDefaultParagraphStyle() {
        return this.defaultParagraphStyle || this.getDefaultStyleCore(this.documentModel.paragraphStyles, (style) => {
            this.defaultParagraphStyle = style;
        });
    }
    getDefaultTableStyle() {
        return this.getTableStyleByName(TableStyle.DEFAULT_STYLENAME) || this.getTableStyleByName(TableStyle.DEFAULT_STYLENAME_2) || this.documentModel.tableStyles[0] || null;
    }
    getDefaultTableCellStyle() {
        return this.getTableCellStyleByName(TableCellStyle.DEFAULT_STYLENAME) || this.documentModel.tableCellStyles[0] || null;
    }
    addCharacterStyle(style) {
        return style ? this.getCharacterStyleByName(style.styleName) || this.addCharacterStyleCore(style) : null;
    }
    registerCharacterStyle(style) {
        this.characterStyleNameToIndex[style.styleName] = this.documentModel.characterStyles.push(style) - 1;
    }
    removeLastStyle() {
        var style = this.documentModel.characterStyles.pop();
        delete this.characterStyleNameToIndex[style.styleName];
    }
    addParagraphStyle(style) {
        return style ? this.getParagraphStyleByName(style.styleName) || this.addParagraphStyleCore(style) : null;
    }
    registerParagraphStyle(style) {
        this.paragraphStyleNameToIndex[style.styleName] = this.documentModel.paragraphStyles.push(style) - 1;
    }
    addTableStyle(style) {
        return style ? this.getTableStyleByName(style.styleName) || this.addTableStyleCore(style) : null;
    }
    registerTableStyle(style) {
        this.tableStyleNameToIndex[style.styleName] = this.documentModel.tableStyles.push(style) - 1;
    }
    addTableCellStyle(style) {
        return style ? this.getTableCellStyleByName(style.styleName) || this.addTableCellStyleCore(style) : null;
    }
    addTableStyleCore(oldStyle) {
        var newStyle = oldStyle.clone();
        this.tableStyleNameToIndex[newStyle.styleName] = this.documentModel.tableStyles.push(newStyle) - 1;
        NumberMapUtils.forEach(oldStyle.conditionalStyles, (style, type) => newStyle.conditionalStyles[type] = this.cloneTableConditionalStyle(style));
        return newStyle;
    }
    addTableCellStyleCore(oldStyle) {
        var newStyle = oldStyle.clone();
        newStyle.characterProperties = this.documentModel.cache.mergedCharacterPropertiesCache.getItem(oldStyle.characterProperties);
        newStyle.tableCellProperties = this.documentModel.cache.tableCellPropertiesCache.getItem(oldStyle.tableCellProperties);
        return newStyle;
    }
    cloneTableConditionalStyle(style) {
        let maskedCharacterProperties = style.maskedCharacterProperties;
        if (maskedCharacterProperties.fontInfo && maskedCharacterProperties.fontInfo.measurer === undefined)
            maskedCharacterProperties.fontInfo = this.documentModel.cache.fontInfoCache.getItemByName(maskedCharacterProperties.fontInfo.name);
        return new TableConditionalStyle(style.tableProperties.clone(), this.documentModel.cache.tableRowPropertiesCache.getItem(style.tableRowProperties), this.documentModel.cache.tableCellPropertiesCache.getItem(style.tableCellProperties), this.documentModel.cache.maskedParagraphPropertiesCache.getItem(style.maskedParagraphProperties), this.documentModel.cache.maskedCharacterPropertiesCache.getItem(maskedCharacterProperties), style.tabs.clone());
    }
    addCharacterStyleCore(oldStyle) {
        var newStyle = oldStyle.clone();
        this.registerCharacterStyle(newStyle);
        let maskedCharacterProperties = oldStyle.maskedCharacterProperties;
        if (maskedCharacterProperties.fontInfo && maskedCharacterProperties.fontInfo.measurer === undefined)
            maskedCharacterProperties.fontInfo = this.documentModel.cache.fontInfoCache.getItemByName(maskedCharacterProperties.fontInfo.name);
        newStyle.maskedCharacterProperties = this.documentModel.cache.maskedCharacterPropertiesCache.getItem(maskedCharacterProperties);
        newStyle.parent = this.addCharacterStyle(oldStyle.parent);
        newStyle.linkedStyle = this.addParagraphStyle(oldStyle.linkedStyle);
        return newStyle;
    }
    addParagraphStyleCore(oldStyle) {
        var newStyle = oldStyle.clone();
        this.registerParagraphStyle(newStyle);
        let maskedCharacterProperties = oldStyle.maskedCharacterProperties;
        if (maskedCharacterProperties.fontInfo && maskedCharacterProperties.fontInfo.measurer === undefined)
            maskedCharacterProperties.fontInfo = this.documentModel.cache.fontInfoCache.getItemByName(maskedCharacterProperties.fontInfo.name);
        newStyle.maskedCharacterProperties = this.documentModel.cache.maskedCharacterPropertiesCache.getItem(maskedCharacterProperties);
        newStyle.maskedParagraphProperties = this.documentModel.cache.maskedParagraphPropertiesCache.getItem(oldStyle.maskedParagraphProperties);
        newStyle.linkedStyle = this.addCharacterStyle(oldStyle.linkedStyle);
        newStyle.parent = this.addParagraphStyle(oldStyle.parent);
        return newStyle;
    }
    getDefaultStyleCore(styles, updateCache) {
        for (var i = 0, style; style = styles[i]; i++) {
            if (style.isDefault) {
                updateCache(style);
                return style;
            }
        }
    }
    static getPresetCharacterStyleLocalizedName(styleName) {
        const style = this.getStyleByNameCore(styleName, this.presetCharacterStyles, this.presetCharacterStyleNameToIndex);
        return style && style.localizedName ? style.localizedName : styleName;
    }
    static getPresetParagraphStyleLocalizedName(styleName) {
        const style = this.getStyleByNameCore(styleName, this.presetParagraphStyles, this.presetParagraphStyleNameToIndex);
        return style && style.localizedName ? style.localizedName : styleName;
    }
    static getPresetTableStyleLocalizedName(styleName) {
        const style = this.getStyleByNameCore(styleName, this.presetTableStyles, this.presetTableStyleNameToIndex);
        return style && style.localizedName ? style.localizedName : styleName;
    }
    static getPresetCharacterStyleByName(styleName, ignoreCase = false) {
        return this.getStyleByNameCore(styleName, this.presetCharacterStyles, this.presetCharacterStyleNameToIndex, ignoreCase);
    }
    static getPresetParagraphStyleByName(styleName, ignoreCase = false) {
        return this.getStyleByNameCore(styleName, this.presetParagraphStyles, this.presetParagraphStyleNameToIndex, ignoreCase);
    }
    static getPresetTableStyleByName(styleName, ignoreCase = false) {
        return this.getStyleByNameCore(styleName, this.presetTableStyles, this.presetTableStyleNameToIndex, ignoreCase);
    }
    static populateGalleryHeaders(container) {
        StylesManager.characterStylesGalleryTitle = container[JSONStylesGalleryHeader.Character];
        StylesManager.paragraphStylesGalleryTitle = container[JSONStylesGalleryHeader.Paragraph];
        StylesManager.tableStylesGalleryTitle = container[JSONStylesGalleryHeader.Table];
    }
    static populatePresetStyles(stylesContainer) {
        if (StylesManager.presetCharacterStyles.length)
            return;
        const characterStylesContainer = stylesContainer[JSONStylesProperty.Character];
        const paragraphStylesContainer = stylesContainer[JSONStylesProperty.Paragraph];
        const tableStylesContainer = stylesContainer[JSONStylesProperty.Table];
        const documentCache = new DocumentCache();
        const webCaches = new WebCachesExporter(documentCache, stylesContainer[JSONStylesProperty.Caches], null);
        FontInfoCache.fillDefaultFonts(documentCache.fontInfoCache);
        StylesManager.populatePresetCharacterStyles(characterStylesContainer, documentCache);
        StylesManager.populatePresetParagraphStyles(paragraphStylesContainer, documentCache);
        StylesManager.populatePresetTableStyles(tableStylesContainer, documentCache);
        for (let i = 0, style; style = StylesManager.presetCharacterStyles[i]; i++) {
            const jsonStyle = characterStylesContainer[i];
            style.parent = StylesManager.getPresetCharacterStyleByName(jsonStyle[JSONStyleBaseProperty.ParentStyleName]);
            const linkedStyleName = jsonStyle[JSONCharacterStyleProperty.LinkedStyleName];
            if (linkedStyleName !== undefined)
                style.linkedStyle = StylesManager.getPresetParagraphStyleByName(linkedStyleName);
        }
        for (let i = 0, style; style = StylesManager.presetParagraphStyles[i]; i++) {
            const jsonStyle = paragraphStylesContainer[i];
            style.parent = StylesManager.getPresetParagraphStyleByName(jsonStyle[JSONStyleBaseProperty.ParentStyleName]);
            const linkedStyleName = jsonStyle[JSONParagraphStyleProperty.LinkedStyleName];
            if (linkedStyleName !== undefined)
                style.linkedStyle = StylesManager.getPresetCharacterStyleByName(linkedStyleName);
            const nextParStyleName = jsonStyle[JSONParagraphStyleProperty.NextParagraphStyleName];
            if (nextParStyleName !== undefined)
                style.nextParagraphStyle = StylesManager.getPresetParagraphStyleByName(nextParStyleName);
        }
        for (let i = 0, style; style = StylesManager.presetTableStyles[i]; i++)
            style.parent = StylesManager.getPresetTableStyleByName(tableStylesContainer[i][JSONStyleBaseProperty.ParentStyleName]);
        webCaches.dispose();
    }
    static populatePresetCharacterStyles(characterStylesContainer, cache) {
        StylesManager.presetCharacterStyles = [];
        if (characterStylesContainer) {
            for (let jsonStyle of characterStylesContainer) {
                const styleName = jsonStyle[JSONStyleBaseProperty.StyleName];
                StylesManager.presetCharacterStyles.push(new CharacterStyle(styleName, StylesManager.presetStylesLocalizedNames[styleName] || jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], cache.maskedCharacterPropertiesCache.getItemByJsonKey(jsonStyle[JSONCharacterStyleProperty.CharacterPropertiesCacheIndex]), jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
            }
        }
    }
    static populatePresetParagraphStyles(paragraphStylesContainer, cache) {
        StylesManager.presetParagraphStyles = [];
        if (paragraphStylesContainer) {
            for (let jsonStyle of paragraphStylesContainer) {
                const styleName = jsonStyle[JSONStyleBaseProperty.StyleName];
                StylesManager.presetParagraphStyles.push(new ParagraphStyle(styleName, StylesManager.presetStylesLocalizedNames[styleName] || jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], cache.maskedCharacterPropertiesCache.getItemByJsonKey(jsonStyle[JSONParagraphStyleProperty.CharacterPropertiesCacheIndex]), cache.maskedParagraphPropertiesCache.getItemByJsonKey(jsonStyle[JSONParagraphStyleProperty.ParagraphPropertiesCacheIndex]), JSONTabConverter.convertFromJSONToTabProperties(jsonStyle[JSONParagraphStyleProperty.Tabs]), !!jsonStyle[JSONParagraphStyleProperty.AutoUpdate], jsonStyle[JSONParagraphStyleProperty.NumberingListIndex], jsonStyle[JSONParagraphStyleProperty.ListLevelIndex], jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
            }
        }
    }
    static populatePresetTableStyles(tableStylesContainer, cache) {
        StylesManager.presetTableStyles = [];
        if (tableStylesContainer) {
            for (let jsonStyle of tableStylesContainer) {
                const styleName = jsonStyle[JSONStyleBaseProperty.StyleName];
                StylesManager.presetTableStyles.push(new TableStyle(styleName, StylesManager.presetStylesLocalizedNames[styleName] || jsonStyle[JSONStyleBaseProperty.LocalizedStyleName], !!jsonStyle[JSONStyleBaseProperty.Deleted], !!jsonStyle[JSONStyleBaseProperty.Hidden], !!jsonStyle[JSONStyleBaseProperty.Semihidden], !!jsonStyle[JSONStyleBaseProperty.IsDefault], JSONTableConditionalStyleConverter.convertStylesFromJSON(jsonStyle[JSONTableStyleProperty.ConditionalStyles], cache), JSONTableConditionalStyleConverter.convertFromJSON(jsonStyle[JSONTableStyleProperty.BaseConditionalStyle], cache), jsonStyle[JSONStyleBaseProperty.Base64EncodedImage]));
            }
        }
    }
    static getStyleByNameCore(styleName, styles, cache, ignoreCase = false) {
        var styleIndex = cache[styleName];
        if (styleIndex === undefined) {
            for (var i = 0, style; style = styles[i]; i++) {
                if (cache[style.styleName] === undefined)
                    cache[style.styleName] = i;
                if (this.compareNames(style.styleName, styleName, ignoreCase))
                    return style;
            }
            return null;
        }
        else
            return styles[styleIndex];
    }
    static compareNames(name1, name2, ignoreCase) {
        if ((name1 && !name2) || (!name1 && name2))
            return false;
        if (name1 === name2)
            return true;
        return ignoreCase ? name1.toLowerCase() === name2.toLowerCase() : false;
    }
    clone(documentModel) {
        const result = new StylesManager(documentModel);
        const copyStyles = (styles) => ListUtils.map(styles, (style) => {
            return { value: style.value, text: style.text, data: style.data };
        });
        result.characterAndParagraphStyleGalleryItems = [
            copyStyles(this.characterAndParagraphStyleGalleryItems[0]),
            copyStyles(this.characterAndParagraphStyleGalleryItems[1])
        ];
        result.documentModel = documentModel;
        result.characterStyleNameToIndex = StringMapUtils.shallowCopy(this.characterStyleNameToIndex);
        result.paragraphStyleNameToIndex = StringMapUtils.shallowCopy(this.paragraphStyleNameToIndex);
        result.numberingListStyleNameToIndex = StringMapUtils.shallowCopy(this.numberingListStyleNameToIndex);
        result.tableStyleNameToIndex = StringMapUtils.shallowCopy(this.tableStyleNameToIndex);
        result.tableCellStyleNameToIndex = StringMapUtils.shallowCopy(this.tableCellStyleNameToIndex);
        return result;
    }
}
StylesManager.characterPrefix = "";
StylesManager.paragraphPrefix = "¶";
StylesManager.characterStylesGalleryTitle = "Character Styles";
StylesManager.paragraphStylesGalleryTitle = "Paragraph Styles";
StylesManager.tableStylesGalleryTitle = "Table Styles";
StylesManager.presetStylesLocalizedNames = {};
StylesManager.presetCharacterStyleNameToIndex = {};
StylesManager.presetParagraphStyleNameToIndex = {};
StylesManager.presetTableStyleNameToIndex = {};
StylesManager.presetCharacterStyles = [];
StylesManager.presetParagraphStyles = [];
StylesManager.presetTableStyles = [];
