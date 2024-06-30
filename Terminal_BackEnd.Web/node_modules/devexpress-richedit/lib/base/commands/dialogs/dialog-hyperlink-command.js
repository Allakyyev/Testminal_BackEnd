import { Field, HyperlinkInfo } from '../../../core/model/fields/field';
import { FieldContextMenuHelper } from '../../../core/model/fields/field-context-menu-helper';
import { ApplyFieldHyperlinkStyleHistoryItem } from '../../../core/model/history/items/apply-field-hyperlink-style-history-item';
import { ChangeFieldHyperlinkInfoHistoryItem } from '../../../core/model/history/items/change-field-hyperlink-info-history-item';
import { FieldInsertHistoryItem } from '../../../core/model/history/items/field-insert-history-item';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { CreateFieldCommandBase } from '../fields/create-field-command';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogHyperlinkCommandBase extends ShowDialogCommandBase {
    getState(options) {
        var state = new SimpleCommandState(this.isEnabled(options));
        state.value = this.getStateValue();
        state.visible = this.isVisible();
        return state;
    }
    getStateValue() {
        return this.getSelectedField();
    }
    isEnabled(options) {
        const sdInterval = options ? options.intervalsInfo.subDocInterval : this.selection.subDocumentInterval;
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.hyperlinks) &&
            !(options ? options.intervalsInfo.multiselection : this.selection.multiselection) &&
            CreateFieldCommandBase.isTableProtectionOk(sdInterval);
    }
    isVisible() {
        return ControlOptions.isVisible(this.control.modelManager.richOptions.control.hyperlinks);
    }
    createParameters(options) {
        var parameters = new DialogHyperlinkParameters();
        parameters.canChangeDisplayText = FieldContextMenuHelper.canChangeHyperlinkDisplayText(options.intervalsInfo.subDocInterval);
        var field = this.getState().value;
        if (field) {
            var hyperlinkInfo = field.getHyperlinkInfo();
            parameters.url = hyperlinkInfo.uri;
            parameters.anchor = hyperlinkInfo.anchor;
            parameters.tooltip = hyperlinkInfo.tip;
            parameters.text = FieldContextMenuHelper.getHyperlinkResultText(options.subDocument, field);
        }
        else
            parameters.text = parameters.canChangeDisplayText ? options.subDocument.getText(options.intervalsInfo.interval) : "";
        parameters.bookmarkNames = ListUtils.map(this.control.modelManager.model.getAllBookmarks(false), (bm) => bm.name);
        return parameters;
    }
    applyParameters(state, newParams, initParams) {
        if (newParams.tooltip == initParams.tooltip && newParams.url == initParams.url && newParams.anchor == initParams.anchor && newParams.text == initParams.text)
            return false;
        var hyperlinkInfo = new HyperlinkInfo(newParams.url, newParams.anchor, newParams.tooltip, false);
        if (hyperlinkInfo.anchor == "" && hyperlinkInfo.uri == "")
            return false;
        var modelManipulator = this.modelManipulator;
        var selection = this.selection;
        var subDocument = this.selection.activeSubDocument;
        var history = this.history;
        var oldSelection = selection.lastSelectedInterval;
        if (oldSelection.end == subDocument.getDocumentEndPosition()) {
            oldSelection.length--;
            if (oldSelection.length < 0)
                return false;
        }
        history.beginTransaction();
        this.control.beginUpdate();
        var field = this.getField(state.value);
        history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(modelManipulator, subDocument, field.index, hyperlinkInfo));
        if (newParams.tooltip != initParams.tooltip || newParams.url != initParams.url || newParams.anchor != initParams.anchor) {
            selection.deprecatedSetSelection(field.getCodeStartPosition(), field.getSeparatorPosition(), false, selection.keepX, false, false);
            this.control.commandManager.getCommand(RichEditClientCommand.InsertText).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, HyperlinkInfo.getNewCodeText(hyperlinkInfo)));
        }
        if (initParams.canChangeDisplayText && newParams.text != initParams.text || field.getResultInterval().length == 0) {
            selection.deprecatedSetSelection(field.getResultStartPosition(), field.getResultEndPosition(), false, selection.keepX, false, false);
            this.control.commandManager.getCommand(RichEditClientCommand.InsertText).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, !newParams.text || newParams.text == "" ? hyperlinkInfo.getUriPlusAnchor() : newParams.text));
        }
        history.addAndRedo(new ApplyFieldHyperlinkStyleHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, field.getResultInterval())));
        selection.deprecatedSetSelection(field.getFieldEndPosition(), field.getFieldEndPosition(), false, selection.keepX, false, false);
        this.control.endUpdate();
        history.endTransaction();
        return true;
    }
    getField(stateValue) {
        var field;
        if (stateValue) {
            field = stateValue;
            field.showCode = false;
        }
        else {
            var selection = this.selection;
            var subDocument = this.selection.activeSubDocument;
            var initSelectionInterval = selection.lastSelectedInterval;
            this.history.addAndRedo(new FieldInsertHistoryItem(this.modelManipulator, subDocument, initSelectionInterval.start, 0, initSelectionInterval.length, false, this.inputPosition.charPropsBundle));
            var fieldIndex = Field.normedBinaryIndexOf(subDocument.fields, initSelectionInterval.start + 1);
            field = subDocument.fields[fieldIndex];
        }
        return field;
    }
    showCreateHyperlinkItem() {
        return FieldContextMenuHelper.showCreateHyperlinkItem(this.selection.activeSubDocument.fields, this.selection.lastSelectedInterval);
    }
    getSelectedField() {
        return FieldContextMenuHelper.getHyperlinkField(this.selection.activeSubDocument.fields, this.selection.lastSelectedInterval);
    }
    hasOneSelectedHyperlink() {
        return !!this.getSelectedField();
    }
    getDialogName() {
        return "Hyperlink";
    }
}
export class DialogCreateOrEditHyperlinkCommand extends DialogHyperlinkCommandBase {
    isEnabled() {
        return super.isEnabled() && (this.showCreateHyperlinkItem() || this.hasOneSelectedHyperlink());
    }
}
export class DialogCreateHyperlinkCommand extends DialogHyperlinkCommandBase {
    isVisible() {
        return super.isVisible() && this.showCreateHyperlinkItem();
    }
}
export class DialogEditHyperlinkCommand extends DialogHyperlinkCommandBase {
    isVisible() {
        return super.isVisible() && this.hasOneSelectedHyperlink();
    }
}
export class DialogHyperlinkParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.url = "";
        this.text = "";
        this.tooltip = "";
        this.anchor = "";
        this.bookmarkNames = [];
        this.canChangeDisplayText = true;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.anchor = obj.anchor;
        this.url = obj.url;
        this.text = obj.text;
        this.tooltip = obj.tooltip;
        this.canChangeDisplayText = obj.canChangeDisplayText;
        this.bookmarkNames = obj.bookmarkNames;
    }
    clone() {
        const newInstance = new DialogHyperlinkParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
