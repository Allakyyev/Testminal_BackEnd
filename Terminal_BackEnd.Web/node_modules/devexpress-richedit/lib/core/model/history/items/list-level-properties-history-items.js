import { Errors } from '@devexpress/utils/lib/errors';
import { HistoryItem } from '../base/history-item';
export class ListLevelPropertiesHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, isAbstractList, listIndex, levelIndex, newValue) {
        super(modelManipulator);
        this.newValue = newValue;
        this.isAbstractList = isAbstractList;
        this.listIndex = listIndex;
        this.levelIndex = levelIndex;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.modelManipulator.model, this.isAbstractList, this.listIndex, this.levelIndex, this.newValue);
    }
    undo() {
        this.getManipulator().restoreValue(this.modelManipulator.model, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class ListLevelStartHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.start;
    }
}
export class ListLevelAlignmentHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.alignment;
    }
}
export class ListLevelConvertPreviousLevelNumberingToDecimalHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.convertPreviousLevelNumberingToDecimal;
    }
}
export class ListLevelDisplayFormatStringHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.displayFormatString;
    }
}
export class ListLevelFormatHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.format;
    }
}
export class ListLevelLegacyHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.legacy;
    }
}
export class ListLevelLegacyIndentHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.legacyIndent;
    }
}
export class ListLevelLegacySpaceHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.legacySpace;
    }
}
export class ListLevelOriginalLeftIndentHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.originalLeftIndent;
    }
}
export class ListLevelRelativeRestartLevelHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.relativeRestartLevel;
    }
}
export class ListLevelSeparatorHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.separator;
    }
}
export class ListLevelSuppressBulletResizeHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.suppressBulletResize;
    }
}
export class ListLevelSuppressRestartHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.suppressRestart;
    }
}
export class ListLevelTemplateCodeHistoryItem extends ListLevelPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelProperties.templateCode;
    }
}
