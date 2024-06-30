import { formatMessage } from 'devextreme/localization';
import dxButton from 'devextreme/ui/button';
import dxList from 'devextreme/ui/list';
import dxRadioGroup from 'devextreme/ui/radio_group';
import dxTextBox from 'devextreme/ui/text_box';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { DialogBase } from './dialog-base';
import { BookmarkNameValidator } from '../../core/model/bookmarks';
export class BookmarkDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.bookmarks = [];
    }
    getTitle() {
        return formatMessage("ASPxRichEditStringId.BookmarkTitle");
    }
    getMaxWidth() {
        return 400;
    }
    getFormOptions() {
        this.parameters.newBookmarkName = '';
        this.parameters.bookmarks.forEach(b => {
            this.bookmarks.push(new BookmarkInfoForDialog(b));
        });
        return {
            labelLocation: 'top',
            colCount: 3,
            items: [{
                    colSpan: 3,
                    label: { text: formatMessage("ASPxRichEditStringId.Bookmarks_BookmarkName"), location: 'top' },
                    template: () => {
                        const element = document.createElement('div');
                        const textBoxProperties = {
                            onValueChanged: () => { this.onBookmarkNameTextBoxValueChanged(); },
                            onInput: () => { this.onBookmarkNameTextBoxValueChanged(); }
                        };
                        this.bookmarkTextBox = new dxTextBox(element, textBoxProperties);
                        return element;
                    }
                },
                {
                    colSpan: 3,
                    template: () => {
                        const element = document.createElement('div');
                        this.bookmarksList = new dxList(element, {
                            height: 200,
                            noDataText: formatMessage("ASPxRichEditStringId.Bookmarks_NoBookmarks"),
                            selectionMode: 'single',
                            onSelectionChanged: () => { this.onListValueChanged(); }
                        });
                        return element;
                    }
                },
                {
                    colSpan: 3,
                    label: { text: formatMessage("ASPxRichEditStringId.Bookmarks_SortBy"), location: 'top' },
                    template: () => {
                        const element = document.createElement('div');
                        this.sortGroup = new dxRadioGroup(element, {
                            items: [formatMessage("ASPxRichEditStringId.Bookmarks_Name"), formatMessage("ASPxRichEditStringId.Bookmarks_Location")],
                            value: 'Name',
                            layout: 'horizontal',
                            onValueChanged: () => { this.updateDataSource(); }
                        });
                        return element;
                    }
                },
                {
                    template: () => {
                        const element = document.createElement('div');
                        this.addBtn = new dxButton(element, {
                            text: formatMessage("ASPxRichEditStringId.Bookmarks_Add"),
                            width: '100%',
                            onClick: () => {
                                this.parameters.newBookmarkName = this.bookmarkTextBox.option('text');
                                this.applyParameters();
                                this.popupDialog.hide();
                                this.afterClosing();
                            }
                        });
                        return element;
                    }
                },
                {
                    template: () => {
                        const element = document.createElement('div');
                        this.deleteBtn = new dxButton(element, {
                            text: formatMessage("ASPxRichEditStringId.Bookmarks_Delete"),
                            width: '100%',
                            onClick: () => { this.onBtnDeleteClick(); }
                        });
                        return element;
                    }
                },
                {
                    template: () => {
                        const element = document.createElement('div');
                        this.goToBtn = new dxButton(element, {
                            text: formatMessage("ASPxRichEditStringId.Bookmarks_GoTo"),
                            width: '100%',
                            onClick: () => { this.onBtnGoToClick(); }
                        });
                        return element;
                    }
                }]
        };
    }
    afterShowing() {
        this.updateDataSource();
    }
    updateDataSource() {
        const dataSource = this.getDataSource();
        this.bookmarksList.option('dataSource', dataSource);
        if (dataSource.length > 0) {
            const selectionBookmarkName = this.parameters.selectedBookmarkName;
            this.bookmarksList.selectItem(selectionBookmarkName ? dataSource.indexOf(selectionBookmarkName) : dataSource.length - 1);
        }
        const isValidName = this.getIsValidBookmarkName(this.bookmarkTextBox.option('text'));
        this.updateEnableState(isValidName);
    }
    getIsValidBookmarkName(name) {
        return BookmarkNameValidator.isValidName(name, false);
    }
    getDataSource() {
        if (this.sortGroup.option('value') == 'Name')
            this.bookmarks = this.bookmarks.sort((b1, b2) => b1.name > b2.name ? 1 : b1.name < b2.name ? -1 : 0);
        else
            this.bookmarks = this.bookmarks.sort((b1, b2) => b1.start - b2.start);
        return this.bookmarks.filter(b => !b.deleted).map(b => b.name);
    }
    updateEnableState(enable) {
        this.addBtn.option('disabled', !enable || !this.parameters.allowedEditBookmarks);
        const bookmarkName = this.bookmarkTextBox.option('text');
        const list = this.bookmarksList.option('items');
        const listEnable = list.some(b => b == bookmarkName);
        this.deleteBtn.option('disabled', !listEnable || !this.parameters.allowedEditBookmarks);
        this.goToBtn.option('disabled', !listEnable);
    }
    onBookmarkNameTextBoxValueChanged() {
        const isValid = this.getIsValidBookmarkName(this.bookmarkTextBox.option('text'));
        this.updateEnableState(isValid);
    }
    onBtnDeleteClick() {
        const name = this.bookmarkTextBox.option('text');
        this.bookmarks.forEach((b, index) => {
            if (b.name == name) {
                b.deleted = true;
                this.bookmarksList.deleteItem(index);
            }
        });
        this.updateDataSource();
    }
    onBtnGoToClick() {
        const name = this.bookmarkTextBox.option('text');
        const commandManager = this.richedit.commandManager;
        commandManager.getCommand(RichEditClientCommand.GoToBookmark).execute(commandManager.isPublicApiCall, name);
    }
    onListValueChanged() {
        const value = this.bookmarksList.option('selectedItems')[0];
        if (value && value.length > 0)
            this.bookmarkTextBox.option('value', value);
    }
    getToolbarItems() {
        return [{
                widget: 'dxButton',
                location: 'after',
                toolbar: 'bottom',
                options: {
                    text: formatMessage("ASPxRichEditStringId.CloseButton"),
                    onClick: () => {
                        this.applyParameters();
                        this.popupDialog.hide();
                        this.afterClosing();
                    }
                }
            }];
    }
    updateParameters(parameters, _data) {
        parameters.deletedBookmarkNames = this.bookmarks.filter(b => b.deleted).map(b => b.name);
    }
}
export class BookmarkInfoForDialog {
    constructor(b) {
        this.name = b.name;
        this.start = b.start;
        this.deleted = false;
    }
}
