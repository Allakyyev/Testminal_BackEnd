import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
import { ColumnChange } from '../changes/column-change';
import { AnchoredPictureChange, LayoutChangeType, RowChange, TableChange } from '../changes/layout-change-base';
import { PageAreaChange } from '../changes/page-area-change';
import { PageChange } from '../changes/page-change';
import { ParagraphFrameChangesCollector } from './paragraph-frame-changes-collector';
import { TableCellsComparer } from './table-cells-comparer';
export class PageChangesCollector {
    static collectHeaderFooterChanges(pageIndex, oldPageAreas, newPageAreas) {
        return new PageChange(pageIndex, LayoutChangeType.Updated, [], PageChangesCollector.collectMapChanges(oldPageAreas, newPageAreas, PageAreaChange, (_a, _b) => true, PageChangesCollector.collectColumnsChanges));
    }
    static collectPageChanges(layoutPages, newPage) {
        const oldPage = layoutPages[newPage.index];
        if (oldPage) {
            const change = NumberMapUtils.anyOf(newPage.anchoredObjectHolder.objects, (newObj, id) => {
                const oldObj = oldPage.anchoredObjectHolder.objects[id];
                return oldObj && newObj.rendererLevel != oldObj.rendererLevel ? new PageChange(newPage.index, LayoutChangeType.Replaced) : null;
            });
            if (change)
                return change;
            if (!oldPage.renderLevelCalculator.equals(newPage.renderLevelCalculator))
                return new PageChange(newPage.index, LayoutChangeType.Replaced);
        }
        return PageChangesCollector.makeChange(oldPage, newPage, newPage.index, PageChange, (a, b) => a.equals(b) && a.layoutPageIndex == b.layoutPageIndex, (pChange, oldPage, newPage) => {
            pChange.mainPageAreaChanges = PageChangesCollector.collectListChanges(oldPage.mainSubDocumentPageAreas, newPage.mainSubDocumentPageAreas, PageAreaChange, (_a, _b) => true, PageChangesCollector.collectColumnsChanges);
            pChange.anchoredPictureChanges = PageChangesCollector.collectMapChanges(PageChangesCollector.getOnlyPictureObjects(oldPage.anchoredObjectHolder.objects), PageChangesCollector.getOnlyPictureObjects(newPage.anchoredObjectHolder.objects), AnchoredPictureChange, (a, b) => a.equals(b), (_change, _a, _b) => { });
            pChange.otherPageAreaChanges = PageChangesCollector.collectMapChanges(oldPage.otherPageAreas, newPage.otherPageAreas, PageAreaChange, (a, b) => {
                return a.subDocument.isTextBox() ?
                    oldPage.anchoredObjectHolder.getTextBoxByInternalSubDocId(a.subDocument.id)
                        .equals(newPage.anchoredObjectHolder.getTextBoxByInternalSubDocId(b.subDocument.id)) : true;
            }, PageChangesCollector.collectColumnsChanges);
        }).reduceChanges();
    }
    static getOnlyPictureObjects(objs) {
        return NumberMapUtils.reducedMap(objs, (o) => o.getType() == LayoutBoxType.AnchorPicture ? o : null);
    }
    static collectColumnsChanges(paChange, oldPA, newPA) {
        const tableCellsComparer = new TableCellsComparer();
        paChange.columnChanges = PageChangesCollector.collectListChanges(oldPA.columns, newPA.columns, ColumnChange, (_a, _b) => true, (colChange, oldCol, newCol) => {
            colChange.rowChanges = PageChangesCollector.collectListChanges(oldCol.rows, newCol.rows, RowChange, (a, b) => PageChangesCollector.isLayoutRowEquivalent(a, b, tableCellsComparer), (_rowChange, _oldRow, _newRow) => { });
            colChange.paragraphFrameChanges = ParagraphFrameChangesCollector.collect(oldCol.paragraphFrames, newCol.paragraphFrames);
            colChange.tableChanges = PageChangesCollector.collectListChanges(oldCol.tablesInfo, newCol.tablesInfo, TableChange, (a, b) => a === b, (_tableChange, _oldTblColInfo, _newTblColInfo) => { });
        });
    }
    static collectListChanges(oldObjects, newObjects, changeConctructor, equals, fillChange) {
        const changes = [];
        for (let ind = 0, newObj; newObj = newObjects[ind]; ind++)
            changes.push(PageChangesCollector.makeChange(oldObjects[ind], newObj, ind, changeConctructor, (a, b) => a.equals(b) && equals(a, b), fillChange));
        ListUtils.reverseForEach(oldObjects, (_oldObj, ind) => changes.push(new changeConctructor(ind, LayoutChangeType.Deleted)), oldObjects.length - 1, newObjects.length);
        return changes;
    }
    static collectMapChanges(oldObjects, newObjects, changeConctructor, equals, fillChange) {
        const changes = [];
        const tmpOldObj = NumberMapUtils.map(oldObjects, (obj) => obj);
        NumberMapUtils.forEach(newObjects, (newObj, id) => {
            changes.push(PageChangesCollector.makeChange(tmpOldObj[id], newObj, id, changeConctructor, (a, b) => a.equals(b) && equals(a, b), fillChange));
            delete tmpOldObj[id];
        });
        NumberMapUtils.forEach(tmpOldObj, (_oldObj, ind) => changes.push(new changeConctructor(ind, LayoutChangeType.Deleted)));
        return changes;
    }
    static makeChange(oldObj, newObj, index, changeConctructor, equals, fillChange) {
        if (!oldObj) {
            return new changeConctructor(index, LayoutChangeType.Inserted);
        }
        if (equals(oldObj, newObj)) {
            const change = new changeConctructor(index, LayoutChangeType.Updated);
            fillChange(change, oldObj, newObj);
            return change;
        }
        return new changeConctructor(index, LayoutChangeType.Replaced);
    }
    static isLayoutRowEquivalent(rowA, rowB, tableCellsComparer) {
        if (rowA.x != rowB.x || rowA.y != rowB.y || rowA.width != rowB.width ||
            rowA.height != rowB.height || rowA.baseLine != rowB.baseLine || rowA.boxes.length != rowB.boxes.length ||
            rowA.bookmarkBoxes.length != rowB.bookmarkBoxes.length ||
            (rowA.tableCellInfo ? rowA.indexInColumn != rowB.indexInColumn : false))
            return false;
        return ListUtils.anyOf2(rowA.boxes, rowB.boxes, (boxA, boxB) => !boxA.equals(boxB)) ||
            ListUtils.anyOf2(rowA.bookmarkBoxes, rowB.bookmarkBoxes, (boxA, boxB) => !boxA.equals(boxB)) ||
            !(rowA.numberingListBox ? rowA.numberingListBox.equals(rowB.numberingListBox) : !rowB.numberingListBox) ?
            false :
            tableCellsComparer.isEquivalent(rowA, rowB);
    }
}
