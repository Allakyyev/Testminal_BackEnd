import { formatMessage } from 'devextreme/localization';
import dxForm from 'devextreme/ui/form';
import dxPopup from 'devextreme/ui/popup';
export class DialogBase {
    constructor(element, richedit) {
        this.element = element;
        this.richedit = richedit;
    }
    get showCloseButton() {
        return undefined;
    }
    dispose() {
    }
    show(parameters, callback, afterClosing, _isModal) {
        this.parameters = parameters;
        this.callback = callback;
        this.afterClosing = afterClosing;
        this.element.className = '';
        this.element.innerHTML = '';
        const popupOptions = {
            title: this.getTitle(),
            shading: true,
            maxHeight: '100%',
            maxWidth: this.getMaxWidth(),
            contentTemplate: () => {
                const element = document.createElement('div');
                this.form = new dxForm(element, Object.assign(Object.assign({}, this.getFormOptionsCore()), this.getFormOptions()));
                return element;
            },
            toolbarItems: this.getToolbarItems(),
            height: 'auto',
            shadingColor: "rgba(0,0,0,0)",
            showCloseButton: this.showCloseButton,
            onHidden: () => { this.richedit.focusManager.captureFocus(); }
        };
        this.popupDialog = new dxPopup(this.element, popupOptions);
        this.popupDialog.show();
        this.afterShowing();
    }
    getToolbarItems() {
        return [this.getOkToolbarItem(), this.getCancelToolbarItem()];
    }
    getOkToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: formatMessage("ASPxRichEditStringId.OkButton"),
                onClick: () => {
                    this.applyParameters();
                    this.popupDialog.hide();
                    this.afterClosing();
                }
            }
        };
    }
    getCancelToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: formatMessage('ASPxRichEditStringId.CancelButton'),
                onClick: () => {
                    this.popupDialog.hide();
                    this.afterClosing();
                }
            }
        };
    }
    applyParameters() {
        const data = this.form.option("formData");
        this.updateParameters(this.parameters, data);
        this.callback(this.parameters);
    }
    afterShowing() { }
    getMaxWidth() { return 500; }
    getFormOptionsCore() {
        return {
            scrollingEnabled: true,
        };
    }
}
