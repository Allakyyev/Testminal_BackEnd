import { formatMessage } from 'devextreme/localization';
import { Localization } from '../localization';
import { DialogBase } from './dialog-base';
export class AlertDialog extends DialogBase {
    getMaxWidth() {
        return 500;
    }
    getFormOptions() {
        return {
            labelLocation: 'top',
            colCount: 1,
            items: [{
                    dataField: 'text',
                    editorType: 'dxTextArea',
                    label: { visible: false },
                    editorOptions: {
                        value: Localization.getAlertText(this.parameters.messageTextId),
                        height: 80,
                        readOnly: true
                    }
                }]
        };
    }
    getToolbarItems() {
        return [this.getOkToolbarItem()];
    }
    updateParameters(_parameters, _data) { }
}
export class ErrorDialog extends AlertDialog {
    getTitle() {
        return formatMessage("ASPxRichEditStringId.ErrorTitle");
    }
}
export class InformationDialog extends AlertDialog {
    getTitle() {
        return formatMessage("ASPxRichEditStringId.InformationTitle");
    }
}
export class WarningDialog extends AlertDialog {
    getTitle() {
        return formatMessage("ASPxRichEditStringId.WarningTitle");
    }
}
