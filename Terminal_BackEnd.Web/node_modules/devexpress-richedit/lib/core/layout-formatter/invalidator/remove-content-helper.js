import { Errors } from '@devexpress/utils/lib/errors';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LayoutTextBox } from '../../layout/main-structures/layout-boxes/layout-text-box';
import { ColumnChange } from '../changes/changes/column-change';
import { LayoutChangeType, RowChange } from '../changes/changes/layout-change-base';
import { PageAreaChange } from '../changes/changes/page-area-change';
import { PageChange } from '../changes/changes/page-change';
export class RemoveContentHelper {
    static deleteInterval(layout, layoutPos, deletedInterval, pageChanges) {
        RemoveContentHelper.deleteElementContent(0, [
            new RemoveLayoutContent(FixedInterval.fromPositions(0, deletedInterval.end), pageChanges),
            new RemovePageContent(layoutPos, layout.pages),
            new RemovePageAreaContent(layoutPos),
            new RemoveColumnContent(layoutPos),
            new RemoveRowContent(layoutPos)
        ], deletedInterval);
    }
    static deleteElementContent(level, levelsInfo, deletedInterval) {
        const currLevelInfo = levelsInfo[level];
        currLevelInfo.contentDeleted = false;
        let elementInterval = currLevelInfo.getElementInterval();
        let elementStartPos = elementInterval.start;
        let intersection = IntervalAlgorithms.getIntersection(elementInterval, deletedInterval);
        let correctOffsets = false;
        if (intersection && intersection.length > 0) {
            if (elementInterval.length == intersection.length && level > 0) {
                levelsInfo[level - 1].addChange(levelsInfo[level].deleteElement());
                return true;
            }
            if (level + 1 == levelsInfo.length) {
                const newRowLength = elementInterval.length - intersection.length;
                const fakeBox = new LayoutTextBox(null, null, StringUtils.repeat(" ", newRowLength));
                fakeBox.rowOffset = 0;
                const row = currLevelInfo.getElement();
                row.boxes = [fakeBox];
                currLevelInfo.contentDeleted = true;
            }
            else {
                const lowerLevelDeletedInterval = new FixedInterval(intersection.start - elementStartPos, intersection.length);
                const nextLevelInfo = levelsInfo[level + 1];
                if (level > 0)
                    currLevelInfo.assignChanges(levelsInfo[level - 1]);
                while (nextLevelInfo.setElement()) {
                    if (!this.deleteElementContent(level + 1, levelsInfo, lowerLevelDeletedInterval))
                        nextLevelInfo.incElementIndex();
                    if (nextLevelInfo.contentDeleted) {
                        if (level == 1)
                            currLevelInfo.layoutPosition.page.isValid = false;
                        currLevelInfo.contentDeleted = true;
                    }
                }
                correctOffsets = true;
            }
        }
        if (intersection) {
            if (elementStartPos == intersection.start)
                currLevelInfo.setElementOffset(deletedInterval.start);
        }
        else {
            if (elementStartPos >= deletedInterval.end)
                currLevelInfo.setElementOffset(Math.max(0, elementStartPos - deletedInterval.length));
        }
        if (correctOffsets)
            currLevelInfo.correctOffsets();
        if (level == 1) {
            const change = currLevelInfo.updatePage(!!intersection);
            if (change) {
                levelsInfo[0].addChange(change);
                return true;
            }
        }
        return false;
    }
}
class RemoveExistanceContent {
}
class RemoveLayoutContent extends RemoveExistanceContent {
    constructor(delInterval, pageChanges) {
        super();
        this.delInterval = delInterval;
        this.pageChanges = pageChanges;
    }
    setElement() {
        return null;
    }
    incElementIndex() {
    }
    getElementInterval() {
        return this.delInterval;
    }
    setElementOffset(_newOffset) {
    }
    deleteElement() {
        return null;
    }
    correctOffsets() {
    }
    addChange(change) {
        this.pageChanges.push(change);
    }
    assignChanges(_topLevel) {
    }
}
class RemovePageContent extends RemoveExistanceContent {
    constructor(layoutPosition, pages) {
        super();
        this.layoutPosition = layoutPosition;
        this.pages = pages;
    }
    updatePage(isMarkPageIntervalsAsIncorrect) {
        const page = this.layoutPosition.page;
        if (isMarkPageIntervalsAsIncorrect)
            page.markPageIntervalsAsIncorrect();
        const pageIndex = this.layoutPosition.pageIndex;
        const prevPage = this.pages[pageIndex - 1];
        if (prevPage && page.getPosition() <= prevPage.getPosition()) {
            page.index = pageIndex - 1;
            page.y = page.index > 0 ? this.pages[page.index - 1].bottom : 0;
            return this.deleteElement(page.index);
        }
        page.index = pageIndex;
        page.y = prevPage ? prevPage.bottom : 0;
        return null;
    }
    checkTableExceptionCase() {
        const pageIndex = this.layoutPosition.pageIndex;
        return pageIndex - 1 >= 0 && this.pages[pageIndex].getPosition() <= this.pages[pageIndex - 1].getPosition() ? this.deleteElement(pageIndex - 1) : null;
    }
    setElement() {
        return !!(this.layoutPosition.page = this.pages[this.layoutPosition.pageIndex]);
    }
    incElementIndex() {
        this.layoutPosition.pageIndex++;
    }
    getElementInterval() {
        const elem = this.layoutPosition.page;
        return FixedInterval.fromPositions(elem.getPosition(), elem.getEndPosition());
    }
    setElementOffset(newOffset) {
        this.layoutPosition.page.setAbsolutePosition(newOffset);
    }
    deleteElement(index = this.layoutPosition.pageIndex) {
        this.pages.splice(index, 1);
        return new PageChange(index, LayoutChangeType.Deleted, [], []);
    }
    correctOffsets() {
        RemovePageContent.correctPageOffsets(this.layoutPosition.page);
    }
    addChange(change) {
        this.pageAreaChanges.push(change);
    }
    assignChanges(topLevel) {
        this.pageAreaChanges = [];
        topLevel.pageChanges.push(new PageChange(this.layoutPosition.pageIndex, LayoutChangeType.Updated, this.pageAreaChanges, []));
    }
    static correctPageOffsets(page) {
        const pageAreas = page.mainSubDocumentPageAreas;
        if (!pageAreas.length)
            return;
        const offsetFirstPageAreaFromPage = pageAreas[0].pageOffset;
        if (offsetFirstPageAreaFromPage > 0) {
            page.setAbsolutePosition(page.getPosition() + offsetFirstPageAreaFromPage);
            for (let pageArea of pageAreas)
                pageArea.pageOffset -= offsetFirstPageAreaFromPage;
        }
    }
}
class RemovePageAreaContent extends RemoveExistanceContent {
    constructor(layoutPosition) {
        super();
        this.layoutPosition = layoutPosition;
    }
    setElement() {
        if (this.layoutPosition.pageArea = this.layoutPosition.page.mainSubDocumentPageAreas[this.layoutPosition.pageAreaIndex])
            return true;
        else {
            this.layoutPosition.pageAreaIndex = 0;
            return false;
        }
    }
    incElementIndex() {
        this.layoutPosition.pageAreaIndex++;
    }
    getElementInterval() {
        const elem = this.layoutPosition.pageArea;
        return FixedInterval.fromPositions(elem.pageOffset, elem.getEndPosition());
    }
    setElementOffset(newOffset) {
        this.layoutPosition.pageArea.pageOffset = newOffset;
    }
    deleteElement() {
        const index = this.layoutPosition.pageAreaIndex;
        this.layoutPosition.page.mainSubDocumentPageAreas.splice(index, 1);
        return new PageAreaChange(index, LayoutChangeType.Deleted, []);
    }
    correctOffsets() {
        RemovePageAreaContent.correctColumnOffsets(this.layoutPosition.pageArea);
    }
    addChange(change) {
        this.columnChanges.push(change);
    }
    assignChanges(topLevel) {
        this.columnChanges = [];
        topLevel.pageAreaChanges.push(new PageAreaChange(this.layoutPosition.pageAreaIndex, LayoutChangeType.Updated, this.columnChanges));
    }
    static correctColumnOffsets(pageArea) {
        const columns = pageArea.columns;
        if (!columns.length)
            return;
        const offsetFirstColumnFromPageArea = columns[0].pageAreaOffset;
        if (offsetFirstColumnFromPageArea > 0) {
            pageArea.pageOffset += offsetFirstColumnFromPageArea;
            for (let column of columns)
                column.pageAreaOffset -= offsetFirstColumnFromPageArea;
        }
    }
}
class RemoveColumnContent extends RemoveExistanceContent {
    constructor(layoutPosition) {
        super();
        this.layoutPosition = layoutPosition;
    }
    setElement() {
        if (this.layoutPosition.column = this.layoutPosition.pageArea.columns[this.layoutPosition.columnIndex])
            return true;
        else {
            this.layoutPosition.columnIndex = 0;
            return false;
        }
    }
    incElementIndex() {
        this.layoutPosition.columnIndex++;
    }
    getElementInterval() {
        const elem = this.layoutPosition.column;
        return FixedInterval.fromPositions(elem.pageAreaOffset, elem.getEndPosition());
    }
    setElementOffset(newOffset) {
        this.layoutPosition.column.pageAreaOffset = newOffset;
    }
    deleteElement() {
        const index = this.layoutPosition.columnIndex;
        this.layoutPosition.pageArea.columns.splice(index, 1);
        return new ColumnChange(index, LayoutChangeType.Deleted, [], [], []);
    }
    correctOffsets() {
        RemoveColumnContent.correctRowOffsets(this.layoutPosition.column);
    }
    addChange(change) {
        this.rowChanges.push(change);
    }
    assignChanges(topLevel) {
        this.rowChanges = [];
        topLevel.columnChanges.push(new ColumnChange(this.layoutPosition.columnIndex, LayoutChangeType.Updated, this.rowChanges, [], []));
    }
    static correctRowOffsets(column) {
        const rows = column.rows;
        if (!rows.length)
            return;
        const offsetFirstRowFromColumn = rows[0].columnOffset;
        if (offsetFirstRowFromColumn > 0) {
            column.pageAreaOffset += offsetFirstRowFromColumn;
            for (let row of rows)
                row.columnOffset -= offsetFirstRowFromColumn;
        }
    }
}
class RemoveRowContent extends RemoveExistanceContent {
    constructor(layoutPosition) {
        super();
        this.layoutPosition = layoutPosition;
    }
    getElement() {
        return this.layoutPosition.row;
    }
    getElementParentContainer() {
        return this.layoutPosition.column.rows;
    }
    setElement() {
        if (this.layoutPosition.row = this.layoutPosition.column.rows[this.layoutPosition.rowIndex])
            return true;
        else {
            this.layoutPosition.rowIndex = 0;
            return false;
        }
    }
    incElementIndex() {
        this.layoutPosition.rowIndex++;
    }
    getElementInterval() {
        const elem = this.layoutPosition.row;
        return FixedInterval.fromPositions(elem.columnOffset, elem.getEndPosition());
    }
    setElementOffset(newOffset) {
        if (newOffset < 0)
            throw new Error(Errors.InternalException);
        this.layoutPosition.row.columnOffset = newOffset;
    }
    deleteElement() {
        const index = this.layoutPosition.rowIndex;
        this.getElementParentContainer().splice(index, 1);
        return new RowChange(index, LayoutChangeType.Deleted);
    }
    correctOffsets() {
    }
    addChange(_change) {
    }
    assignChanges(_topLevel) {
    }
}
