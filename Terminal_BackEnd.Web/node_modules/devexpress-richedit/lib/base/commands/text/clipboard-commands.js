import { __awaiter } from "tslib";
import { getHTMLElementsFromHtml } from '../../rich-utils/html-utils';
import { DocumentExporterOptions } from '../../../core/formats/options';
import { ClientModelManager } from '../../../core/model-manager';
import { RangeCopy } from '../../../core/model/manipulators/range/create-range-copy-operation';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval, SubDocumentPosition } from '../../../core/model/sub-document';
import { Browser } from '@devexpress/utils/lib/browser';
import { EmptyBatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { Errors } from '@devexpress/utils/lib/errors';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { HtmlImporter } from '../../../html/import/html-importer';
import { TxtExporter } from '../../../txt/txt-exporter';
import { TxtImporter } from '../../../txt/txt-importer';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ClipboardCommand extends CommandBase {
    constructor(control, queryCommandId) {
        super(control);
        this.queryCommandId = queryCommandId;
        if (this.isTouchMode())
            ClipboardCommand.builtInClipboard = new BuiltInClipboard(this.control);
        this.clipboardHelper = new ClipboardHelper(this.control, this.isTouchMode());
    }
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.isVisible();
        return state;
    }
    isTouchMode() {
        return this.control.isTouchMode();
    }
    isCommandSupported() {
        const editableDocument = this.control.inputController.getEditableDocument();
        return !!editableDocument.queryCommandSupported && editableDocument.queryCommandSupported(this.queryCommandId);
    }
    execute(isPublicApiCall, parameter = this.control.shortcutManager.lastCommandExecutedByShortcut) {
        const isPublicApiCallPrevValue = this.control.commandManager.isPublicApiCall;
        this.control.commandManager.isPublicApiCall = isPublicApiCall;
        if (!this.isTouchMode() && !parameter && !this.isCommandSupported()) {
            this.control.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
            if (this.clipboardHelper.canReadFromClipboard()) {
                this.clipboardHelper.readFromClipboard().catch((reason) => {
                    console.warn(reason);
                    this.executeShowErrorMessageCommand();
                });
                return true;
            }
            else
                return this.executeShowErrorMessageCommand();
        }
        else {
            const options = this.convertToCommandOptions(parameter);
            this.beforeExecute();
            this.executeCore(this.getState(), options);
            this.control.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
            return true;
        }
    }
    executeCore(state, options) {
        if (!state.enabled || this.control.commandManager.clipboardTimerId != null)
            return false;
        if (!this.isTouchMode()) {
            if (!options.param)
                this.control.inputController.getEditableDocument().execCommand(this.queryCommandId, false, null);
            this.control.commandManager.clipboardTimerId = setTimeout(() => {
                this.executeFinalAction();
            }, this.getTimeout());
        }
        else
            this.executeBuiltInClipboardAction(this.getBuiltInClipboardActionType());
        return true;
    }
    getTimeout() {
        return ClipboardCommand.timeout;
    }
    executeFinalAction() {
        if (this.control.isClosed() || this.control.commandManager.clipboardTimerId === null)
            return;
        this.control.beginUpdate();
        this.changeModel();
        this.clipboardHelper.clearAfterImport();
        this.control.endUpdate();
        this.control.commandManager.clipboardTimerId = null;
    }
    executeShowErrorMessageCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.ShowErrorClipboardAccessDeniedMessageCommand).execute(this.control.commandManager.isPublicApiCall);
    }
    executeBuiltInClipboardAction(action) {
        this.control.beginUpdate();
        switch (action) {
            case BuiltInClipboardAction.Copy:
                ClipboardCommand.builtInClipboard.copy();
                this.tryWriteToClipboard();
                break;
            case BuiltInClipboardAction.Cut:
                ClipboardCommand.builtInClipboard.cut();
                this.tryWriteToClipboard();
                break;
            case BuiltInClipboardAction.Paste:
                if (this.clipboardHelper.canReadFromClipboard()) {
                    this.clipboardHelper.readFromClipboard().catch(reason => {
                        ClipboardCommand.builtInClipboard.paste();
                        console.warn(reason);
                    });
                }
                else
                    ClipboardCommand.builtInClipboard.paste();
                break;
        }
        this.control.endUpdate();
    }
    tryWriteToClipboard() {
        this.clipboardHelper.tryWriteToClipboard(ClipboardCommand.builtInClipboard.clipboardData).catch(reason => console.log(reason));
    }
    isVisible() {
        return true;
    }
    getBuiltInClipboardActionType() {
        throw new Error(Errors.NotImplemented);
    }
    changeModel() {
    }
    beforeExecute() {
        if (!Browser.TouchUI)
            this.control.focusManager.captureFocus();
    }
}
ClipboardCommand.additionalWaitingTimeForMac = 10;
ClipboardCommand.timeout = Browser.Firefox ? 10 :
    (Browser.MacOSPlatform && (Browser.WebKitFamily || Browser.Opera) ? 10 : 0);
export class CopySelectionCommand extends ClipboardCommand {
    constructor(control) {
        super(control, "copy");
    }
    copyEventRaised() {
        if (Browser.MacOSPlatform && this.control.commandManager.clipboardTimerId !== null) {
            setTimeout(() => {
                clearTimeout(this.control.commandManager.clipboardTimerId);
                this.executeFinalAction();
            }, ClipboardCommand.additionalWaitingTimeForMac);
        }
    }
    getTimeout() {
        return Browser.MacOSPlatform ? 300 : super.getTimeout();
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.copy) && !this.selection.isCollapsed();
    }
    isVisible() {
        return ControlOptions.isVisible(this.control.modelManager.richOptions.control.copy);
    }
    getBuiltInClipboardActionType() {
        return BuiltInClipboardAction.Copy;
    }
    beforeExecute() {
        if (ControlOptions.isEnabled(this.control.modelManager.richOptions.control.copy)) {
            super.beforeExecute();
            if (!this.isTouchMode())
                this.control.inputController.renderSelectionToEditableDocument();
        }
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class CutSelectionCommand extends ClipboardCommand {
    constructor(control) {
        super(control, "cut");
    }
    changeModel() {
        this.history.addTransaction(() => {
            const intervals = ListUtils.deepCopy(this.selection.intervalsInfo.intervals);
            ListUtils.reverseForEach(intervals, (interval) => this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, interval), true, true));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(intervals[0].start)));
        });
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.cut) && !this.selection.isCollapsed();
    }
    isVisible() {
        return ControlOptions.isVisible(this.control.modelManager.richOptions.control.cut);
    }
    getBuiltInClipboardActionType() {
        return BuiltInClipboardAction.Cut;
    }
    beforeExecute() {
        if (ControlOptions.isEnabled(this.control.modelManager.richOptions.control.cut)) {
            super.beforeExecute();
            if (!this.isTouchMode())
                this.control.inputController.renderSelectionToEditableDocument();
        }
    }
}
export class PasteSelectionCommand extends ClipboardCommand {
    constructor(control) {
        super(control, "paste");
    }
    getTimeout() {
        return Browser.MacOSPlatform ? 300 : super.getTimeout();
    }
    pasteEventRaised() {
        if (Browser.MacOSPlatform && this.control.commandManager.clipboardTimerId !== null) {
            setTimeout(() => {
                clearTimeout(this.control.commandManager.clipboardTimerId);
                this.executeFinalAction();
            }, ClipboardCommand.additionalWaitingTimeForMac);
        }
    }
    changeModel() {
        const elements = getHTMLElementsFromHtml(this.control.inputController, this.control.inputController.getEditableDocumentContent());
        if (!this.control.isLoadingPictureFromClipboard)
            this.control.importHtml(elements);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paste);
    }
    isVisible() {
        return ControlOptions.isVisible(this.control.modelManager.richOptions.control.paste) || this.isTouchMode();
    }
    getBuiltInClipboardActionType() {
        return BuiltInClipboardAction.Paste;
    }
    beforeExecute() {
        if (ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paste)) {
            super.beforeExecute();
            if (!this.isTouchMode()) {
                var selection = Browser.TouchUI ? window.getSelection() : this.control.inputController.getEditableDocument().getSelection();
                selection.removeAllRanges();
                var editableElement = this.control.inputController.getEditableDocument();
                selection.selectAllChildren(editableElement.body || editableElement);
            }
        }
    }
    isCommandSupported() {
        return Browser.IE;
    }
}
export class BuiltInClipboard {
    constructor(control) {
        this.control = control;
    }
    get clipboardData() { return this._clipboardData; }
    copy() {
        this._clipboardData = RangeCopy.create(this.control.selection.subDocumentIntervals);
    }
    paste() {
        if (this._clipboardData) {
            this.control.modelManager.modelManipulator.range.removeInterval(this.control.selection.subDocumentInterval, true, false);
            this._clipboardData.insertTo(this.control.modelManager.modelManipulator, this.control.selection.intervalsInfo.subDocPosition);
        }
    }
    cut() {
        this.control.modelManager.history.addTransaction(() => {
            this.copy();
            ListUtils.reverseForEach(this.control.selection.intervalsInfo.intervals, (interval) => this.control.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.control.selection.activeSubDocument, interval), true, true));
            this.control.modelManager.history.addAndRedo(new SelectionHistoryItem(this.control.modelManager.modelManipulator, this.control.selection, this.control.selection.getState(), this.control.selection.getState()
                .setPosition(this.control.selection.intervalsInfo.intervals[0].start)));
        });
    }
}
export class ClipboardHelper {
    constructor(control, useWithBuildInClipboard = false) {
        this.control = control;
        this.useWithBuildInClipboard = useWithBuildInClipboard;
    }
    get clipboard() {
        return navigator.clipboard;
    }
    canReadFromClipboard() {
        return !!(this.clipboard && (this.clipboard.read || this.clipboard.readText));
    }
    readFromClipboard() {
        if (this.clipboard.read)
            return this.clipboard.read().then(items => this.insertClipboardItems(items));
        else if (this.clipboard.readText)
            return this.clipboard.readText().then(text => this.insertPlainText(text));
        return Promise.reject(ClipboardHelper.browserDoesNotSupportReadingFromClipboard);
    }
    clearAfterImport() {
        const editableDocument = this.control.inputController.getEditableDocument();
        if (Browser.TouchUI) {
            getSelection().removeAllRanges();
            DomUtils.clearInnerHtml(Browser.MSTouchUI ? editableDocument.body : editableDocument);
        }
        else {
            const selection = editableDocument.getSelection ?
                editableDocument.getSelection() :
                editableDocument.selection;
            if (selection.removeAllRanges)
                selection.removeAllRanges();
            else if (selection.empty)
                selection.empty();
            DomUtils.clearInnerHtml(editableDocument.body);
        }
        if (!Browser.TouchUI || Browser.IE && Browser.MSTouchUI)
            this.control.inputController.selectEditableDocumentContent();
        else
            getSelection().selectAllChildren(editableDocument);
    }
    insertClipboardItems(items) {
        for (let item of items) {
            if (ListUtils.anyOf(item.types, type => type === 'text/html'))
                return this.insertClipboardItem(item, 'text/html', html => this.insertHtml(html));
            if (ListUtils.anyOf(item.types, type => type === 'text/plain'))
                return this.insertClipboardItem(item, 'text/plain', text => this.insertPlainText(text));
        }
        return Promise.reject(ClipboardHelper.noDataInClipboardMessage);
    }
    insertClipboardItem(item, type, insert) {
        return item.getType(type)
            .then(blob => this.readAsText(blob))
            .then(text => insert(text));
    }
    insertPlainText(text) {
        return new Promise((resolve, reject) => {
            if (ClipboardHelper.lastWritenTextHash === this.calculateHash(text))
                reject();
            ClipboardHelper.lastWritenTextHash = -1;
            const command = new InsertPlainTextCommand(this.control);
            if (command.execute(false, new CommandSimpleOptions(this.control, text)))
                resolve();
            else
                reject(ClipboardHelper.clipboardItemCannotBeInsertedMessage);
        });
    }
    insertHtml(html) {
        return new Promise((resolve, reject) => {
            try {
                this.control.beginUpdate();
                this.control.importHtml(getHTMLElementsFromHtml(this.control.inputController, html));
                this.clearAfterImport();
                this.control.endUpdate();
                resolve();
            }
            catch (_a) {
                reject(ClipboardHelper.clipboardItemCannotBeInsertedMessage);
            }
        });
    }
    canWriteToClipboard() {
        var _a;
        return !!((_a = this.clipboard) === null || _a === void 0 ? void 0 : _a.writeText);
    }
    writeToClipboard(clipboardData) {
        ClipboardHelper.lastWritenTextHash = -1;
        return new Promise((resolve, reject) => {
            const exporter = new TxtExporter(this.createModelManager(clipboardData.model).modelManipulator, new DocumentExporterOptions());
            exporter.exportToBlob((blob) => __awaiter(this, void 0, void 0, function* () {
                const text = yield this.readAsText(blob);
                if (this.useWithBuildInClipboard)
                    ClipboardHelper.lastWritenTextHash = this.calculateHash(text);
                if (this.canWriteToClipboard())
                    this.clipboard.writeText(text).then(() => resolve()).catch(reason => reject(reason));
                else
                    return Promise.reject(ClipboardHelper.browserDoesNotSupportWritingToClipboard);
            }));
        });
    }
    tryWriteToClipboard(clipboardData) {
        if (this.canWriteToClipboard())
            return this.writeToClipboard(clipboardData);
        return Promise.resolve();
    }
    calculateHash(text) {
        let hash = 0;
        if (text.length === 0)
            return hash;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }
    readAsText(blob) {
        return blob.text();
    }
    createModelManager(model) {
        return new ClientModelManager(model, this.control.modelManager.richOptions, new EmptyBatchUpdatableObject());
    }
}
ClipboardHelper.browserDoesNotSupportReadingFromClipboard = 'The browser does not support reading from the clipboard.';
ClipboardHelper.browserDoesNotSupportWritingToClipboard = 'The browser does not support writing to the clipboard.';
ClipboardHelper.noDataInClipboardMessage = 'There is no any supported data in the clipboard.';
ClipboardHelper.clipboardItemCannotBeInsertedMessage = 'The clipboard item cannot be inserted.';
ClipboardHelper.lastWritenTextHash = -1;
export class InsertHtmlCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const elements = getHTMLElementsFromHtml(this.control.inputController, options.param);
        this.history.addTransaction(() => {
            const charPropsBundle = this.inputPosition.charPropsBundle;
            this.modelManipulator.range.removeInterval(this.selection.subDocumentInterval, true, false);
            new HtmlImporter(this.control.modelManager, this.control.measurer, this.selection.intervalsInfo.subDocPosition, elements, charPropsBundle).import();
        });
        this.control.inputController.setEditableDocumentContent("");
        return true;
    }
}
class InsertPlainTextCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const text = options.param;
        let result = false;
        const subDocument = this.selection.activeSubDocument;
        const position = this.selection.anchorPosition;
        const subDocumentPosition = new SubDocumentPosition(subDocument, position);
        const charPropsBundle = this.control.inputPosition.charPropsBundle;
        const parPropsBundle = this.control.inputPosition.parPropsBundle;
        this.history.addTransaction(() => {
            this.modelManipulator.range.removeInterval(this.selection.subDocumentInterval, true, false);
            new TxtImporter().importFromString(text, subDocument.documentModel.modelOptions, (model, _formatImagesImporter) => {
                new RangeCopy(model, false).insertTo(this.control.modelManager.modelManipulator, subDocumentPosition);
                result = true;
            }, (_reason) => {
                result = false;
            }, charPropsBundle, parPropsBundle);
        });
        return result;
    }
}
export var BuiltInClipboardAction;
(function (BuiltInClipboardAction) {
    BuiltInClipboardAction[BuiltInClipboardAction["Copy"] = 0] = "Copy";
    BuiltInClipboardAction[BuiltInClipboardAction["Paste"] = 1] = "Paste";
    BuiltInClipboardAction[BuiltInClipboardAction["Cut"] = 2] = "Cut";
})(BuiltInClipboardAction || (BuiltInClipboardAction = {}));
