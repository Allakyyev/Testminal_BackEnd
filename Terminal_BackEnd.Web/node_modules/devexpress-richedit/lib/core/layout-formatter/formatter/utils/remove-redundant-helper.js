import { ColumnChange } from '../../changes/changes/column-change';
import { LayoutChangeType, RowChange, TableChange } from '../../changes/changes/layout-change-base';
import { PageAreaChange } from '../../changes/changes/page-area-change';
import { PageChange } from '../../changes/changes/page-change';
export class RemoveRedundantHelper {
    constructor(changesManager) {
        this.changesManager = changesManager;
    }
    static removeRendundant(fromIndex, list, pushChange) {
        const result = fromIndex < list.length;
        for (let index = list.length - 1; index >= fromIndex; index--) {
            list.pop();
            pushChange(index);
        }
        return result;
    }
    removeRedundantPage(layout, firstRendundantPageIndex) {
        return RemoveRedundantHelper.removeRendundant(firstRendundantPageIndex, layout.pages, (index) => this.changesManager.addPageChange(new PageChange(index, LayoutChangeType.Deleted, [], [])));
    }
    removeRedundantPageAreas(page, firstRendundantPageAreaIndex, pageChange) {
        return RemoveRedundantHelper.removeRendundant(firstRendundantPageAreaIndex, page.mainSubDocumentPageAreas, (index) => pageChange.mainPageAreaChanges.push(new PageAreaChange(index, LayoutChangeType.Deleted, [])));
    }
    removeRedundantColumnsFromArea(pageArea, firstRedundantColumnIndex, pageAreaChange) {
        return RemoveRedundantHelper.removeRendundant(firstRedundantColumnIndex, pageArea.columns, (index) => pageAreaChange.columnChanges.push(new ColumnChange(index, LayoutChangeType.Deleted, [], [], [])));
    }
    removeRedundantRowsFromColumn(column, firstRendundantRowIndex, columnChange) {
        return RemoveRedundantHelper.removeRendundant(firstRendundantRowIndex, column.rows, (index) => columnChange.rowChanges.push(new RowChange(index, LayoutChangeType.Deleted)));
    }
    removeRedundantTableInfosFromColumn(column, firstRendundantTableIndex, columnChange) {
        return RemoveRedundantHelper.removeRendundant(firstRendundantTableIndex, column.tablesInfo, (index) => columnChange.tableChanges.push(new TableChange(index, LayoutChangeType.Deleted)));
    }
}
