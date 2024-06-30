import { ApplyParagraphStyleHistoryItem } from '../../core/model/history/items/apply-style-history-items';
import { InsertParagraphManipulatorParams } from '../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RichUtils } from '../../core/model/rich-utils';
import { RunType } from '../../core/model/runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../../core/model/sub-document';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundleFull } from '../../core/rich-utils/properties-bundle';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ReadOnlyMode } from '../interfaces/i-rich-edit-core';
import { HistoryItemDirection } from '../model/history/selection/history-item-direction';
import { ScrollHistoryItem } from '../model/history/selection/scroll-history-item';
import { SelectionHistoryItem } from '../model/history/selection/selection-history-item';
import { ScrollState } from '../scroll/model-states';
export class CommandOptions {
    constructor(control) {
        this.control = control;
        this.changeSelection = true;
        this.isSetManually = true;
        if (control)
            this.intervalsInfo = this.control.selection.intervalsInfo.clone();
    }
    get subDocument() { return this.intervalsInfo.subDocument; }
    setChangeSelection(changeSelection) {
        this.changeSelection = changeSelection;
        return this;
    }
    setIntervalsInfo(intervalsInfo) {
        this.intervalsInfo = intervalsInfo;
        return this;
    }
}
export class CommandSimpleOptions extends CommandOptions {
    constructor(control, parameter) {
        super(control);
        this.param = parameter;
    }
}
export class CommandBase {
    constructor(control) {
        this.control = control;
    }
    get modelManipulator() { return this.control.modelManager.modelManipulator; }
    get selection() { return this.control.selection; }
    get history() { return this.control.modelManager.history; }
    get inputPosition() { return this.control.inputPosition; }
    get colorProvider() { return this.control.modelManager.model.colorProvider; }
    getRelatedCommands() {
        return { [this.commandId]: true };
    }
    execute(isPublicApiCall, parameter) {
        const isPublicApiCallPrevValue = this.control.commandManager.isPublicApiCall;
        this.control.commandManager.isPublicApiCall = isPublicApiCall;
        if (this.control.isClosed() && !this.isEnabledInClosedDocument()) {
            this.control.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
            return false;
        }
        const options = this.convertToCommandOptions(parameter);
        const state = this.getState(options);
        const modifiedState = this.control.getModifiedState();
        if (!state.enabled) {
            this.control.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
            return false;
        }
        this.beforeExecute();
        this.control.beginUpdate();
        this.control.commandManager.beforeExecuting(this);
        const executed = this.executeCore(state, options);
        this.control.commandManager.afterExecuting();
        const lockBarHolderUpdate = this.lockBarHolderUpdate(modifiedState);
        const lockInputPositionUpdating = this.lockInputPositionUpdating(modifiedState);
        if (lockBarHolderUpdate)
            this.control.barHolder.enableUpdate(false);
        if (lockInputPositionUpdating)
            this.control.inputPositionModelChangesListener.updateEnabled = false;
        this.control.endUpdate();
        this.afterExecute();
        this.control.barHolder.forceUpdate(this.getRelatedCommands());
        if (lockBarHolderUpdate)
            this.control.barHolder.enableUpdate(true);
        if (lockInputPositionUpdating)
            this.control.inputPositionModelChangesListener.updateEnabled = true;
        if (executed)
            this.updateControlState();
        this.control.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
        return executed;
    }
    afterExecute() { }
    beforeExecute() { }
    convertToCommandOptions(parameter) {
        if (parameter instanceof CommandOptions)
            return parameter;
        const options = new CommandSimpleOptions(this.control, this.DEPRECATEDConvertOptionsParameter(parameter));
        this.DEPRECATEDCorrectlMainCommandOptions(options);
        options.isSetManually = false;
        return options;
    }
    updateControlState() { }
    executeCore(_state, _options) {
        throw new Error(Errors.NotImplemented);
    }
    isEnabled(_options) {
        return this.control.commandManager.commandIsEnabled(this.commandId) && (this.isEnabledInReadOnlyMode() || this.control.readOnly != ReadOnlyMode.Persistent && this.canModify());
    }
    lockBarHolderUpdate(_prevModifiedState) {
        return false;
    }
    lockInputPositionUpdating(_prevModifiedState) {
        return false;
    }
    isEnabledInReadOnlyMode() {
        return false;
    }
    isEnabledInClosedDocument() {
        return false;
    }
    canModify() {
        return this.selection.activeSubDocument.isEditable(this.getIntervalsForModifying());
    }
    getIntervalsForModifying() {
        return this.selection.intervals;
    }
    getFloatingObjectParentSubDocument() {
        const specialRunInfo = this.selection.specialRunInfo;
        return specialRunInfo.isPictureSelected() ?
            this.selection.activeSubDocument :
            specialRunInfo.getParentSubDocument();
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter;
    }
    DEPRECATEDCorrectlMainCommandOptions(_options) {
    }
    static addSelectionBefore(control) {
        control.modelManager.history.addAndRedo(new ScrollHistoryItem(control.modelManager.modelManipulator, control.selection, new ScrollState().byScrollInfo.setPageInfo(control.viewManager.canvasManager.getScrollTopInfo()), null, HistoryItemDirection.OnUndo));
        control.modelManager.history.add(new SelectionHistoryItem(control.modelManager.modelManipulator, control.selection, control.selection.getState(), null, HistoryItemDirection.OnUndo));
    }
    static addSelectionAfter(control, endPos, customSelection = () => { }) {
        const state = control.selection.getState().setPosition(endPos);
        customSelection(state);
        control.modelManager.history.addAndRedo(new SelectionHistoryItem(control.modelManager.modelManipulator, control.selection, null, state, HistoryItemDirection.OnRedo));
        control.modelManager.history.addAndRedo(new ScrollHistoryItem(control.modelManager.modelManipulator, control.selection, null, new ScrollState().byModelPosition(control.selection).setModelPosition(endPos).useStdRelativePosition().useStdOffset(), HistoryItemDirection.OnRedo));
    }
    addSelectionBefore() {
        CommandBase.addSelectionBefore(this.control);
    }
    addSelectionAfter(endPos, customSelection = () => { }) {
        CommandBase.addSelectionAfter(this.control, endPos, customSelection);
    }
    insertText(subDocInterval, text) {
        const charBundle = this.inputPosition.charPropsBundle;
        this.history.beginTransaction();
        this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocInterval.subDocument, subDocInterval.interval), true, false);
        const params = new InsertTextManipulatorParams(new SubDocumentPosition(subDocInterval.subDocument, subDocInterval.interval.start), charBundle, RunType.TextRun, text);
        const insertedResult = this.modelManipulator.text.insertTextViaHistory(params);
        this.history.endTransaction();
        return insertedResult;
    }
    insertTextWithSelection(subDocInterval, text) {
        const charPropsBundle = this.inputPosition.charPropsBundle;
        this.insertSomeWithSelection(subDocInterval, (subDocPosition) => {
            const params = new InsertTextManipulatorParams(subDocPosition, charPropsBundle, RunType.TextRun, text);
            return this.modelManipulator.text.insertTextViaHistory(params).insertedInterval.end;
        });
    }
    insertSomeWithSelection(subDocInterval, insertAction) {
        this.history.beginTransaction();
        this.addSelectionBefore();
        this.modelManipulator.range.removeInterval(subDocInterval, true, false);
        const nextSelectionPosition = insertAction(new SubDocumentPosition(subDocInterval.subDocument, subDocInterval.interval.start));
        this.addSelectionAfter(nextSelectionPosition);
        this.history.endTransaction();
    }
    static replaceTextByParagraph(modelManager, inputPosition, subDocInterval) {
        subDocInterval.validateInterval();
        const interval = subDocInterval.interval;
        const subDocument = subDocInterval.subDocument;
        let characterStyle = inputPosition.getCharacterStyle();
        let maskedCharacterProperties = inputPosition.getMaskedCharacterProperties().clone();
        let currentParagraph = subDocument.getRunByPosition(interval.start).paragraph;
        const nextParagraphStyle = currentParagraph.paragraphStyle ? currentParagraph.paragraphStyle.nextParagraphStyle : null;
        const needToSetNextStyle = nextParagraphStyle && (currentParagraph.getEndPosition() - 1 == interval.end);
        const needToUseCurrentParagraphLastRunAsSource = currentParagraph.isInList() && !needToSetNextStyle &&
            !interval.containsInterval(currentParagraph.interval);
        modelManager.history.beginTransaction();
        if (interval.length > 0)
            modelManager.modelManipulator.range.removeInterval(subDocInterval, true, false);
        const newInterval = new FixedInterval(interval.start + RichUtils.specialCharacters.ParagraphMark.length, 0);
        let actionAfter = () => { };
        if (needToUseCurrentParagraphLastRunAsSource) {
            if (interval.length > 0)
                currentParagraph = subDocument.getRunByPosition(interval.start).paragraph;
            const paragraphLastRun = subDocument.getRunByPosition(currentParagraph.getEndPosition() - 1);
            characterStyle = paragraphLastRun.characterStyle;
            maskedCharacterProperties = paragraphLastRun.maskedCharacterProperties.clone();
        }
        else {
            if (needToSetNextStyle && subDocument.isEditable([new FixedInterval(newInterval.start, 1)]))
                actionAfter = (modelManager) => {
                    modelManager.history.addAndRedo(new ApplyParagraphStyleHistoryItem(modelManager.modelManipulator, new SubDocumentInterval(subDocument, newInterval), modelManager.model.stylesManager.addParagraphStyle(nextParagraphStyle)));
                };
        }
        modelManager.modelManipulator.paragraph.insertParagraphViaHistory(new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, subDocInterval.interval.start), new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle), new MaskedParagraphPropertiesBundleFull(undefined, undefined, undefined, undefined), false, actionAfter));
        modelManager.history.endTransaction();
        return new FixedInterval(interval.start, 1);
    }
}
