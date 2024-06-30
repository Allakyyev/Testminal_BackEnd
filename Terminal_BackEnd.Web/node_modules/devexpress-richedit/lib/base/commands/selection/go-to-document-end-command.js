import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class GoToDocumentEndCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        this.control.layoutFormatterManager.formatSyncAllDocument();
        const subDocument = this.selection.activeSubDocument;
        const layout = this.control.layout;
        const lastPage = subDocument.isMain() ? layout.getLastValidPage() : layout.pages[this.selection.pageIndex];
        if (!this.extendSelection()) {
            var pageAreas = lastPage.mainSubDocumentPageAreas;
            var lastPageArea = pageAreas[pageAreas.length - 1];
            var lastColumn = lastPageArea.columns[lastPageArea.columns.length - 1];
            var lastRow = lastColumn.rows[lastColumn.rows.length - 1];
            var boxIndex = lastRow.getLastVisibleBoxIndex();
            if (boxIndex >= 0) {
                var box = lastRow.boxes[boxIndex];
                this.setSelection((subDocument.isMain() ? lastPage.getPosition() : 0) + lastPageArea.pageOffset + lastColumn.pageAreaOffset + lastRow.columnOffset + box.getEndPosition());
            }
            else {
                var box = lastRow.boxes[0];
                this.setSelection((subDocument.isMain() ? lastPage.getPosition() : 0) + lastPageArea.pageOffset + lastColumn.pageAreaOffset + lastRow.columnOffset + box.rowOffset);
            }
        }
        else
            this.setSelection(subDocument.isMain() ? lastPage.getEndPosition() : lastPage.otherPageAreas[subDocument.id].getEndPosition());
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class GoToDocumentEndCommand extends GoToDocumentEndCommandBase {
    setSelection(position) {
        this.selection.deprecatedSetSelection(position, position, false, -1, true);
    }
    extendSelection() {
        return false;
    }
}
export class ExtendGoToDocumentEndCommand extends GoToDocumentEndCommandBase {
    setSelection(position) {
        this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false));
    }
    extendSelection() {
        return true;
    }
}
