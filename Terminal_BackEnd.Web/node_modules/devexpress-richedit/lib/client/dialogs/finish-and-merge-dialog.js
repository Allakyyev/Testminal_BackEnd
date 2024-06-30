import { formatMessage } from 'devextreme/localization';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { MailMergeExportRange, MergeMode } from '../../base/commands/dialogs/dialog-finish-and-merge-command';
import { DocumentFormat } from '../../core/document-format';
import { FileNameHelper } from '../../core/formats/file-name-helper';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { MailMergeCommandParameters } from '../commands/mail-merge-command';
import { DialogBase } from './dialog-base';
export class FinishAndMergeDialog extends DialogBase {
    getTitle() {
        return formatMessage('ASPxRichEditStringId.ExportRangeTitle');
    }
    getMaxWidth() {
        return 400;
    }
    getFormOptions() {
        return {
            labelLocation: 'left',
            items: [{
                    dataField: 'range',
                    editorType: 'dxRadioGroup',
                    label: { visible: false },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.FinishMerge_AllRecords'), value: MailMergeExportRange.AllRecords },
                            { text: formatMessage('ASPxRichEditStringId.FinishMerge_CurrentRecord'), value: MailMergeExportRange.CurrentRecord },
                            { text: formatMessage('ASPxRichEditStringId.FinishMerge_Range'), value: MailMergeExportRange.Range }
                        ],
                        valueExpr: "value",
                        value: this.parameters.range,
                        onValueChanged: (e) => {
                            this.updateRangeEditorsEnabled(e.component.option('value') == MailMergeExportRange.Range);
                            this.updateMergeModeEditorEnabled(e.component.option('value') != MailMergeExportRange.CurrentRecord);
                        }
                    }
                },
                {
                    itemType: "group",
                    caption: formatMessage('ASPxRichEditStringId.FinishMerge_Range'),
                    items: [{
                            dataField: 'exportFrom',
                            editorType: 'dxNumberBox',
                            label: { text: formatMessage('ASPxRichEditStringId.FinishMerge_From'), location: 'left' },
                            editorOptions: {
                                value: this.parameters.exportFrom,
                                showSpinButtons: true,
                                min: 1,
                                onInitialized: (e) => { this.fromNumberBox = e.component; }
                            }
                        },
                        {
                            dataField: 'exportRecordsCount',
                            editorType: 'dxNumberBox',
                            label: { text: formatMessage('ASPxRichEditStringId.FinishMerge_Count'), location: 'left' },
                            editorOptions: {
                                value: this.parameters.exportRecordsCount,
                                showSpinButtons: true,
                                min: 1,
                                onInitialized: (e) => { this.countNumberBox = e.component; }
                            }
                        }]
                },
                {
                    dataField: 'mergeMode',
                    editorType: 'dxSelectBox',
                    label: { text: formatMessage('ASPxRichEditStringId.FinishMerge_MergeMode'), location: 'left' },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.FinishMerge_NewParagraph'), value: MergeMode.NewParagraph },
                            { text: formatMessage('ASPxRichEditStringId.FinishMerge_NewSection'), value: MergeMode.NewSection }
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: this.parameters.mergeMode,
                        onInitialized: (e) => { this.mergeModeSelectBox = e.component; }
                    }
                },
                {
                    dataField: 'documentFormat',
                    editorType: 'dxSelectBox',
                    label: { text: formatMessage('ASPxRichEditStringId.FinishMerge_DocumentFormat'), location: 'left' },
                    editorOptions: {
                        items: [
                            { text: 'Word Document (*.docx)', value: DocumentFormat.OpenXml },
                            { text: 'Rich Text Format (*.rtf)', value: DocumentFormat.Rtf },
                            { text: 'Plain Text (*.txt)', value: DocumentFormat.PlainText },
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: this.parameters.documentFormat
                    }
                }]
        };
    }
    afterShowing() {
        this.updateRangeEditorsEnabled(false);
    }
    updateRangeEditorsEnabled(enabled) {
        this.fromNumberBox.option('disabled', !enabled);
        this.countNumberBox.option('disabled', !enabled);
    }
    updateMergeModeEditorEnabled(enabled) {
        this.mergeModeSelectBox.option('disabled', !enabled);
    }
    updateParameters(parameters, data) {
        parameters.range = data.range;
        parameters.exportFrom = data.exportFrom;
        parameters.exportRecordsCount = data.exportRecordsCount;
        parameters.mergeMode = data.mergeMode;
        parameters.documentFormat = data.documentFormat;
    }
    applyParameters() {
        super.applyParameters();
        const from = this.parameters.range == MailMergeExportRange.AllRecords ? 0 :
            this.parameters.range == MailMergeExportRange.Range ?
                this.parameters.exportFrom - 1 :
                this.richedit.modelManager.richOptions.mailMerge.activeRecordIndex;
        const recordCount = this.parameters.range == MailMergeExportRange.AllRecords ? Infinity :
            this.parameters.range == MailMergeExportRange.Range ? this.parameters.exportRecordsCount : 1;
        const params = new MailMergeCommandParameters((file) => { FileUtils.startDownloadFileLocal(file, 'MergedDocument' + FileNameHelper.convertToString(this.parameters.documentFormat)); }, this.parameters.mergeMode, this.parameters.documentFormat, from, recordCount);
        this.richedit.commandManager.getCommand(RichEditClientCommand.MailMergeOnClient).execute(this.richedit.commandManager.isPublicApiCall, params);
    }
}
