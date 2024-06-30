import { formatMessage } from 'devextreme/localization';
import { TableCellOperation } from '../../base/commands/dialogs/dialog-insert-table-cells-command';
import { DialogBase } from './dialog-base';
export class DeleteTableCellsDialog extends DialogBase {
    getMaxWidth() {
        return 300;
    }
    getTitle() {
        return formatMessage("ASPxRichEditStringId.DeleteTableCellsTitle");
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
                            { text: formatMessage("ASPxRichEditStringId.DeleteCells_ShiftCellsLeft"), value: TableCellOperation.ShiftToTheHorizontally },
                            { text: formatMessage("ASPxRichEditStringId.DeleteCells_ShiftCellsUp"), value: TableCellOperation.ShiftToTheVertically },
                            { text: formatMessage("ASPxRichEditStringId.DeleteCells_DeleteEntireRow"), value: TableCellOperation.RowOperation },
                            { text: formatMessage("ASPxRichEditStringId.DeleteCells_DeleteEntireColumn"), value: TableCellOperation.ColumnOperation },
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
