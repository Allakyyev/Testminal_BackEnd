import { Errors } from '@devexpress/utils/lib/errors';
import { HistoryItem } from '../base/history-item';
export class ListLevelParagraphPropertiesHistoryItemBase extends HistoryItem {
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
export class ListLevelParagraphAlignmentHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.align;
    }
}
export class ListLevelParagraphContextualSpacingHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.contextualSpacing;
    }
}
export class ListLevelParagraphAfterAutoSpacingHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.afterAutoSpacing;
    }
}
export class ListLevelParagraphShadingInfoHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.shadingInfo;
    }
}
export class ListLevelParagraphBeforeAutoSpacingHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.beforeAutoSpacing;
    }
}
export class ListLevelParagraphFirstLineIndentHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.firstLineIndent;
    }
}
export class ListLevelParagraphFirstLineIndentTypeHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.firstLineIndentType;
    }
}
export class ListLevelParagraphKeepLinesTogetherHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.keepLinesTogether;
    }
}
export class ListLevelParagraphLeftIndentHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.leftIndent;
    }
}
export class ListLevelParagraphLineSpacingHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.lineSpacing;
    }
}
export class ListLevelParagraphLineSpacingTypeHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.lineSpacingType;
    }
}
export class ListLevelParagraphOutlineLevelHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.outlineLevel;
    }
}
export class ListLevelParagraphPageBreakBeforeHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.pageBreakBefore;
    }
}
export class ListLevelParagraphRightIndentHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.rightIndent;
    }
}
export class ListLevelParagraphSpacingAfterHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.spacingAfter;
    }
}
export class ListLevelParagraphSpacingBeforeHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.spacingBefore;
    }
}
export class ListLevelParagraphSuppressHyphenationHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.suppressHyphenation;
    }
}
export class ListLevelParagraphSuppressLineNumbersHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.suppressLineNumbers;
    }
}
export class ListLevelParagraphWidowOrphanControlHistoryItem extends ListLevelParagraphPropertiesHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.numberingList.listLevelParagraphProperties.widowOrphanControl;
    }
}
