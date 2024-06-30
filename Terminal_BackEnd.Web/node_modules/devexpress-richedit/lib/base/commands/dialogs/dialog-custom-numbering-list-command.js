import { BoxWrap } from '../../../core/layout-formatter/box/box-wrap';
import { LayoutBox } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { LayoutNumberingListBox } from '../../../core/layout/main-structures/layout-boxes/layout-numbering-list-box';
import { LayoutTextBox } from '../../../core/layout/main-structures/layout-boxes/layout-text-box';
import { LayoutRow } from '../../../core/layout/main-structures/layout-row';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ListLevelFontBoldHistoryItem, ListLevelFontItalicHistoryItem, ListLevelFontNameHistoryItem, ListLevelFontSizeHistoryItem, ListLevelFontTextColorHistoryItem } from '../../../core/model/history/items/list-level-character-properties-history-items';
import { ListLevelParagraphFirstLineIndentHistoryItem, ListLevelParagraphFirstLineIndentTypeHistoryItem, ListLevelParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/list-level-paragraph-properties-history-items';
import { ListLevelAlignmentHistoryItem, ListLevelDisplayFormatStringHistoryItem, ListLevelFormatHistoryItem, ListLevelSeparatorHistoryItem, ListLevelStartHistoryItem } from '../../../core/model/history/items/list-level-properties-history-items';
import { AddAbstractNumberingListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { NumberConverterCreator } from '../../../core/model/number-converters/number-converter-creator';
import { AbstractNumberingList, NumberingListBase, NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogCustomNumberingListCommand extends ShowDialogCommandBase {
    createParameters(options) {
        this.listType = options.param.listType;
        return options.param;
    }
    applyToCustomListLevels(sourcelevels, targetlevels, abstractNumberingListIndex) {
        const modelManipulator = this.modelManipulator;
        const history = this.history;
        for (let i = 0, length = targetlevels.length; i < length; i++) {
            const level = targetlevels[i];
            const initLevel = sourcelevels[i];
            if (level.displayFormatString != initLevel.displayFormatString)
                history.addAndRedo(new ListLevelDisplayFormatStringHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.displayFormatString));
            if (level.format != initLevel.format)
                history.addAndRedo(new ListLevelFormatHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.format));
            if (level.start != initLevel.start)
                history.addAndRedo(new ListLevelStartHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.start));
            if (level.alignment != initLevel.alignment)
                history.addAndRedo(new ListLevelAlignmentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.alignment));
            if (level.separator != initLevel.separator)
                history.addAndRedo(new ListLevelSeparatorHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.separator));
            if (level.leftIndent != initLevel.leftIndent)
                history.addAndRedo(new ListLevelParagraphLeftIndentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.leftIndent, true));
            if (level.firstLineIndent != initLevel.firstLineIndent)
                history.addAndRedo(new ListLevelParagraphFirstLineIndentHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.firstLineIndent, true));
            if (level.firstLineIndentType != initLevel.firstLineIndentType)
                history.addAndRedo(new ListLevelParagraphFirstLineIndentTypeHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.firstLineIndentType, true));
            const fontName = this.control.modelManager.model.cache.fontInfoCache.getItemByName(level.fontName);
            const initFontName = this.control.modelManager.model.cache.fontInfoCache.getItemByName(initLevel.fontName);
            if (fontName != initFontName)
                history.addAndRedo(new ListLevelFontNameHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, fontName, true));
            if (ColorUtils.fromHashString(level.fontColor) != ColorUtils.fromHashString(initLevel.fontColor))
                history.addAndRedo(new ListLevelFontTextColorHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, ColorModelInfo.makeByColor(ColorUtils.fromHashString(level.fontColor)), true));
            if (level.fontSize != initLevel.fontSize)
                history.addAndRedo(new ListLevelFontSizeHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, level.fontSize, true));
            const bold = !!(level.fontStyle & 1);
            const initBold = !!(initLevel.fontStyle & 1);
            if (bold != initBold)
                history.addAndRedo(new ListLevelFontBoldHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, bold, true));
            const italic = !!(level.fontStyle & 2);
            const initItalic = !!(initLevel.fontStyle & 2);
            if (italic != initItalic)
                history.addAndRedo(new ListLevelFontItalicHistoryItem(modelManipulator, true, abstractNumberingListIndex, i, italic, true));
        }
    }
    applyToListLevels(sourcelevels, targetlevels, abstractNumberingListIndex) {
        const numberingListManipulator = this.modelManipulator.numberingList;
        const activeSubDocument = this.selection.activeSubDocument;
        const model = activeSubDocument.documentModel;
        for (let i = 0, length = targetlevels.length; i < length; i++) {
            const targetLevel = targetlevels[i];
            const sourceLevel = sourcelevels[i];
            const levelPropertiesManipulator = numberingListManipulator.listLevelProperties;
            levelPropertiesManipulator.displayFormatString.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.displayFormatString);
            levelPropertiesManipulator.format.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.format);
            levelPropertiesManipulator.start.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.start);
            levelPropertiesManipulator.alignment.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.alignment);
            levelPropertiesManipulator.separator.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.separator);
            const paragraphManipulator = numberingListManipulator.listLevelParagraphProperties;
            paragraphManipulator.leftIndent.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.leftIndent, true);
            paragraphManipulator.firstLineIndent.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.firstLineIndent, true);
            paragraphManipulator.firstLineIndentType.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.firstLineIndentType, true);
            const listLevelCharacterProperties = numberingListManipulator.listLevelCharacterProperties;
            const fontInfo = targetLevel.getCharacterProperties().fontInfo.clone();
            fontInfo.name = sourceLevel.fontName;
            listLevelCharacterProperties.fontName.setValue(model, true, abstractNumberingListIndex, i, fontInfo, true);
            listLevelCharacterProperties.fontSize.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.fontSize, true);
            listLevelCharacterProperties.fontBold.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.fontStyle == 1, true);
            listLevelCharacterProperties.fontItalic.setValue(model, true, abstractNumberingListIndex, i, sourceLevel.fontStyle == 2, true);
        }
    }
    applyCustomNumberingListParameters(initParams, newParams) {
        const activeSubDocument = this.selection.activeSubDocument;
        const firstParagraph = activeSubDocument.getParagraphByPosition(this.selection.intervals[0].start);
        const isMultilevel = this.listType == NumberingType.MultiLevel;
        if (initParams.equals(newParams) || isMultilevel) {
            this.control.commandManager.getCommand(RichEditClientCommand.InsertNumerationToParagraphs)
                .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, newParams.initAbstractNumberingList));
            if (isMultilevel) {
                const abstractNumberingListIndex = firstParagraph.getAbstractNumberingListIndex();
                this.applyToListLevels(newParams.levels, newParams.initAbstractNumberingList.levels, abstractNumberingListIndex);
            }
            return;
        }
        let abstractNumberingList = null;
        let abstractNumberingListIndex = -1;
        if (this.selection.isCollapsed() && firstParagraph.isInList()) {
            abstractNumberingList = newParams.initAbstractNumberingList;
            abstractNumberingListIndex = firstParagraph.getNumberingList().abstractNumberingListIndex;
            newParams.applyToParagraph = false;
        }
        else {
            abstractNumberingList = new AbstractNumberingList(this.control.modelManager.model);
            abstractNumberingList.copyFrom(newParams.initAbstractNumberingList);
            this.history.addAndRedo(new AddAbstractNumberingListHistoryItem(this.modelManipulator, abstractNumberingList));
            abstractNumberingListIndex = this.control.modelManager.model.abstractNumberingLists.length - 1;
        }
        this.applyToCustomListLevels(initParams.levels, newParams.levels, abstractNumberingListIndex);
        if (newParams.applyToParagraph)
            this.control.commandManager.getCommand(RichEditClientCommand.InsertNumerationToParagraphs)
                .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, abstractNumberingList));
    }
    applyParameters(_state, newParams) {
        const history = this.history;
        const initParams = new DialogCustomNumberingListParameters();
        initParams.init(this.colorProvider, newParams.initAbstractNumberingList);
        history.beginTransaction();
        this.applyCustomNumberingListParameters(initParams, newParams);
        history.endTransaction();
        return true;
    }
    getDialogName() {
        switch (this.listType) {
            case NumberingType.Bullet:
                return "BulletedList";
            case NumberingType.Simple:
                return "SimpleNumberingList";
            case NumberingType.MultiLevel:
                return "MultiLevelNumberingList";
        }
        return null;
    }
}
export class DialogCustomNumberingListParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.currentLevel = 0;
        this.levels = [];
        this.coreInitialFontColors = [];
        this.applyToParagraph = true;
    }
    init(colorProvider, abstractNumberingList, currentLevel) {
        if (currentLevel != null)
            this.currentLevel = currentLevel;
        if (abstractNumberingList != null) {
            this.listType = abstractNumberingList.getListType();
            this.initAbstractNumberingList = abstractNumberingList;
            for (var i = 0; i < abstractNumberingList.levels.length; i++) {
                var level = this.initLevel(colorProvider, abstractNumberingList.levels[i]);
                this.levels.push(level);
            }
        }
    }
    initLevel(colorProvider, listLevel) {
        const level = new CustomListlevel();
        const listLevelProperties = listLevel.getListLevelProperties();
        level.displayFormatString = listLevelProperties.displayFormatString;
        level.format = listLevelProperties.format;
        level.start = listLevelProperties.start;
        level.alignment = listLevelProperties.alignment;
        level.separator = listLevelProperties.separator;
        const paragraphProperties = listLevel.getParagraphProperties();
        level.leftIndent = paragraphProperties.leftIndent;
        level.firstLineIndent = paragraphProperties.firstLineIndent;
        level.firstLineIndentType = paragraphProperties.firstLineIndentType;
        const characterProperties = listLevel.getCharacterProperties();
        level.fontName = characterProperties.fontInfo.name;
        const foreColor = characterProperties.textColor.toRgb(colorProvider);
        level.fontColor = ColorUtils.colorToHash(foreColor);
        this.coreInitialFontColors.push(foreColor);
        level.fontSize = characterProperties.fontSize;
        level.fontStyle = (characterProperties.fontBold ? 1 : 0) | (characterProperties.fontItalic ? 2 : 0);
        return level;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.currentLevel = obj.currentLevel;
        this.listType = obj.listType;
        this.applyToParagraph = obj.applyToParagraph;
        this.copyLevelsFrom(obj.levels);
    }
    clone() {
        const newInstance = new DialogCustomNumberingListParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
    copyLevelsFrom(levels) {
        this.levels = [];
        for (var i = 0, length = levels.length; i < length; i++) {
            var level = new CustomListlevel();
            level.copyFrom(levels[i]);
            this.levels.push(level);
        }
    }
    equals(obj) {
        for (var i = 0, level; level = obj.levels[i]; i++) {
            if (!level.equals(this.levels[i]))
                return false;
        }
        return true;
    }
}
export class CustomListlevel {
    copyFrom(obj) {
        this.displayFormatString = obj.displayFormatString;
        this.format = obj.format;
        this.start = obj.start;
        this.alignment = obj.alignment;
        this.separator = obj.separator;
        this.leftIndent = obj.leftIndent;
        this.firstLineIndent = obj.firstLineIndent;
        this.firstLineIndentType = obj.firstLineIndentType;
        this.fontName = obj.fontName;
        this.fontColor = obj.fontColor;
        this.fontSize = obj.fontSize;
        this.fontStyle = obj.fontStyle;
    }
    equals(obj) {
        return this.displayFormatString == obj.displayFormatString &&
            this.format == obj.format &&
            this.start == obj.start &&
            this.alignment == obj.alignment &&
            this.separator == obj.separator &&
            this.leftIndent == obj.leftIndent &&
            this.firstLineIndent == obj.firstLineIndent &&
            this.firstLineIndentType == obj.firstLineIndentType &&
            this.fontName == obj.fontName &&
            this.fontColor == obj.fontColor &&
            this.fontSize == obj.fontSize &&
            this.fontStyle == obj.fontStyle;
    }
}
export class NumberingListFormPreviewHelper {
    constructor(richEdit, abstractNumberingList, currentLevel) {
        this.richEdit = richEdit;
        this.abstractNumberingList = abstractNumberingList;
        this.currentLevel = currentLevel;
    }
    createPreview() {
        var preview = document.createElement("div");
        for (var i = 0; i < 4; i++)
            preview.appendChild(this.createRowElement(i));
        return preview;
    }
    createRowElement(index) {
        var separatorWidth = 7;
        var rowHeight = 25;
        var margin = 10;
        var foreColor = 0xbbbbbbbb;
        var fakeString = "▬▬▬▬▬▬▬▬▬";
        var isMultiLevel = this.abstractNumberingList.getListType() == NumberingType.MultiLevel;
        var currentLevelIndex = isMultiLevel ? index % NumberingListBase.depth : this.currentLevel;
        var currentMajorIndex = isMultiLevel ? Math.floor(index / NumberingListBase.depth) : index;
        var paragraphProperties = this.abstractNumberingList.levels[currentLevelIndex].getParagraphProperties();
        var characterProperties = this.abstractNumberingList.levels[currentLevelIndex].getCharacterProperties();
        var listBoxText = this.getNumberingListBoxText(currentLevelIndex, currentMajorIndex);
        var layoutNumberingListBox = new LayoutNumberingListBox(characterProperties, characterProperties.getLayoutColorInfo(this.richEdit.modelManager.model.colorProvider), listBoxText, "");
        LayoutBox.initializeWithMeasurer([new BoxWrap(layoutNumberingListBox.textBox, null)], this.richEdit.measurer, false);
        var textBoxCharacterProperties = this.richEdit.modelManager.model.defaultCharacterProperties.clone();
        textBoxCharacterProperties.textColor = ColorModelInfo.makeByColor(foreColor);
        var layoutTextBox = new LayoutTextBox(textBoxCharacterProperties, textBoxCharacterProperties.getLayoutColorInfo(this.richEdit.modelManager.model.colorProvider), fakeString);
        LayoutBox.initializeWithMeasurer([new BoxWrap(layoutTextBox, null)], this.richEdit.measurer, false);
        layoutTextBox.x = layoutNumberingListBox.textBox.width + separatorWidth;
        var layoutRow = new LayoutRow();
        layoutRow.numberingListBox = layoutNumberingListBox;
        layoutRow.boxes.push(layoutTextBox);
        layoutRow.height = Math.max(layoutNumberingListBox.textBox.height, rowHeight);
        layoutRow.width = layoutNumberingListBox.textBox.width + layoutTextBox.width;
        layoutRow.x = isMultiLevel ? UnitConverter.twipsToPixels(paragraphProperties.leftIndent - paragraphProperties.firstLineIndent) + margin : margin;
        layoutRow.y = index * layoutRow.height + margin;
        return this.richEdit.viewManager.renderer.renderRow(layoutRow, 0);
    }
    getNumberingListBoxText(levelIndex, majorIndex) {
        const items = [];
        for (let j = 0; j <= levelIndex; j++) {
            const listLevelProperties = this.abstractNumberingList.levels[j].getListLevelProperties();
            const converter = NumberConverterCreator.createConverter(listLevelProperties.format, this.richEdit.modelManager.model.simpleFormattersManager);
            items.push(converter.convertNumber(listLevelProperties.start + majorIndex));
        }
        const displayFormatString = this.abstractNumberingList.levels[levelIndex].getListLevelProperties().displayFormatString;
        return this.richEdit.modelManager.model.simpleFormattersManager.formatString(displayFormatString, ...items);
    }
}
