import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { ErrorDialog, InformationDialog, WarningDialog } from './alert-dialog';
import { BookmarkDialog } from './bookmark-dialog';
import { DeleteTableCellsDialog } from './delete-table-cells-dialog';
import { FindReplaceDialog } from './find-replace-dialog';
import { FinishAndMergeDialog } from './finish-and-merge-dialog';
import { FontDialog } from './font-dialog';
import { HyperlinkDialog } from './hyperlink-dialog';
import { InsertMergeFieldDialog } from './insert-merge-field-dialog';
import { InsertTableCellsDialog } from './insert-table-cells-dialog';
import { InsertTableDialog } from './insert-table-dialog';
import { PageSetupDialog } from './page-setup-dialog';
import { ParagraphDialog } from './paragraph-dialog';
import { SplitTableCellsDialog } from './split-table-cells-dialog';
import { TabsDialog } from './tabs-dialog';
export class DialogManager {
    constructor(container, richedit) {
        this.dialogElement = container.appendChild(document.createElement('div'));
        this.richedit = richedit;
        this.dialogsMap = {};
        this.dialogsMap["EditFont"] = FontDialog;
        this.dialogsMap["EditParagraph"] = ParagraphDialog;
        this.dialogsMap["InsertTable"] = InsertTableDialog;
        this.dialogsMap["ErrorMessage"] = ErrorDialog;
        this.dialogsMap["InformationMessage"] = InformationDialog;
        this.dialogsMap["WarningMessage"] = WarningDialog;
        this.dialogsMap["Hyperlink"] = HyperlinkDialog;
        this.dialogsMap["Bookmarks"] = BookmarkDialog;
        this.dialogsMap["InsertTableCells"] = InsertTableCellsDialog;
        this.dialogsMap["DeleteTableCells"] = DeleteTableCellsDialog;
        this.dialogsMap["SplitTableCells"] = SplitTableCellsDialog;
        this.dialogsMap["FindReplace"] = FindReplaceDialog;
        this.dialogsMap["PageSetup"] = PageSetupDialog;
        this.dialogsMap["Tabs"] = TabsDialog;
        this.dialogsMap["InsertMergeField"] = InsertMergeFieldDialog;
        this.dialogsMap["FinishAndMerge"] = FinishAndMergeDialog;
    }
    dispose() {
        NumberMapUtils.forEach(this.dialogsMap, dialog => {
            if (dialog.dispose)
                dialog.dispose();
        });
        DomUtils.hideNode(this.dialogElement);
    }
    getDialog(name) {
        const dialogType = this.dialogsMap[name];
        return dialogType ? this.getDialogByType(dialogType) : null;
    }
    getDialogByType(type) {
        return new type(this.dialogElement, this.richedit);
    }
}
