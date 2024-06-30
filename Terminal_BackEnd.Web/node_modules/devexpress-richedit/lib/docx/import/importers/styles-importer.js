import { MaskedCharacterProperties } from '../../../core/model/character/character-properties';
import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { CharacterStyle } from '../../../core/model/character/character-style';
import { CharacterPropertiesMask } from '../../../core/model/character/enums';
import { NumberingList } from '../../../core/model/numbering-lists/numbering-list';
import { NumberingListStyle } from '../../../core/model/numbering-lists/numbering-list-style';
import { MaskedParagraphProperties, ParagraphPropertiesMask, ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { ParagraphStyle, TabProperties } from '../../../core/model/paragraph/paragraph-style';
import { TableCellProperties, TableCellPropertiesMask } from '../../../core/model/tables/properties/table-cell-properties';
import { TableProperties, TablePropertiesMask } from '../../../core/model/tables/properties/table-properties';
import { TableRowProperties, TableRowPropertiesMask } from '../../../core/model/tables/properties/table-row-properties';
import { TableCellStyle } from '../../../core/model/tables/styles/table-cell-style';
import { TableConditionalStyle } from '../../../core/model/tables/styles/table-conditional-style';
import { TableStyle } from '../../../core/model/tables/styles/table-style';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { StylesManager as CoreStylesManager } from '../../../core/model/styles-manager';
export class OpenXmlStyleInfo {
    constructor() {
        this.id = '';
        this.name = '';
        this.parentId = '';
        this.linkedId = '';
        this.semiHidden = false;
        this.hidden = false;
        this.nextId = '';
        this.isDefault = false;
        this.qFormat = false;
        this.numberingId = -1;
    }
}
export class StyleManager {
    constructor(data) {
        this.isDefaultProcessed = false;
        this.info = {};
        this.registered = {};
        this.data = data;
        this.defaultStyle = this.getDefault();
    }
    startImport() {
        this.currInfo = new OpenXmlStyleInfo();
    }
    endImport(dest) {
        if (StringUtils.isNullOrEmpty(this.currInfo.id))
            return null;
        this.info[this.currInfo.id] = this.currInfo;
        this.registered[this.currInfo.name] = true;
        return this.currInfo.style = this.addStyle(dest);
    }
    getNumberingListIndex(numberingId) {
        if (!numberingId)
            return -1;
        const info = this.data.stylesImporter.listInfos[numberingId];
        return info ? info.listIndex : -1;
    }
    addInfo(styleInfo, styleName) {
        this.info[styleInfo.id] = styleInfo;
        this.registered[styleName] = true;
    }
    getStyleById(styleId) {
        const styleInfo = this.getStyleInfoCore(styleId);
        return styleInfo ? styleInfo.style : null;
    }
    getInfoById(styleId) {
        const styleInfo = this.getStyleInfoCore(styleId);
        return styleInfo ? styleInfo : null;
    }
    isRegistered(styleName) {
        return !!this.registered[styleName];
    }
    determineParents() {
        StringMapUtils.forEach(this.info, (styleInfo) => styleInfo.style.parent = this.getStyleById(styleInfo.parentId));
    }
    foreachInfo(action) {
        StringMapUtils.forEach(this.info, (info) => action(info));
    }
    addStyle(dest) {
        if (this.currInfo.isDefault && !this.isDefaultProcessed) {
            this.isDefaultProcessed = true;
            if (this.defaultStyle.styleName === this.currInfo.name)
                this.applyProperties(dest, this.defaultStyle);
            else
                this.defaultStyle = this.addToModel(this.applyProperties(dest, this.createEmpty()));
            return this.defaultStyle;
        }
        else {
            const presetStyle = this.getPresetStyleByName(this.currInfo.name);
            if (presetStyle)
                this.currInfo.name = presetStyle.styleName;
            let style = this.getFromModelByName(this.currInfo.name);
            if (style && style.id && style.id != this.currInfo.id) {
                this.currInfo.name = this.currInfo.id;
                style = this.getFromModelByName(this.currInfo.name);
            }
            return style ?
                this.applyProperties(dest, style) :
                this.addToModel(this.applyProperties(dest, this.createEmpty()));
        }
    }
    applyPropertiesBase(style) {
        style.styleName = this.currInfo.name;
        style.semihidden = this.currInfo.semiHidden;
        style.hidden = this.currInfo.hidden;
        style.primary = this.currInfo.qFormat;
        style.id = this.currInfo.id;
    }
    getStyleInfoCore(id) {
        return StringUtils.isNullOrEmpty(id) ? null : this.info[id];
    }
}
export class ParagraphStyleManager extends StyleManager {
    getDefault() { return this.data.documentModel.getDefaultParagraphStyle(); }
    getFromModelByName(name) { return this.data.documentModel.stylesManager.getParagraphStyleByName(name); }
    createEmpty() { return new ParagraphStyle('', '', false, false, false, false, null, null, null, false, -1, -1, ''); }
    addToModel(style) { return this.data.documentModel.stylesManager.addParagraphStyle(style); }
    applyProperties(dest, style) {
        this.applyPropertiesBase(style);
        style.localizedName = CoreStylesManager.getPresetParagraphStyleLocalizedName(style.styleName);
        style.numberingListIndex = this.getNumberingListIndex(dest.numberingId);
        style.listLevelIndex = dest.listLevelIndex;
        style.maskedCharacterProperties = dest.characterFormatting.clone();
        style.maskedParagraphProperties = dest.paragraphFormatting.clone();
        style.tabs = dest.tabs;
        if (this.currInfo.numberingId == NumberingList.NoNumberingListIndex)
            style.numberingListIndex = NumberingList.NoNumberingListIndex;
        return style;
    }
    getPresetStyleByName(name) {
        return CoreStylesManager.getPresetParagraphStyleByName(name, true);
    }
}
export class CharacterStyleManager extends StyleManager {
    getDefault() { return this.data.documentModel.getDefaultCharacterStyle(); }
    getFromModelByName(name) { return this.data.documentModel.stylesManager.getCharacterStyleByName(name); }
    createEmpty() { return new CharacterStyle('', '', false, false, false, false, null, ''); }
    addToModel(style) { return this.data.documentModel.stylesManager.addCharacterStyle(style); }
    applyProperties(dest, style) {
        this.applyPropertiesBase(style);
        style.maskedCharacterProperties = dest.characterFormatting.clone();
        style.localizedName = CoreStylesManager.getPresetCharacterStyleLocalizedName(style.styleName);
        return style;
    }
    getPresetStyleByName(name) {
        return CoreStylesManager.getPresetCharacterStyleByName(name, true);
    }
}
export class TableStyleManager extends StyleManager {
    constructor() {
        super(...arguments);
        this.conditionalTableFormattingInfoList = [];
    }
    getDefault() { return this.data.documentModel.getDefaultTableStyle(); }
    getFromModelByName(name) { return this.data.documentModel.stylesManager.getTableStyleByName(name); }
    createEmpty() {
        return new TableStyle('', '', false, false, false, false, {}, new TableConditionalStyle(null, null, null, null, null, null), '');
    }
    addToModel(style) { return this.data.documentModel.stylesManager.addTableStyle(style); }
    applyProperties(dest, style) {
        this.applyPropertiesBase(style);
        style.localizedName = CoreStylesManager.getPresetTableStyleLocalizedName(style.styleName);
        const isNormalTableStyle = style.styleName == TableStyle.DEFAULT_STYLENAME;
        if ((isNormalTableStyle &&
            (dest.tableProperties.getUseValue(TablePropertiesMask.UseLeftMargin) ||
                dest.tableProperties.getUseValue(TablePropertiesMask.UseRightMargin) ||
                dest.tableProperties.getUseValue(TablePropertiesMask.UseBottomMargin) ||
                dest.tableProperties.getUseValue(TablePropertiesMask.UseTopMargin)))
            || !isNormalTableStyle)
            style.baseConditionalStyle.tableProperties = dest.tableProperties.clone();
        style.baseConditionalStyle.tableRowProperties = dest.tableRowProperties.clone();
        style.baseConditionalStyle.tableCellProperties = dest.tableCellProperties.clone();
        style.baseConditionalStyle.maskedCharacterProperties = dest.characterFormatting.clone();
        style.baseConditionalStyle.maskedParagraphProperties = dest.paragraphFormatting.clone();
        style.baseConditionalStyle.tabs = dest.tabs.clone();
        for (const ctf of this.conditionalTableFormattingInfoList)
            style.conditionalStyles[ctf.conditionType] = new TableConditionalStyle(ctf.tableProperties.clone(), ctf.tableRowProperties.clone(), ctf.tableCellProperties.clone(), ctf.paragraphFormatting.clone(), ctf.characterFormatting.clone(), ctf.tabs.clone());
        return style;
    }
    getPresetStyleByName(name) {
        return CoreStylesManager.getPresetTableStyleByName(name, true);
    }
}
export class TableCellStyleManager extends StyleManager {
    getDefault() { return this.data.documentModel.getDefaultTableCellStyle(); }
    getFromModelByName(name) { return this.data.documentModel.stylesManager.getTableCellStyleByName(name); }
    createEmpty() { return new TableCellStyle('', '', false, false, false, false, null, null); }
    addToModel(style) { return this.data.documentModel.stylesManager.addTableCellStyle(style); }
    applyProperties(dest, style) {
        this.applyPropertiesBase(style);
        style.tableCellProperties = dest.tableCellProperties.clone();
        style.characterProperties = dest.characterFormatting.clone();
        return style;
    }
    getPresetStyleByName(_name) {
        return null;
    }
}
export class NumberingListStyleManager extends StyleManager {
    getDefault() { return this.createEmpty(); }
    getFromModelByName(name) { return this.data.documentModel.stylesManager.getNumberingListStyleByName(name); }
    createEmpty() { return new NumberingListStyle('', '', false, false, false, false, -1); }
    addToModel(style) {
        const id = this.data.documentModel.numberingListStyles.push(style) - 1;
        return this.data.documentModel.numberingListStyles[id];
    }
    removeFromModel(style) {
        const index = this.data.documentModel.numberingListStyles.indexOf(style);
        if (index && index >= 0)
            this.data.documentModel.numberingListStyles.splice(index, 1);
    }
    applyProperties(dest, style) {
        this.applyPropertiesBase(style);
        style.numberingListIndex = this.getNumberingListIndex(dest.numberingId);
        style.isDefault = this.currInfo.isDefault;
        return style;
    }
    addStyle(dest) {
        const style = this.getFromModelByName(this.currInfo.name);
        if (style)
            return style;
        return this.addToModel(this.applyProperties(dest, this.createEmpty()));
    }
    getPresetStyleByName(_name) {
        return null;
    }
}
export class StylesImporter {
    constructor(data) {
        this.data = data;
        this.paragraphManager = new ParagraphStyleManager(data);
        this.characterManager = new CharacterStyleManager(data);
        this.tableManager = new TableStyleManager(data);
        this.tableCellManager = new TableCellStyleManager(data);
        this.numberingListManager = new NumberingListStyleManager(data);
        this.abstractListInfos = {};
        this.listInfos = {};
        this.deferredStyles = [];
        this.numberingStyleInfos = {};
    }
    findNumberingListInfoById(id) {
        return this.listInfos[id];
    }
    addListInfo(listInfo) {
        this.listInfos[listInfo.id] = listInfo;
    }
    addAbstractListInfo(abstractListInfo) {
        this.abstractListInfos[abstractListInfo.abstractNumberingListId] = abstractListInfo;
    }
    addNumberingListStyleInfo(styleInfo) {
        this.numberingStyleInfos[styleInfo.id] = styleInfo;
    }
    presetDefaultStyles() {
        const emptyCharProps = this.data.documentModel.defaultCharacterProperties.clone();
        emptyCharProps.setUseValue(CharacterPropertiesMask.UseAll, false);
        const emptyParProps = this.data.documentModel.defaultParagraphProperties.clone();
        emptyParProps.setUseValue(ParagraphPropertiesMask.UseAll, false);
        const tblProps = new TableProperties();
        tblProps.setUseValue(TablePropertiesMask.UseAll, false);
        const tblRowProps = new TableRowProperties();
        tblRowProps.setUseValue(TableRowPropertiesMask.UseAll, false);
        const tblCellProps = new TableCellProperties();
        tblCellProps.setUseValue(TableCellPropertiesMask.UseAll, false);
        this.data.documentModel.stylesManager.addCharacterStyle(new CharacterStyle(CharacterStyle.defaultParagraphCharacterStyleName, CharacterStyle.defaultParagraphCharacterStyleName, false, false, false, true, emptyCharProps));
        this.data.documentModel.stylesManager.addParagraphStyle(new ParagraphStyle(ParagraphStyle.normalStyleName, ParagraphStyle.normalStyleName, false, false, false, true, emptyCharProps, emptyParProps, new TabProperties(), false, NumberingList.NumberingListNotSettedIndex, 0, ''));
        this.data.documentModel.stylesManager.addTableStyle(new TableStyle(TableStyle.DEFAULT_STYLENAME, TableStyle.DEFAULT_STYLENAME, false, false, true, true, {}, new TableConditionalStyle(tblProps, tblRowProps, tblCellProps, emptyParProps, emptyCharProps, new TabProperties()), ''));
        this.data.documentModel.stylesManager.addTableCellStyle(new TableCellStyle(TableCellStyle.DEFAULT_STYLENAME, TableCellStyle.DEFAULT_STYLENAME, false, false, false, true, tblCellProps, emptyCharProps));
    }
    determineParents() {
        this.characterManager.determineParents();
        this.paragraphManager.determineParents();
        this.tableManager.determineParents();
        this.tableCellManager.determineParents();
        this.numberingListManager.determineParents();
    }
    linkStyles() {
        this.characterManager.foreachInfo((charInfo) => {
            const parStyle = this.paragraphManager.getStyleById(charInfo.linkedId);
            if (parStyle) {
                parStyle.linkedStyle = charInfo.style;
                charInfo.style.linkedStyle = parStyle;
            }
        });
        this.paragraphManager.foreachInfo((parInfo) => parInfo.style.nextParagraphStyle = this.paragraphManager.getStyleById(parInfo.nextId));
    }
    presetDefaultProperties() {
        if (!this.data.documentModel.defaultCharacterProperties) {
            const prop = new MaskedCharacterProperties();
            ListUtils.forEach(CharacterPropertyDescriptor.ALL_FIELDS, (desc) => desc.setProp(prop, desc.defaultValue));
            prop.fontInfo = prop.fontInfo.clone();
            prop.fontInfo.measurer = this.data.documentModel.cache.fontInfoCache.fontMeasurer;
            prop.setAllUse();
            this.data.documentModel.defaultCharacterProperties = prop;
        }
        if (!this.data.documentModel.defaultParagraphProperties) {
            const prop = new MaskedParagraphProperties();
            ListUtils.forEach(ParagraphPropertyDescriptor.ALL_FIELDS, (desc) => desc.setProp(prop, desc.defaultValue));
            prop.useValue = ParagraphPropertiesMask.UseAll;
            this.data.documentModel.defaultParagraphProperties = prop;
        }
        if (!this.data.documentModel.defaultTableProperties) {
            const prop = new TableProperties();
            prop.setUseValue(TablePropertiesMask.UseAll, false);
            this.data.documentModel.defaultTableProperties = prop;
        }
        if (!this.data.documentModel.defaultTableRowProperties) {
            const prop = new TableRowProperties();
            prop.setUseValue(TableRowPropertiesMask.UseAll, false);
            this.data.documentModel.defaultTableRowProperties = prop;
        }
        if (!this.data.documentModel.defaultTableCellProperties) {
            const prop = new TableCellProperties();
            prop.setUseValue(TableCellPropertiesMask.UseAll, false);
            this.data.documentModel.defaultTableCellProperties = prop;
        }
    }
    createNumberingLists(documentModel) {
        let innerId = 1;
        NumberMapUtils.forEach(this.listInfos, (listInfo) => {
            const abstractNumberingInfo = this.findAbstractListInfosById(listInfo.abstractNumberingListId);
            if (abstractNumberingInfo != null) {
                const list = new NumberingList(documentModel, abstractNumberingInfo.abstractNumberingIndex);
                list.innerId = listInfo.id;
                const count = listInfo.levelOverrides.length;
                for (let i = 0; i < count; i++) {
                    const listLevelOverride = listInfo.levelOverrides[i];
                    list.levels[listLevelOverride.levelIndex] = listLevelOverride.getOverrideListLevelCore(list.levels[listLevelOverride.levelIndex]);
                }
                listInfo.listIndex = documentModel.numberingLists.length;
                documentModel.numberingLists.push(list);
                if (list.innerId == -1) {
                    while (ListUtils.elementBy(documentModel.numberingLists, list => list.innerId == innerId))
                        innerId++;
                    list.innerId = innerId++;
                }
                list.deleted = false;
            }
        });
    }
    findAbstractListInfosById(abstractNumberingListId) {
        return this.abstractListInfos[abstractNumberingListId];
    }
}
