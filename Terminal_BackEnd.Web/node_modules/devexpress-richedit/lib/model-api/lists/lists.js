import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { ColorModelInfo } from '../../core/model/color/color-model-info';
import { ListLevelFontBoldHistoryItem, ListLevelFontItalicHistoryItem, ListLevelFontNameHistoryItem, ListLevelFontSizeHistoryItem, ListLevelFontTextColorHistoryItem } from '../../core/model/history/items/list-level-character-properties-history-items';
import { ListLevelParagraphFirstLineIndentHistoryItem, ListLevelParagraphFirstLineIndentTypeHistoryItem, ListLevelParagraphLeftIndentHistoryItem } from '../../core/model/history/items/list-level-paragraph-properties-history-items';
import { ListLevelAlignmentHistoryItem, ListLevelDisplayFormatStringHistoryItem, ListLevelFormatHistoryItem, ListLevelSeparatorHistoryItem, ListLevelStartHistoryItem } from '../../core/model/history/items/list-level-properties-history-items';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ApiUtils } from '../api-utils/api-utils';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { ParagraphFirstLineIndentApi } from '../paragraph';
import { ListLevelFormatApi, ListLevelNumberAlignmentApi, ListTypeApiConverter } from './enums';
import { ListLevelSettingsApi } from './list-level-settings';
export class ListApi {
    constructor(native, list) {
        this._native = native;
        this._list = list;
    }
    get index() {
        return this._native.model.numberingLists.indexOf(this._list);
    }
    get type() {
        return ListTypeApiConverter.toApiEnum(this._list.getListType());
    }
    get levelProperties() {
        const abstractNumberingList = this._list.getAbstractNumberingList();
        const value = [];
        for (var i = 0; i < abstractNumberingList.levels.length; i++) {
            const levelSettings = new ListLevelSettingsApi();
            const listLevel = abstractNumberingList.levels[i];
            const listLevelProperties = listLevel.getListLevelProperties();
            const paragraphProperties = listLevel.getParagraphProperties();
            const characterProperties = listLevel.getCharacterProperties();
            levelSettings.displayFormatString = listLevelProperties.displayFormatString;
            levelSettings.format = listLevelProperties.format;
            levelSettings.start = listLevelProperties.start;
            levelSettings.alignment = listLevelProperties.alignment;
            levelSettings.separator = listLevelProperties.separator;
            levelSettings.leftIndent = paragraphProperties.leftIndent;
            levelSettings.firstLineIndent = paragraphProperties.firstLineIndent;
            levelSettings.firstLineIndentType = paragraphProperties.firstLineIndentType;
            levelSettings.fontName = characterProperties.fontInfo.name;
            const foreColor = characterProperties.textColor.toRgb(this._native.model.colorProvider);
            levelSettings.fontColor = ColorUtils.colorToHash(foreColor);
            levelSettings.fontSize = characterProperties.fontSize;
            levelSettings.fontBold = characterProperties.fontBold;
            levelSettings.fontItalic = characterProperties.fontItalic;
            value.push(levelSettings);
        }
        return value;
    }
    set levelProperties(settings) {
        if (settings.length !== 9)
            throw new Error("listLevelSettings must have 9 elements");
        const modelManipulator = this._native.modelManipulator;
        const abstractNumberingListIndex = this._list.abstractNumberingListIndex;
        const initSettings = this.levelProperties;
        this._native.history.beginTransaction();
        for (let i = 0, listLevel; listLevel = settings[i]; i++) {
            let initLevel = initSettings[i];
            if (listLevel.alignment !== undefined && listLevel.alignment != initLevel.alignment) {
                ApiUtils.assertEnum(listLevel.alignment, ListLevelNumberAlignmentApi, "ListLevelNumberAlignment", `listLevelSettings[${i}].alignment`);
                this._native.history.addAndRedo(new ListLevelAlignmentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.alignment));
            }
            if (listLevel.displayFormatString !== undefined && listLevel.displayFormatString !== initLevel.displayFormatString) {
                ApiUtils.assertString(listLevel.displayFormatString, false, `listLevelSettings[${i}].displayFormatString`);
                this._native.history.addAndRedo(new ListLevelDisplayFormatStringHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.displayFormatString));
            }
            if (listLevel.firstLineIndent !== undefined && listLevel.firstLineIndent !== initLevel.firstLineIndent) {
                ApiUtils.assertNumber(listLevel.firstLineIndent, `listLevelSettings[${i}].firstLineIndent`);
                this._native.history.addAndRedo(new ListLevelParagraphFirstLineIndentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.firstLineIndent, true));
            }
            if (listLevel.firstLineIndentType !== undefined && listLevel.firstLineIndentType !== initLevel.firstLineIndentType) {
                ApiUtils.assertEnum(listLevel.firstLineIndentType, ParagraphFirstLineIndentApi, "ParagraphFirstLineIndent", `listLevelSettings[${i}].firstLineIndentType`);
                this._native.history.addAndRedo(new ListLevelParagraphFirstLineIndentTypeHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.firstLineIndentType, true));
            }
            if (listLevel.fontBold !== undefined && listLevel.fontBold !== initLevel.fontBold) {
                ApiUtils.assertBoolean(listLevel.fontBold, `listLevelSettings[${i}].fontBold`);
                this._native.history.addAndRedo(new ListLevelFontBoldHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.fontBold, true));
            }
            if (listLevel.fontColor !== undefined && listLevel.fontColor !== initLevel.fontColor) {
                const coreColor = ApiParametersChecker.check(listLevel.fontColor, 2, false, ModelParametersChecker.colorDescriptors(`listLevelSettings[${i}].fontColor`));
                this._native.history.addAndRedo(new ListLevelFontTextColorHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, ColorModelInfo.makeByColor(coreColor), true));
            }
            if (listLevel.fontItalic !== undefined && listLevel.fontItalic !== initLevel.fontItalic) {
                ApiUtils.assertBoolean(listLevel.fontItalic, `listLevelSettings[${i}].fontItalic`);
                this._native.history.addAndRedo(new ListLevelFontItalicHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.fontItalic, true));
            }
            if (listLevel.fontName !== undefined && listLevel.fontName !== initLevel.fontName) {
                ApiUtils.assertString(listLevel.fontName, true, `listLevelSettings[${i}].fontName`);
                this._native.history.addAndRedo(new ListLevelFontNameHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, this._native.model.cache.fontInfoCache.getItemByName(listLevel.fontName), true));
            }
            if (listLevel.fontSize !== undefined && listLevel.fontSize !== initLevel.fontSize) {
                ApiUtils.assertPositiveNumber(listLevel.fontSize, `listLevelSettings[${i}].fontSize`);
                this._native.history.addAndRedo(new ListLevelFontSizeHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.fontSize, true));
            }
            if (listLevel.format !== undefined && listLevel.format !== initLevel.format) {
                ApiUtils.assertEnum(listLevel.format, ListLevelFormatApi, "ListLevelFormat", `listLevelSettings[${i}].format`);
                this._native.history.addAndRedo(new ListLevelFormatHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.format));
            }
            if (listLevel.leftIndent !== undefined && listLevel.leftIndent !== initLevel.leftIndent) {
                ApiUtils.assertNonNegativeNumber(listLevel.leftIndent, `listLevelSettings[${i}].leftIndent`);
                this._native.history.addAndRedo(new ListLevelParagraphLeftIndentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.leftIndent, true));
            }
            if (listLevel.separator !== undefined && listLevel.separator !== initLevel.separator) {
                ApiUtils.assertString(listLevel.separator, false, `listLevelSettings[${i}].separator`);
                this._native.history.addAndRedo(new ListLevelSeparatorHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.separator));
            }
            if (listLevel.start !== undefined && listLevel.start !== initLevel.start) {
                ApiUtils.assertNumber(listLevel.start, `listLevelSettings[${i}].start`);
                this._native.history.addAndRedo(new ListLevelStartHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, listLevel.start));
            }
        }
        this._native.history.endTransaction();
    }
}
