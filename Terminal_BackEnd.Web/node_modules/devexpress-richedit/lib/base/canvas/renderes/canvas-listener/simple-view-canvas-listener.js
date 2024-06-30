import { LayoutChangeType } from '../../../../core/layout-formatter/changes/changes/layout-change-base';
import { LayoutBoxType } from '../../../../core/layout/main-structures/layout-boxes/layout-box';
import { ViewType } from '../../../../core/view-settings/views-settings';
import { Errors } from '@devexpress/utils/lib/errors';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CanvasListener } from './canvas-listener';
export class SimpleViewChangesDataBase {
    constructor(rows, tables, parFrames) {
        this.rows = rows;
        this.tables = tables;
        this.parFrames = parFrames;
    }
}
export class SimpleViewChangesData extends SimpleViewChangesDataBase {
    constructor(rows, tables, parFrames, ancPictureObjs, ancTextBoxObjs) {
        super(rows, tables, parFrames);
        this.ancPictureObjs = ancPictureObjs;
        this.ancTextBoxObjs = ancTextBoxObjs;
    }
}
export class VisibleCanvasObjectsInfo extends SimpleViewChangesData {
}
export class RenderedCanvasObjectsInfo extends SimpleViewChangesData {
}
export class SimpleViewCanvasListener extends CanvasListener {
    onPagesReady(pageChanges) {
        if (pageChanges.length > 1 && !ListUtils.allOf(pageChanges, (c) => c.changeType == LayoutChangeType.Deleted, 1))
            throw new Error(Errors.InternalException);
        if (this.layout.pages.length > 1)
            throw new Error(Errors.InternalException);
        const pageChange = pageChanges[0];
        if (pageChange) {
            const layoutPage = this.layout.pages[0];
            switch (pageChange.changeType) {
                case LayoutChangeType.Inserted: {
                    if (!this.viewManager.sizes.isInitialized()) {
                        this.renderer.renderPage(layoutPage, 0, false);
                        this.viewManager.adjust(false);
                    }
                    this.renderer.pageInserted(layoutPage, this.getCurrentIndexes());
                    break;
                }
                case LayoutChangeType.Replaced: {
                    this.renderer.removePageContent(0);
                    this.renderer.renderPage(layoutPage, 0, false);
                    this.viewManager.adjust(false);
                    this.renderer.pageInserted(layoutPage, this.getCurrentIndexes());
                    break;
                }
                case LayoutChangeType.Updated: {
                    CanvasListener.mergeInnerPageChanges(pageChange);
                    this.renderer.pageUpdated(pageChange, this.getCurrentIndexes());
                    break;
                }
                case LayoutChangeType.Deleted: {
                    this.renderer.removePage(0);
                    break;
                }
            }
        }
        this.viewManager.lastUsedRendererType = ViewType.Simple;
    }
    getCurrentIndexes() {
        const layoutPage = this.layout.pages[0];
        const visibleInterval = this.viewManager.scroll.getVisibleInterval();
        const column = layoutPage.mainSubDocumentPageAreas[0].columns[0];
        const layoutRows = column.rows;
        const rI = this.determineVisibleObjectsForRows(layoutRows, visibleInterval);
        const tI = this.determineVisibleObjectsForTables(column.tablesInfo, visibleInterval);
        const pfI = this.determineVisibleObjects(column.paragraphFrames, visibleInterval);
        const ancPic = NumberMapUtils.reducedMap(layoutPage.anchoredObjectHolder.objects, (fo, _id) => fo.getType() == LayoutBoxType.AnchorPicture && IntervalAlgorithms.getIntersectionNonNullLength(fo.createVerticalInterval(), visibleInterval) ? fo : null);
        const ancTB = NumberMapUtils.reducedMap(layoutPage.anchoredObjectHolder.objects, (fo, _id) => fo.getType() == LayoutBoxType.AnchorTextBox && IntervalAlgorithms.getIntersectionNonNullLength(fo.createVerticalInterval(), visibleInterval) ? fo : null);
        return new VisibleCanvasObjectsInfo(rI, tI, pfI, ancPic, ancTB);
    }
    determineVisibleObjects(objects, visibleInterval) {
        if (!objects.length)
            return new BoundaryInterval(-1, -1);
        const startIndex = Math.max(0, ListUtils.reverseIndexBy(objects, (obj) => !IntervalAlgorithms.getIntersection(obj.createVerticalInterval(), visibleInterval), SearchUtils.normedInterpolationIndexOf(objects, (obj) => obj.y, visibleInterval.start) - 1));
        let minEndIndex = Math.max(startIndex, SearchUtils.normedInterpolationIndexOf(objects, (obj) => obj.y, visibleInterval.end));
        for (let obj; obj = objects[minEndIndex]; minEndIndex++) {
            if (!IntervalAlgorithms.getIntersection(obj.createVerticalInterval(), visibleInterval)) {
                minEndIndex++;
                break;
            }
        }
        return new BoundaryInterval(startIndex, minEndIndex);
    }
    determineVisibleObjectsForTables(objects, visibleInterval) {
        if (!objects.length)
            return new BoundaryInterval(-1, -1);
        let startIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(objects, (obj) => obj.y, visibleInterval.start));
        for (let obj; obj = objects[startIndex]; startIndex--) {
            if (!obj.logicInfo.grid.table.nestedLevel && !IntervalAlgorithms.getIntersection(obj.createVerticalInterval(), visibleInterval))
                break;
        }
        startIndex = Math.max(0, startIndex);
        const minEndIndex = this.findBoundaryMinIndex(startIndex, objects, visibleInterval);
        return new BoundaryInterval(startIndex, minEndIndex);
    }
    findBoundaryMinIndex(startIndex, objects, visibleInterval) {
        let minEndIndex = Math.max(startIndex, SearchUtils.normedInterpolationIndexOf(objects, (obj) => obj.y, visibleInterval.end));
        for (let obj; obj = objects[minEndIndex]; minEndIndex++) {
            if (!IntervalAlgorithms.getIntersection(obj.createVerticalInterval(), visibleInterval)) {
                minEndIndex++;
                break;
            }
        }
        return minEndIndex;
    }
    determineVisibleObjectsForRows(rows, visibleInterval) {
        if (!rows.length)
            return new BoundaryInterval(-1, -1);
        const startIndex = Math.max(0, ListUtils.reverseIndexBy(rows, (obj) => obj.bottom < visibleInterval.start && !obj.tableCellInfo, SearchUtils.normedInterpolationIndexOf(rows, (obj) => obj.y, visibleInterval.start) - 1));
        let endIndex = Math.max(startIndex, SearchUtils.normedInterpolationIndexOf(rows, (obj) => obj.y, visibleInterval.end));
        for (let row; row = rows[endIndex]; endIndex++) {
            if (row.y > visibleInterval.end && !row.tableCellInfo) {
                endIndex++;
                break;
            }
        }
        return new BoundaryInterval(startIndex, endIndex);
    }
    updateVisibleParts() {
        if (this.layout.pages.length)
            this.renderer.pageScrolled(this.layout.pages[0], this.getCurrentIndexes());
    }
    onCanvasScroll() {
        this.updateVisibleParts();
    }
}
