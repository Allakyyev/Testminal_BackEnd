import { formatMessage } from 'devextreme/localization';
import { DialogBase } from './dialog-base';
export class InsertTableDialog extends DialogBase {
    getTitle() {
        return formatMessage('ASPxRichEditStringId.InsertTableTitle');
    }
    getMaxWidth() {
        return 300;
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
                        showSpinButtons: true,
                        min: 1
                    }
                },
                {
                    dataField: 'rowCount',
                    editorType: 'dxNumberBox',
                    label: { text: formatMessage('ASPxRichEditStringId.InsertTable_NumberOfRows'), location: 'left' },
                    editorOptions: {
                        value: this.parameters.rowCount,
                        showSpinButtons: true,
                        min: 1
                    }
                }]
        };
    }
    updateParameters(parameters, data) {
        parameters.columnCount = data.columnCount;
        parameters.rowCount = data.rowCount;
    }
}
