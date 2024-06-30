import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { DocumentLayoutDetailsLevel } from '../layout/document-layout-details-level';
import { LayoutPosition } from '../layout/layout-position';
import { LayoutPage } from '../layout/main-structures/layout-page';
import { Log } from '../rich-utils/debug/logger/base-logger/log';
import { LogObjToStr } from '../rich-utils/debug/logger/base-logger/log-obj-to-str';
class PageIndexAndInterval {
    constructor(pageIndex, interval) {
        this.interval = interval;
        this.pageIndex = pageIndex;
    }
}
export class LayoutPositionCreatorConflictFlags {
    setDefault(defaultVal) {
        this.left = defaultVal;
        this.middle = defaultVal;
        this.right = defaultVal;
        this.simple = defaultVal;
        return this;
    }
    setCustom(left, middle, right, simple) {
        this.left = left;
        this.middle = middle;
        this.right = right;
        this.simple = simple;
        return this;
    }
    allIsTrue() {
        return this.left && this.middle && this.right && this.simple;
    }
    atLeastOneIsTrue() {
        return this.left || this.middle || this.right || this.simple;
    }
    atLeastOneIsFalse() {
        return !(this.left && this.middle && this.right && this.simple);
    }
    copyFrom(obj) {
        this.left = obj.left;
        this.middle = obj.middle;
        this.right = obj.right;
        this.simple = obj.simple;
        return this;
    }
    clone() {
        return new LayoutPositionCreatorConflictFlags().copyFrom(this);
    }
}
export class LayoutPositionCreator {
    constructor(documentLayout, subDocument, logPosition, detailsLevel) {
        this.layout = documentLayout;
        this.subDocument = subDocument;
        this.position = logPosition;
        this.startPosition = logPosition;
        this.detailsLevel = detailsLevel;
        this.result = new LayoutPosition(detailsLevel);
    }
    create(endRowConflictFlags, middleRowConflictFlags) {
        this.endRowConflictFlags = endRowConflictFlags;
        this.middleRowConflictFlags = middleRowConflictFlags;
        return null;
    }
    static createLightLayoutPosition(documentLayout, subDocument, logPosition, pageIndex, detailsLevel, endOfLine, closerToTheRightEdgeHiddenBox) {
        return (subDocument.isMain() ?
            new LayoutPositionMainSubDocumentCreator(documentLayout, subDocument, logPosition, detailsLevel)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(closerToTheRightEdgeHiddenBox)) :
            new LayoutPositionOtherSubDocumentCreator(documentLayout, subDocument, logPosition, pageIndex, detailsLevel)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(closerToTheRightEdgeHiddenBox)));
    }
    updateRowInfo() {
        var rows = this.result.column.rows;
        const rowIndex = SearchUtils.normedInterpolationIndexOf(rows, (r) => r.columnOffset, this.position);
        const row = rows[rowIndex];
        [this.result.row, this.result.rowIndex] = LayoutPositionCreator.conflictResolver(this.position, this.endRowConflictFlags, rows, row, rowIndex, (obj) => obj.columnOffset, (obj) => obj.getEndPosition());
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Row) {
            this.position = Math.max(0, this.position - this.result.row.columnOffset);
            this.updateBoxInfo();
        }
    }
    updateBoxInfo() {
        const boxes = this.result.row.boxes;
        const boxIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(boxes, (b) => b.rowOffset, this.position));
        const box = boxes[boxIndex];
        [this.result.box, this.result.boxIndex] = LayoutPositionCreator.conflictResolver(this.position, this.middleRowConflictFlags, boxes, box, boxIndex, (obj) => obj.rowOffset, (obj) => obj.getEndPosition());
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Box) {
            this.position = Math.max(0, this.position - this.result.box.rowOffset);
            const boxLength = this.result.box.getLength();
            this.result.charOffset = this.position < boxLength ? this.position : boxLength;
        }
    }
    static conflictResolver(position, conflictFlags, objects, object, objectIndex, getObjectStartPos, getObjectEndPos) {
        const prevObject = objects[objectIndex - 1];
        const objectStartPos = getObjectStartPos(object);
        if (prevObject && objectStartPos == position) {
            const prevObjectEndPos = getObjectEndPos(prevObject);
            if (objectStartPos == prevObjectEndPos)
                return conflictFlags.simple ? [prevObject, objectIndex - 1] : [object, objectIndex];
            else
                return conflictFlags.right ? [prevObject, objectIndex - 1] : [object, objectIndex];
        }
        const nextObject = objects[objectIndex + 1];
        if (nextObject) {
            const objectEndPos = getObjectEndPos(object);
            if (position >= objectEndPos) {
                const nextObjectStartPos = getObjectStartPos(nextObject);
                if (objectEndPos == nextObjectStartPos)
                    return conflictFlags.simple ? [object, objectIndex] : [nextObject, objectIndex + 1];
                if (position == objectEndPos)
                    return conflictFlags.left ? [object, objectIndex] : [nextObject, objectIndex + 1];
                return conflictFlags.middle ? [object, objectIndex] : [nextObject, objectIndex + 1];
            }
        }
        return [object, objectIndex];
    }
}
export class LayoutPositionMainSubDocumentCreator extends LayoutPositionCreator {
    constructor(documentLayout, subDocument, logPosition, detailsLevel, isUseMoreHardAlgorithm = false) {
        super(documentLayout, subDocument, logPosition, detailsLevel);
        this.isUseMoreHardAlgorithm = isUseMoreHardAlgorithm;
        if (!this.subDocument.isMain())
            throw new Error("LayoutPositionMainSubDocumentCreator need set here main sub document");
    }
    create(endRowConflictFlags, middleRowConflictFlags) {
        super.create(endRowConflictFlags, middleRowConflictFlags);
        if (this.layout.pages.length)
            this.updatePageInfo();
        else
            this.result = null;
        return this.result;
    }
    static ensureLayoutPosition(formatterController, subDocument, logPosition, detailsLevel, endRowConflictFlags, middleRowConflictFlags) {
        const documentLayout = formatterController.layout;
        while (true) {
            var layoutPosition = new LayoutPositionMainSubDocumentCreator(documentLayout, subDocument, logPosition, detailsLevel)
                .create(endRowConflictFlags, middleRowConflictFlags);
            if (layoutPosition)
                break;
            if (!formatterController.forceFormatPage(documentLayout.validPageCount))
                break;
        }
        return layoutPosition;
    }
    updatePageInfoInterval(validPageCount, pages, foundPage) {
        if (foundPage.index == 0 && this.position <= foundPage.getPosition())
            return validPageCount > 0 ? foundPage : null;
        const firstPageInGroupIndex = Math.max(0, LayoutPage.getFirstPageInGroup(pages, foundPage.index).index - 1);
        const lastPageInGroup = LayoutPage.getLastValidPageInGroup(pages, foundPage.index, validPageCount, !this.isUseMoreHardAlgorithm, true);
        if (!lastPageInGroup)
            return null;
        const endPageIndex = Math.min(validPageCount, lastPageInGroup.index + 2);
        const intervalsList = [];
        for (let pageIndex = Math.max(0, firstPageInGroupIndex - 1); pageIndex < endPageIndex; pageIndex++) {
            const page = pages[pageIndex];
            page.calculateContentIntervals(this.layout.anchorObjectsPositionInfo, this.isUseMoreHardAlgorithm);
            for (let interval of page.getContentIntervals()) {
                if (interval.containsWithoutIntervalEndAndStart(this.position))
                    return page;
                intervalsList.push(new PageIndexAndInterval(page.index, interval));
            }
        }
        if (intervalsList.length == 0)
            return null;
        intervalsList.sort((a, b) => a.interval.start - b.interval.start);
        if (Log.isDebug)
            ListUtils.forEach(intervalsList, (a, ind) => {
                ListUtils.forEach(intervalsList, (b) => {
                    if (IntervalAlgorithms.getIntersectionNonNullLength(a.interval, b.interval))
                        throw new Error("Detected page intervals intersection. It's very bad. " +
                            ListUtils.map(intervalsList, (curr) => LogObjToStr.fixedInterval(curr.interval)).join(", "));
                }, ind + 1);
            });
        let currInfo = intervalsList[0];
        let nextInfo;
        for (let nextInfoIndex = 1; nextInfo = intervalsList[nextInfoIndex]; nextInfoIndex++) {
            if (FixedInterval.fromPositions(currInfo.interval.end, nextInfo.interval.start).containsWithIntervalEnd(this.position))
                break;
            currInfo = nextInfo;
        }
        const firstPageIndex = currInfo.pageIndex;
        const secondPageIndex = nextInfo ? nextInfo.pageIndex : firstPageIndex + 1;
        if (firstPageIndex == secondPageIndex)
            return pages[firstPageIndex];
        if (secondPageIndex >= validPageCount) {
            if (this.layout.isFullyFormatted)
                return pages[firstPageIndex];
            else
                return this.endRowConflictFlags.allIsTrue() &&
                    ListUtils.unsafeAnyOf(pages[firstPageIndex].getContentIntervals(), (interval) => interval.containsWithIntervalEnd(this.position)) ? pages[firstPageIndex] : null;
        }
        if (!nextInfo)
            return this.layout.isFullyFormatted ? pages[firstPageIndex] : null;
        return this.getPageResolvedFlag(currInfo.interval.end, nextInfo.interval.start) ? pages[firstPageIndex] : pages[secondPageIndex];
    }
    getPageResolvedFlag(posA, posB) {
        return posA == posB ? this.endRowConflictFlags.simple :
            (posA == this.position ? this.endRowConflictFlags.left :
                (posB == this.position ? this.endRowConflictFlags.right :
                    this.endRowConflictFlags.middle));
    }
    updatePageInfo() {
        var validPageCount = this.layout.validPageCount;
        var pages = this.layout.pages;
        var foundPageIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(pages, (p) => p.getPosition(), this.position, 0, validPageCount - 1));
        var foundPage = pages[foundPageIndex];
        if (foundPage)
            this.result.page = this.updatePageInfoInterval(validPageCount, pages, foundPage);
        if (!this.result.page) {
            this.result = null;
            return;
        }
        this.result.pageIndex = this.result.page.index;
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Page) {
            this.position = Math.max(0, this.position - this.result.page.getPosition());
            this.updatePageAreaInfo();
        }
    }
    updatePageAreaInfo() {
        var areas = this.result.page.mainSubDocumentPageAreas;
        if (areas.length > 1) {
            const pageAreaIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(areas, (a) => a.pageOffset, this.position));
            const pageArea = areas[pageAreaIndex];
            [this.result.pageArea, this.result.pageAreaIndex] = LayoutPositionCreator.conflictResolver(this.position, this.endRowConflictFlags, areas, pageArea, pageAreaIndex, (obj) => obj.pageOffset, (obj) => obj.getEndPosition());
        }
        else {
            this.result.pageAreaIndex = 0;
            this.result.pageArea = areas[0];
        }
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.PageArea) {
            this.position = Math.max(0, this.position - this.result.pageArea.pageOffset);
            this.updateColumnInfo();
        }
    }
    updateColumnInfo() {
        var columns = this.result.pageArea.columns;
        if (columns.length > 1) {
            const columnIndex = SearchUtils.normedInterpolationIndexOf(columns, (c) => c.pageAreaOffset, this.position);
            const column = columns[columnIndex];
            [this.result.column, this.result.columnIndex] = LayoutPositionCreator.conflictResolver(this.position, this.endRowConflictFlags, columns, column, columnIndex, (obj) => obj.pageAreaOffset, (obj) => obj.getEndPosition());
        }
        else {
            this.result.columnIndex = 0;
            this.result.column = columns[0];
        }
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Column) {
            this.position = Math.max(0, this.position - this.result.column.pageAreaOffset);
            this.updateRowInfo();
        }
    }
}
export class LayoutPositionOtherSubDocumentCreator extends LayoutPositionCreator {
    constructor(documentLayout, subDocument, logPosition, pageIndex, detailsLevel) {
        super(documentLayout, subDocument, logPosition, detailsLevel);
        if (this.subDocument.isMain())
            throw new Error("LayoutPositionMainSubDocumentCreator need set here not main sub document");
        this.result.page = this.layout.pages[pageIndex];
        this.result.pageIndex = pageIndex;
    }
    create(endRowConflictFlags, middleRowConflictFlags) {
        super.create(endRowConflictFlags, middleRowConflictFlags);
        if (!this.result.page) {
            this.result = null;
            return null;
        }
        this.result.pageArea = this.result.page.otherPageAreas[this.subDocument.id];
        if (!this.result.pageArea) {
            this.result = null;
        }
        else {
            this.result.pageAreaIndex = 0;
            this.position = Math.max(0, this.position - this.result.pageArea.pageOffset);
            this.result.column = this.result.pageArea.columns[0];
            this.result.columnIndex = 0;
            this.position = Math.max(0, this.position - this.result.column.pageAreaOffset);
            this.updateRowInfo();
        }
        return this.result;
    }
}
