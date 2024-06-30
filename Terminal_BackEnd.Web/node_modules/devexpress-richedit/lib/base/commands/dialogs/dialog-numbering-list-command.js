import { AbstractNumberingList, NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { DialogCustomNumberingListCommand, DialogCustomNumberingListParameters } from './dialog-custom-numbering-list-command';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogNumberingListCommand extends ShowDialogCommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = (ControlOptions.isVisible(this.control.modelManager.richOptions.control.numberingBulleted) ||
            ControlOptions.isVisible(this.control.modelManager.richOptions.control.numberingMultiLevel) ||
            ControlOptions.isVisible(this.control.modelManager.richOptions.control.numberingSimple)) &&
            !this.selection.specialRunInfo.isPictureSelected();
        return state;
    }
    isEnabled() {
        return super.isEnabled() && (ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingBulleted) || ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingMultiLevel) || ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingSimple));
    }
    createParameters(options) {
        var dialogParameters = new DialogNumberingListParameters();
        if (options.param instanceof AbstractNumberingList)
            dialogParameters.selectedAbstractNumberingList = options.param;
        else if (!this.areThereParagraphsInDifferentLists())
            dialogParameters.selectedAbstractNumberingList = this.getSelectedAbstractNumberingList();
        const paragraphsIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        let levelIndex = -1;
        for (let i = 0; i < paragraphsIndices.length; i++) {
            const paragraph = this.selection.activeSubDocument.paragraphs[paragraphsIndices[i]];
            if (paragraph.isInList())
                levelIndex = levelIndex < 0 ? paragraph.getListLevelIndex() : Math.min(levelIndex, paragraph.getListLevelIndex());
            else {
                levelIndex = 0;
                break;
            }
        }
        dialogParameters.currentLevel = levelIndex;
        return dialogParameters;
    }
    areThereParagraphsInDifferentLists() {
        var prevNumbListIndex = -1;
        var paragraphsIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        var paragraphsIndicesLength = paragraphsIndices.length;
        for (let i = 0; i < paragraphsIndicesLength; i++) {
            var paragraphIndex = paragraphsIndices[i];
            var paragraph = this.selection.activeSubDocument.paragraphs[paragraphIndex];
            if (!paragraph.isInList())
                continue;
            if (prevNumbListIndex == -1) {
                prevNumbListIndex = paragraph.numberingListIndex;
                continue;
            }
            if (prevNumbListIndex != paragraph.numberingListIndex)
                return true;
        }
        return false;
    }
    getSelectedAbstractNumberingList() {
        var listIndex = this.getFirstNumberingListIndex();
        if (listIndex == -1)
            return null;
        var list = this.control.modelManager.model.numberingLists[listIndex];
        return list.getAbstractNumberingList();
    }
    getFirstNumberingListIndex() {
        var paragraphsIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        let paragraphsIndicesLength = paragraphsIndices.length;
        for (let i = 0; i < paragraphsIndicesLength; i++) {
            let paragraphIndex = paragraphsIndices[i];
            var paragraph = this.selection.activeSubDocument.paragraphs[paragraphIndex];
            if (paragraph.isInList())
                return paragraph.numberingListIndex;
        }
        return -1;
    }
    applyParameters(_state, params) {
        let firstParagraph = this.selection.activeSubDocument.getParagraphByPosition(this.selection.intervals[0].start);
        const abstractNumberingList = firstParagraph.getAbstractNumberingList();
        if (params.selectedAbstractNumberingList) {
            if (this.selection.isCollapsed() && firstParagraph.isInList()) {
                const levelIndex = firstParagraph.getListLevelIndex();
                const newParams = new DialogCustomNumberingListParameters();
                const targetNumberingList = params.selectedAbstractNumberingList.getListType() == NumberingType.MultiLevel ? params.selectedAbstractNumberingList : abstractNumberingList;
                newParams.init(this.colorProvider, targetNumberingList);
                newParams.levels[levelIndex].copyFrom(newParams.initLevel(this.colorProvider, params.selectedAbstractNumberingList.levels[levelIndex]));
                const dialogCustomNumberingListCommand = new DialogCustomNumberingListCommand(this.control);
                dialogCustomNumberingListCommand.applyParameters(_state, newParams);
            }
            else
                this.control.commandManager.getCommand(RichEditClientCommand.InsertNumerationToParagraphs)
                    .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, params.selectedAbstractNumberingList));
            return true;
        }
        else if (params.selectedAbstractNumberingList === null) {
            this.control.commandManager.getCommand(RichEditClientCommand.DeleteNumerationFromParagraphs).execute(this.control.commandManager.isPublicApiCall);
            return true;
        }
        return false;
    }
    getDialogName() {
        return "NumberingList";
    }
}
export class DialogNumberingListParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.currentLevel = 0;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.selectedAbstractNumberingList = obj.selectedAbstractNumberingList;
    }
    clone() {
        const newInstance = new DialogNumberingListParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
