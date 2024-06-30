import { Flag } from '@devexpress/utils/lib/class/flag';
import { ParagraphPropertiesMask } from '../../paragraph/paragraph-properties';
import { SubDocumentInterval } from '../../sub-document';
import { HistoryItem } from '../base/history-item';
import { ParagraphUseValueHistoryItem } from './paragraph-properties-history-items';
export class AddAbstractNumberingListHistoryItem extends HistoryItem {
    constructor(modelManipulator, abstractNumberingList) {
        super(modelManipulator);
        this.abstractNumberingList = abstractNumberingList;
    }
    redo() {
        this.abstractNumberingListIndex = this.modelManipulator.numberingList.addAbstractNumberingList(this.abstractNumberingList);
    }
    undo() {
        this.modelManipulator.numberingList.deleteAbstractNumberingList(this.abstractNumberingListIndex);
    }
}
export class AddNumberingListHistoryItem extends HistoryItem {
    constructor(modelManipulator, numberingList) {
        super(modelManipulator);
        this.numberingList = numberingList;
    }
    redo() {
        this.numberingListIndex = this.modelManipulator.numberingList.addNumberingList(this.numberingList);
    }
    undo() {
        this.modelManipulator.numberingList.deleteNumberingList(this.numberingListIndex);
    }
}
export class AddParagraphToListHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, paragraphIndex, numberingListIndex, listLevelIndex) {
        super(modelManipulator);
        this.subDocument = subDocument;
        this.paragraphIndex = paragraphIndex;
        this.numberingListIndex = numberingListIndex;
        this.listLevelIndex = listLevelIndex;
    }
    redo() {
        const paragraph = this.subDocument.paragraphs[this.paragraphIndex];
        this.useValHistItem = new ParagraphUseValueHistoryItem(this.modelManipulator, new SubDocumentInterval(this.subDocument, this.subDocument.paragraphs[this.paragraphIndex].interval), new Flag(paragraph.maskedParagraphProperties.useValue)
            .set(ParagraphPropertiesMask.UseLeftIndent, false)
            .set(ParagraphPropertiesMask.UseFirstLineIndent, false).getValue());
        this.useValHistItem.redo();
        this.state = this.modelManipulator.numberingList.setParagraphNumberingList(this.subDocument, this.paragraphIndex, this.numberingListIndex, this.listLevelIndex);
    }
    undo() {
        this.useValHistItem.undo();
        this.modelManipulator.numberingList.restoreParagraphNumberingList(this.subDocument, this.state);
    }
}
export class RemoveParagraphFromListHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, paragraphIndex) {
        super(modelManipulator);
        this.subDocument = subDocument;
        this.paragraphIndex = paragraphIndex;
    }
    redo() {
        this.state = this.modelManipulator.numberingList.removeNumberingListFromParagraph(this.subDocument, this.paragraphIndex);
    }
    undo() {
        this.modelManipulator.numberingList.restoreParagraphNumberingList(this.subDocument, this.state);
    }
}
export class ListLevelNewStartHistoryItem extends HistoryItem {
    constructor(modelManipulator, listIndex, levelIndex, newValue) {
        super(modelManipulator);
        this.newValue = newValue;
        this.listIndex = listIndex;
        this.levelIndex = levelIndex;
    }
    redo() {
        this.oldState = this.modelManipulator.numberingList.setIOverrideListLevelNewStart(this.listIndex, this.levelIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.numberingList.restoreIOverrideListLevelNewStart(this.oldState);
    }
}
export class ListLevelOverrideStartHistoryItem extends HistoryItem {
    constructor(modelManipulator, listIndex, levelIndex, overrideStart) {
        super(modelManipulator);
        this.newValue = overrideStart;
        this.listIndex = listIndex;
        this.levelIndex = levelIndex;
    }
    redo() {
        this.oldState = this.modelManipulator.numberingList.setIOverrideListLevelOverrideStart(this.listIndex, this.levelIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.numberingList.restoreIOverrideListLevelOverrideStart(this.oldState);
    }
}
