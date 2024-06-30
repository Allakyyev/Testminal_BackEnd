import { formatMessage } from 'devextreme/localization';
import { DialogBase } from './dialog-base';
export class SplitTableCellsDialog extends DialogBase {
    getMaxWidth() {
        return 400;
    }
    getTitle() {
        return formatMessage('ASPxRichEditStringId.SplitTableCellsTitle');
    }
    getFormOptions() {
        return {
            labelLocation: 'top',
            colCount: 1,
            items: [{
                    dataField: 'columnCount',
                    editorType: 'dxNumberBox',
                    label: { text: formatMessage('ASPxRichEditStringId.InsertTable_NumberOfColumns'), location: 'left' },
                    editorOptions: {
                        value: this.parameters.columnCount,
                        min: 1,
                        showSpinButtons: true
                    }
                },
                {
                    dataField: 'rowCount',
                    editorType: 'dxNumberBox',
                    label: { text: formatMessage('ASPxRichEditStringId.InsertTable_NumberOfRows'), location: 'left' },
                    editorOptions: {
                        value: this.parameters.rowCount,
                        disabled: this.parameters.disableRowsSelector,
                        min: 1,
                        max: this.parameters.availableRowNumber > 1 ? this.parameters.availableRowNumber : 100,
                        showSpinButtons: true
                    }
                },
                {
                    dataField: 'isMergeBeforeSplit',
                    editorType: 'dxCheckBox',
                    label: { visible: false },
                    editorOptions: {
                        text: formatMessage('ASPxRichEditStringId.SplitCells_MergeCells'),
                        disabled: !this.parameters.isMergeBeforeSplit,
                        value: this.parameters.isMergeBeforeSplit
                    }
                }]
        };
    }
    updateParameters(parameters, data) {
        parameters.columnCount = data.columnCount;
        parameters.rowCount = data.rowCount;
        parameters.isMergeBeforeSplit = data.isMergeBeforeSplit;
    }
}
