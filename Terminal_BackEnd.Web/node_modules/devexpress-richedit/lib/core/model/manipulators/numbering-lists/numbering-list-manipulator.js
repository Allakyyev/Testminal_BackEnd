import { AbstractNumberingListAddedModelChange } from '../../changes/model/list/abstract-numbering-list-added';
import { AbstractNumberingListDeletedModelChange } from '../../changes/model/list/abstract-numbering-list-deleted';
import { IOverrideListLevelChangedModelChange } from '../../changes/model/list/i-override-list-level-changed';
import { NumberingListAddedModelChange } from '../../changes/model/list/numbering-list-added';
import { NumberingListDeletedModelChange } from '../../changes/model/list/numbering-list-deleted';
import { ParagraphNumberingListChangedSubDocumentChange } from '../../changes/sub-document/list/paragraph-numbering-list-changed';
import { HistoryItemIntervalState, HistoryItemState } from '../../history/states/history-item-state';
import { HistoryItemIntervalStateObject, HistoryItemListLevelStateObject } from '../../history/states/history-item-state-object';
import { JSONIOverrideListLevelProperty } from '../../json/enums/json-list-enums';
import { NumberingList } from '../../numbering-lists/numbering-list';
import { BaseManipulator } from '../base-manipulator';
import { ListLevelCharacterPropertiesManipulator } from './list-level-character-properties-manipulator';
import { ListLevelParagraphPropertiesManipulator } from './list-level-paragraph-properties-manipulator';
import { ListLevelPropertiesManipulator } from './list-level-properties-manipulator';
export class NumberingListManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.listLevelProperties = new ListLevelPropertiesManipulator(manipulator);
        this.listLevelCharacterProperties = new ListLevelCharacterPropertiesManipulator(manipulator);
        this.listLevelParagraphProperties = new ListLevelParagraphPropertiesManipulator(manipulator);
    }
    addAbstractNumberingList(abstractNumberingList) {
        var newIndex = this.model.abstractNumberingLists.push(abstractNumberingList) - 1;
        abstractNumberingList.deleted = false;
        this.modelManipulator.notifyModelChanged(new AbstractNumberingListAddedModelChange(newIndex));
        return newIndex;
    }
    deleteAbstractNumberingList(abstractNumberingListIndex) {
        this.model.abstractNumberingLists[abstractNumberingListIndex].deleted = true;
        this.model.abstractNumberingLists.splice(abstractNumberingListIndex, 1);
        this.modelManipulator.notifyModelChanged(new AbstractNumberingListDeletedModelChange(abstractNumberingListIndex));
    }
    addNumberingList(numberingList) {
        const newIndex = this.model.numberingLists.push(numberingList) - 1;
        numberingList.deleted = false;
        this.modelManipulator.notifyModelChanged(new NumberingListAddedModelChange(newIndex));
        return newIndex;
    }
    deleteNumberingList(numberingListIndex) {
        this.model.numberingLists.splice(numberingListIndex, 1);
        this.modelManipulator.notifyModelChanged(new NumberingListDeletedModelChange(numberingListIndex));
    }
    setIOverrideListLevelOverrideStart(numberingListIndex, levelIndex, overrideStart) {
        var numberingList = this.model.numberingLists[numberingListIndex];
        var listLevel = numberingList.levels[levelIndex];
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        oldState.register(new HistoryItemListLevelStateObject(false, numberingListIndex, levelIndex, listLevel.overrideStart));
        listLevel.overrideStart = overrideStart;
        newState.register(new HistoryItemListLevelStateObject(false, numberingListIndex, levelIndex, overrideStart));
        this.modelManipulator.notifyModelChanged(new IOverrideListLevelChangedModelChange(JSONIOverrideListLevelProperty.OverrideStart, newState));
        return oldState;
    }
    restoreIOverrideListLevelOverrideStart(state) {
        var stateObject = state.objects[0];
        var numberingList = this.model.numberingLists[stateObject.numberingListIndex];
        var listLevel = numberingList.levels[stateObject.listLevelIndex];
        listLevel.overrideStart = stateObject.value;
        this.modelManipulator.notifyModelChanged(new IOverrideListLevelChangedModelChange(JSONIOverrideListLevelProperty.OverrideStart, stateObject.value));
    }
    setIOverrideListLevelNewStart(numberingListIndex, levelIndex, newStart) {
        var numberingList = this.model.numberingLists[numberingListIndex];
        var listLevel = numberingList.levels[levelIndex];
        var newState = new HistoryItemState();
        var oldState = new HistoryItemState();
        oldState.register(new HistoryItemListLevelStateObject(false, numberingListIndex, levelIndex, listLevel.getNewStart()));
        listLevel.setNewStart(newStart);
        newState.register(new HistoryItemListLevelStateObject(false, numberingListIndex, levelIndex, newStart));
        this.modelManipulator.notifyModelChanged(new IOverrideListLevelChangedModelChange(JSONIOverrideListLevelProperty.NewStart, newState));
        return oldState;
    }
    restoreIOverrideListLevelNewStart(state) {
        var stateObject = state.objects[0];
        var numberingList = this.model.numberingLists[stateObject.numberingListIndex];
        var listLevel = numberingList.levels[stateObject.listLevelIndex];
        listLevel.setNewStart(stateObject.value);
        this.modelManipulator.notifyModelChanged(new IOverrideListLevelChangedModelChange(JSONIOverrideListLevelProperty.NewStart, stateObject.value));
    }
    setParagraphNumberingList(subDocument, paragraphIndex, numberingIndex, listLevelIndex) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var paragraph = subDocument.paragraphs[paragraphIndex];
        var oldAbstractNumberingListIndex = paragraph.getAbstractNumberingListIndex();
        oldState.register(new HistoryItemIntervalStateObject(paragraph.interval, [paragraph.numberingListIndex, paragraph.listLevelIndex]));
        newState.register(new HistoryItemIntervalStateObject(paragraph.interval, [numberingIndex, listLevelIndex]));
        paragraph.numberingListIndex = numberingIndex;
        paragraph.listLevelIndex = listLevelIndex;
        paragraph.resetParagraphMergedProperties();
        this.modelManipulator.notifyModelChanged(new ParagraphNumberingListChangedSubDocumentChange(subDocument, newState, oldAbstractNumberingListIndex));
        return oldState;
    }
    removeNumberingListFromParagraph(subDocument, paragraphIndex) {
        var oldState = new HistoryItemIntervalState();
        var newState = new HistoryItemIntervalState();
        var paragraph = subDocument.paragraphs[paragraphIndex];
        var oldAbstractNumberingListIndex = paragraph.getAbstractNumberingListIndex();
        var newListIndex = NumberingList.NumberingListNotSettedIndex;
        if (paragraph.isInStyleList())
            newListIndex = NumberingList.NoNumberingListIndex;
        oldState.register(new HistoryItemIntervalStateObject(paragraph.interval, [paragraph.numberingListIndex, paragraph.listLevelIndex]));
        paragraph.numberingListIndex = newListIndex;
        paragraph.listLevelIndex = -1;
        paragraph.resetParagraphMergedProperties();
        newState.register(new HistoryItemIntervalStateObject(paragraph.interval, [newListIndex, -1]));
        this.modelManipulator.notifyModelChanged(new ParagraphNumberingListChangedSubDocumentChange(subDocument, newState, oldAbstractNumberingListIndex));
        return oldState;
    }
    restoreParagraphNumberingList(subDocument, state) {
        var paragraph = subDocument.getParagraphsByInterval(state.interval)[0];
        var oldAbstractNumberingListIndex = paragraph.getAbstractNumberingListIndex();
        paragraph.numberingListIndex = state.objects[0].value[0];
        paragraph.listLevelIndex = state.objects[0].value[1];
        paragraph.resetParagraphMergedProperties();
        this.modelManipulator.notifyModelChanged(new ParagraphNumberingListChangedSubDocumentChange(subDocument, state, oldAbstractNumberingListIndex));
    }
}
