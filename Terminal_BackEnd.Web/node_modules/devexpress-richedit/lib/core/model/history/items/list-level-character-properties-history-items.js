import { Errors } from '@devexpress/utils/lib/errors';
import { HistoryItem } from '../base/history-item';
export class ListLevelCharacterPropertiesHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, isAbstractList, listIndex, levelIndex, newValue, newUse) {
        super(modelManipulator);
        this.newValue = newValue;
        this.isAbstractList = isAbstractList;
        this.listIndex = listIndex;
        this.levelIndex = levelIndex;
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.modelManipulator.model, this.isAbstractList, this.listIndex, this.levelIndex, this.newValue, this.newUse);
    }
    undo() {
        this.getManipulator().restoreValue(this.modelManipulator.model, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class ListLevelFontBoldHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontBold;
    }
}
export class ListLevelFontCapsHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontCaps;
    }
}
export class ListLevelFontSmallCapsHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontSmallCaps;
    }
}
export class ListLevelFontUnderlineTypeHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontUnderlineType;
    }
}
export class ListLevelFontTextColorHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.textColor;
    }
}
export class ListLevelFontShadingInfoHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.shadingInfo;
    }
}
export class ListLevelFontHiddenHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontHidden;
    }
}
export class ListLevelFontItalicHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontItalic;
    }
}
export class ListLevelFontNameHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontName;
    }
}
export class ListLevelFontScriptHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.script;
    }
}
export class ListLevelFontSizeHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontSize;
    }
}
export class ListLevelFontStrikeoutTypeHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontStrikeoutType;
    }
}
export class ListLevelFontStrikeoutWordsOnlyHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontStrikeoutWordsOnly;
    }
}
export class ListLevelFontStrikeoutColorHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontStrikeoutColor;
    }
}
export class ListLevelFontUnderlineColorHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontUnderlineColor;
    }
}
export class ListLevelFontUnderlineWordsOnlyHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontUnderlineWordsOnly;
    }
}
export class ListLevelFontNoProofHistoryItem extends ListLevelCharacterPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelCharacterProperties.fontNoProof;
    }
}
