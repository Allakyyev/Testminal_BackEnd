import { Errors } from '@devexpress/utils/lib/errors';
import { HistoryItem } from '../base/history-item';
import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class ParagraphUseValueHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
    }
    redo() {
        this.oldState = this.modelManipulator.paragraphProperties.useValue.setValue(this.boundSubDocument, this.interval, this.newValue);
    }
    undo() {
        this.modelManipulator.paragraphProperties.useValue.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TabHistoryItemBase extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, tabInfo) {
        super(modelManipulator, subDocInterval);
        this.tabInfo = tabInfo;
    }
}
export class InsertTabToParagraphHistoryItem extends TabHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.tab.insertTabToParagraph(this.boundSubDocument, this.interval, this.tabInfo);
    }
    undo() {
        this.modelManipulator.tab.restoreInsertedTabToParagraph(this.boundSubDocument, this.oldState);
    }
}
export class DeleteTabAtParagraphHistoryItem extends TabHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.tab.deleteTabAtParagraph(this.boundSubDocument, this.interval, this.tabInfo);
    }
    undo() {
        this.modelManipulator.tab.restoreDeletedTabAtParagraph(this.boundSubDocument, this.oldState);
    }
}
export class ParagraphPropertiesHistoryItemBase extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue, newUse) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getPropertiesManipulator().setValue(this.boundSubDocument, this.interval, this.newValue, this.newUse);
    }
    undo() {
        this.getPropertiesManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getPropertiesManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class ParagraphAlignmentHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.align;
    }
}
export class ParagraphContextualSpacingHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.contextualSpacing;
    }
}
export class ParagraphRightToLeftHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.rightToLeft;
    }
}
export class ParagraphAfterAutoSpacingHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.afterAutoSpacing;
    }
}
export class ParagraphShadingInfoIndexHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.shadingInfo;
    }
}
export class ParagraphBeforeAutoSpacingHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.beforeAutoSpacing;
    }
}
export class ParagraphFirstLineIndentHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.firstLineIndent;
    }
}
export class ParagraphFirstLineIndentTypeHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.firstLineIndentType;
    }
}
export class ParagraphKeepLinesTogetherHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.keepLinesTogether;
    }
}
export class ParagraphLeftIndentHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.leftIndent;
    }
}
export class ParagraphLineSpacingHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.lineSpacing;
    }
}
export class ParagraphLineSpacingTypeHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.lineSpacingType;
    }
}
export class ParagraphOutlineLevelHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.outlineLevel;
    }
}
export class ParagraphPageBreakBeforeHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.pageBreakBefore;
    }
}
export class ParagraphRightIndentHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.rightIndent;
    }
}
export class ParagraphSpacingAfterHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.spacingAfter;
    }
}
export class ParagraphSpacingBeforeHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.spacingBefore;
    }
}
export class ParagraphSuppressHyphenationHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.suppressHyphenation;
    }
}
export class ParagraphSuppressLineNumbersHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.suppressLineNumbers;
    }
}
export class ParagraphWidowOrphanControlHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.widowOrphanControl;
    }
}
export class ParagraphDivIdHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.divId;
    }
}
export class ParagraphKeepWithNextHistoryItem extends ParagraphPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.paragraphProperties.keepWithNext;
    }
}
export class ParagraphPropertiesHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, paragraphIndex, paragraphProperties, style, numberingListIndex, listLevelIndex, tabs) {
        super(modelManipulator);
        this.subDocument = subDocument;
        this.paragraphIndex = paragraphIndex;
        this.style = style;
        this.numberingListIndex = numberingListIndex;
        this.listLevelIndex = listLevelIndex;
        this.paragraphProperties = paragraphProperties;
        this.tabs = tabs.clone();
    }
    redo() {
        let paragraph = this.subDocument.paragraphs[this.paragraphIndex];
        this.oldParagraphProperties = paragraph.maskedParagraphProperties;
        this.oldStyle = paragraph.paragraphStyle;
        this.oldNumberingListIndex = paragraph.numberingListIndex;
        this.oldListLevelIndex = paragraph.listLevelIndex;
        this.oldTabs = paragraph.tabs.clone();
        this.modelManipulator.paragraphProperties.changeAllProperties(this.subDocument, this.paragraphIndex, this.paragraphProperties, this.style, this.tabs, this.numberingListIndex, this.listLevelIndex);
    }
    undo() {
        this.modelManipulator.paragraphProperties.changeAllProperties(this.subDocument, this.paragraphIndex, this.oldParagraphProperties, this.oldStyle, this.oldTabs, this.oldNumberingListIndex, this.oldListLevelIndex);
    }
}
