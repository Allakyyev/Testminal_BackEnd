import { formatMessage } from 'devextreme/localization';
import { TableCellOperation } from '../../base/commands/dialogs/dialog-insert-table-cells-command';
import { DialogBase } from './dialog-base';
export class InsertTableCellsDialog extends DialogBase {
    getMaxWidth() {
        return 300;
    }
    getTitle() {
        return formatMessage('ASPxRichEditStringId.InsertTableCellsTitle');
    }
    getFormOptions() {
        return {
            labelLocation: 'top',
            colCount: 1,
            items: [{
                    dataField: 'tableCellOperation',
                    editorType: 'dxRadioGroup',
                    label: { visible: false },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.InsertCells_ShiftCellsRight'), value: TableCellOperation.ShiftToTheHorizontally },
                            { text: formatMessage('ASPxRichEditStringId.InsertCells_ShiftCellsDown'), value: TableCellOperation.ShiftToTheVertically },
                            { text: formatMessage('ASPxRichEditStringId.InsertCells_InsertEntireRow'), value: TableCellOperation.RowOperation },
                            { text: formatMessage('ASPxRichEditStringId.InsertCells_InsertEntireColumn'), value: TableCellOperation.ColumnOperation },
                        ],
                        valueExpr: "value",
                        value: this.parameters.tableCellOperation
                    }
                }]
        };
    }
    updateParameters(parameters, data) {
        parameters.tableCellOperation = data.tableCellOperation;
    }
}
