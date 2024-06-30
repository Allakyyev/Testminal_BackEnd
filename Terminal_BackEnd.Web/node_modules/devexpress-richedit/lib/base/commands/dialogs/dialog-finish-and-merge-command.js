import { DocumentFormat } from '../../../core/document-format';
import { ControlOptions } from '../../../core/model/options/control';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogFinishAndMergeCommand extends ShowDialogCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            this.control.modelManager.richOptions.mailMerge.isEnabled &&
            this.control.modelManager.model.mainSubDocument.getDocumentEndPosition() > 1;
    }
    canModify() {
        return true;
    }
    createParameters(_options) {
        var parameters = new FinishAndMergeDialogParameters();
        parameters.range = MailMergeExportRange.AllRecords;
        parameters.exportFrom = 1;
        parameters.exportRecordsCount = this.control.modelManager.richOptions.mailMerge.recordCount;
        parameters.mergeMode = MergeMode.NewParagraph;
        parameters.documentFormat = DocumentFormat.OpenXml;
        return parameters;
    }
    getDialogName() {
        return "FinishAndMerge";
    }
}
export class FinishAndMergeDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.range = obj.range;
        this.exportFrom = obj.exportFrom;
        this.exportRecordsCount = obj.exportRecordsCount;
        this.mergeMode = obj.mergeMode;
        this.documentFormat = obj.documentFormat;
    }
    clone() {
        const newInstance = new FinishAndMergeDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
export var MergeMode;
(function (MergeMode) {
    MergeMode[MergeMode["NewParagraph"] = 0] = "NewParagraph";
    MergeMode[MergeMode["NewSection"] = 1] = "NewSection";
    MergeMode[MergeMode["JoinTables"] = 2] = "JoinTables";
})(MergeMode || (MergeMode = {}));
export var MailMergeExportRange;
(function (MailMergeExportRange) {
    MailMergeExportRange[MailMergeExportRange["AllRecords"] = 0] = "AllRecords";
    MailMergeExportRange[MailMergeExportRange["CurrentRecord"] = 1] = "CurrentRecord";
    MailMergeExportRange[MailMergeExportRange["Range"] = 2] = "Range";
})(MailMergeExportRange || (MailMergeExportRange = {}));
