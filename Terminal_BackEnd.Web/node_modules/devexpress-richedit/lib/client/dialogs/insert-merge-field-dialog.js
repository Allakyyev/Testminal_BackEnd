import { formatMessage } from 'devextreme/localization';
import dxList from 'devextreme/ui/list';
import { DialogBase } from './dialog-base';
export class InsertMergeFieldDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.lastSearchText = '';
        this.fieldNames = [];
    }
    getTitle() {
        return formatMessage("XtraRichEditStringId.MenuCmd_ShowInsertMergeFieldForm");
    }
    getMaxWidth() {
        return 400;
    }
    getFormOptions() {
        return {
            items: [
                {
                    label: { visible: false },
                    editorType: 'dxTextBox',
                    editorOptions: {
                        onInput: (e) => { this.filter(e.component.option('text')); }
                    }
                },
                {
                    label: { visible: false },
                    template: () => {
                        const element = document.createElement('div');
                        let currentItemIndex = Number.NaN;
                        let resetDoubleClickTimerId = null;
                        this.fieldsList = new dxList(element, {
                            height: 250,
                            noDataText: formatMessage("ASPxRichEditStringId.InsertMergeField_NoFields"),
                            selectionMode: 'single',
                            onSelectionChanged: () => { this.setButtonsEnabled(); },
                            onItemClick: (e) => {
                                if (resetDoubleClickTimerId)
                                    clearTimeout(resetDoubleClickTimerId);
                                if (e.itemIndex == currentItemIndex) {
                                    this.applyParameters();
                                    this.popupDialog.hide();
                                }
                                if (typeof (e.itemIndex) === 'number')
                                    currentItemIndex = e.itemIndex;
                                else
                                    currentItemIndex = e.itemIndex ? e.itemIndex.item : Number.NaN;
                                resetDoubleClickTimerId = setTimeout(() => {
                                    currentItemIndex = Number.NaN;
                                }, (300));
                            },
                        });
                        return element;
                    }
                }
            ]
        };
    }
    afterShowing() {
        const rich = this.richedit.owner;
        this.fieldNames = Object.keys(rich.dataSource.items()[0]);
        this.fieldsList.option('items', this.fieldNames);
        this.setButtonsEnabled();
    }
    filter(text) {
        text = text.toLowerCase();
        if (text != this.lastSearchText) {
            this.lastSearchText = text;
            this.fieldsList.option('items', text.length > 0 ? this.fieldNames.filter(t => t.toLowerCase().indexOf(text) > -1) : this.fieldNames);
            this.setButtonsEnabled();
        }
    }
    setButtonsEnabled() {
        this.insertBtn.option('disabled', !this.fieldsList.option('selectedItems')[0]);
    }
    getToolbarItems() {
        return [
            {
                widget: 'dxButton',
                location: 'after',
                toolbar: 'bottom',
                options: {
                    text: formatMessage("ASPxRichEditStringId.InsertButton"),
                    onInitialized: (e) => { this.insertBtn = e.component; },
                    onClick: () => {
                        this.applyParameters();
                        this.popupDialog.hide();
                    }
                }
            },
            {
                widget: 'dxButton',
                location: 'after',
                toolbar: 'bottom',
                options: {
                    text: formatMessage("ASPxRichEditStringId.CloseButton"),
                    onClick: () => {
                        this.popupDialog.hide();
                        this.afterClosing();
                    }
                }
            }
        ];
    }
    updateParameters(parameters, _data) {
        parameters.fieldName = this.fieldsList.option('selectedItems')[0];
    }
}
