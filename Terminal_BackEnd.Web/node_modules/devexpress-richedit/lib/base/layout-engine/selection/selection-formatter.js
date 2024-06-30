import { EventDispatcher } from '../../../base-utils/event-dispatcher';
import { MapCreator } from '../../../base-utils/map-creator';
import { LayoutBoxIteratorMainSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { LayoutChangeType } from '../../../core/layout-formatter/changes/changes/layout-change-base';
import { LayoutPageSelectionChange } from '../../../core/layout-formatter/changes/changes/selection/layout-page-selection-change';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { LayoutRangePermissionItem, LayoutSelectionCursorItem, LayoutSelectionFloatingObjectItem, LayoutSelectionItem, LayoutSelectionMisspelledItem, LayoutSelectionSearchItem } from '../../../core/layout/selection/layout-selection-items';
import { TableCellBoundFlags } from '../../../core/layout/table/layout-table-cell-info';
import { ModelChangeType } from '../../../core/model/changes/enums';
import { CharacterFormattingScript } from '../../../core/model/character/enums';
import { Table } from '../../../core/model/tables/main-structures/table';
import { Log } from '../../../core/rich-utils/debug/logger/base-logger/log';
import { LogObjToStr } from '../../../core/rich-utils/debug/logger/base-logger/log-obj-to-str';
import { LogSource } from '../../../core/rich-utils/debug/logger/base-logger/log-source';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
export var SimpleSelectionLayoutType;
(function (SimpleSelectionLayoutType) {
    SimpleSelectionLayoutType[SimpleSelectionLayoutType["Search"] = 0] = "Search";
    SimpleSelectionLayoutType[SimpleSelectionLayoutType["Misspelled"] = 1] = "Misspelled";
    SimpleSelectionLayoutType[SimpleSelectionLayoutType["RangePermission"] = 2] = "RangePermission";
})(SimpleSelectionLayoutType || (SimpleSelectionLayoutType = {}));
export class SelectionFormatter extends BatchUpdatableObject {
    constructor(selection, measurer, layoutSelection, documentProtectionSettings) {
        super();
        this.onSelectionLayoutChanged = new EventDispatcher();
        this.selection = selection;
        this.measurer = measurer;
        this.layoutSelection = layoutSelection;
        this.documentProtectionSettings = documentProtectionSettings;
    }
    get highlightRanges() { return this.documentProtectionSettings.highlightRanges; }
    modelChanged(change) {
        if (change.type == ModelChangeType.RangePermissionsPropertiesChanged)
            this.onRangePermissionPropertiesChanged();
    }
    onRangePermissionPropertiesChanged() {
        for (let pageInfo of this.layoutSelection.rangePermissionInfo.pageInfos)
            pageInfo.beforeRecreatePageSelection();
        if (this.highlightRanges) {
            ListUtils.forEach(this.selection.layout.pages, (page) => {
                this.buildRangePermissionSelection(this.selection.model.mainSubDocument, page.index);
                NumberMapUtils.forEach(page.otherPageAreas, (pa) => this.buildRangePermissionSelection(pa.subDocument, this.selection.pageIndex));
            });
        }
        else
            this.layoutSelection.rangePermissionInfo.changes = [];
        if (!this.isUpdateLocked())
            this.raiseRangePermissionLayoutChanged();
    }
    NotifySelectionChanged(_selection) {
        Log.print(LogSource.SelectionFormatter, "NotifySelectionChanged", () => `intervals: ${ListUtils.map(this.selection.intervals, (currI) => LogObjToStr.fixedInterval(currI)).join(" ")}, subDocId: ${this.selection.activeSubDocument.id}`);
        this.updateSubDocumentInfo();
        this.selectionChanged();
    }
    NotifySearchSelectionChanged() {
        Log.print(LogSource.SelectionFormatter, "NotifySearchSelectionChanged", "");
        this.layoutSelection.searchInfo.changes = [];
        for (let pageInfo of this.layoutSelection.searchInfo.pageInfos)
            pageInfo.beforeRecreatePageSelection();
        const subDocument = this.selection.activeSubDocument;
        this.createSimpleLayout(subDocument, this.intersectModelIntervalsWithValidPageIntervals(subDocument, this.selection.searchIntervals, this.layoutSelection.pageIndex), this.layoutSelection.searchInfo, SimpleSelectionLayoutType.Search);
        if (!this.isUpdateLocked())
            this.raiseSearchSelectionLayoutChanged();
    }
    NotifyMisspelledSelectionChanged() {
        Log.print(LogSource.SelectionFormatter, "NotifyMisspelledSelectionChanged", "");
        this.layoutSelection.misspelledInfo.changes = [];
        for (let pageInfo of this.layoutSelection.misspelledInfo.pageInfos)
            pageInfo.beforeRecreatePageSelection();
        const subDocument = this.selection.activeSubDocument;
        this.createSimpleLayout(subDocument, this.intersectModelIntervalsWithValidPageIntervals(subDocument, this.selection.misspelledIntervals, this.layoutSelection.pageIndex), this.layoutSelection.misspelledInfo, SimpleSelectionLayoutType.Misspelled);
        if (!this.isUpdateLocked())
            this.raiseMisspelledSelectionLayoutChanged();
    }
    NotifyPagesReady(pageChanges) {
        Log.print(LogSource.SelectionFormatter, "NotifyPagesReady", "");
        for (let pageChange of pageChanges) {
            if (pageChange.changeType == LayoutChangeType.Deleted) {
                this.layoutSelection.selectionInfo.pageInfos.splice(pageChange.index, 1);
                this.layoutSelection.selectionInfo.changes.push(new LayoutPageSelectionChange(pageChange.index, LayoutChangeType.Deleted, []));
                if (this.highlightRanges) {
                    this.layoutSelection.rangePermissionInfo.pageInfos.splice(pageChange.index, 1);
                    this.layoutSelection.rangePermissionInfo.changes.push(new LayoutPageSelectionChange(pageChange.index, LayoutChangeType.Deleted, []));
                }
            }
            else {
                this.buildPageSelection(pageChange.index);
                if (this.highlightRanges) {
                    const pageInfo = this.layoutSelection.rangePermissionInfo.pageInfos[pageChange.index];
                    if (pageInfo)
                        pageInfo.beforeRecreatePageSelection();
                    this.buildRangePermissionSelection(this.selection.model.mainSubDocument, pageChange.index);
                    NumberMapUtils.forEach(this.selection.layout.pages[pageChange.index].otherPageAreas, (pa) => this.buildRangePermissionSelection(pa.subDocument, pageChange.index));
                }
            }
        }
        if (!this.isUpdateLocked()) {
            this.raiseSelectionLayoutChanged();
            if (this.highlightRanges)
                this.raiseRangePermissionLayoutChanged();
            else
                this.layoutSelection.rangePermissionInfo.reset();
        }
    }
    NotifyFullyFormatted(_pageCount) { }
    ;
    onUpdateUnlocked(_occurredEvents) {
        this.updateSubDocumentInfo();
        Log.print(LogSource.SelectionFormatter, "onUpdateUnlocked", "");
        this.raiseSelectionLayoutChanged();
        this.raiseSearchSelectionLayoutChanged();
        this.raiseMisspelledSelectionLayoutChanged();
        if (this.highlightRanges)
            this.raiseRangePermissionLayoutChanged();
        else if (this.layoutSelection.rangePermissionInfo)
            this.layoutSelection.rangePermissionInfo.reset();
    }
    selectionChanged() {
        this.layoutSelection.selectionInfo.changes = [];
        for (let pageInfo of this.layoutSelection.selectionInfo.pageInfos)
            pageInfo.beforeRecreatePageSelection();
        this.buildContiniousSelection();
        if (!this.isUpdateLocked())
            this.raiseSelectionLayoutChanged();
    }
    updateSubDocumentInfo() {
        const needUpdate = this.layoutSelection.pageIndex != this.selection.pageIndex ||
            this.layoutSelection.subDocumentInfo != this.selection.activeSubDocument.info;
        if (needUpdate) {
            this.layoutSelection.pageIndex = this.selection.pageIndex;
            this.layoutSelection.subDocumentInfo = this.selection.activeSubDocument.info;
            this.selectionChanged();
        }
    }
    buildContiniousSelection() {
        if (this.selection.isCollapsed())
            this.createCollapsedSelectionLayout(-1);
        else {
            const layout = this.selection.layout;
            const selIntervals = this.selection.intervals;
            const subDoc = this.selection.activeSubDocument;
            let validLayoutInterval;
            if (subDoc.isMain())
                validLayoutInterval = IntervalAlgorithms.getMergedIntervals(ListUtils.accumulate(layout.pages, [], (acc, page) => ListUtils.addListOnTail(acc, page.getContentIntervals()), 0, layout.validPageCount), true);
            else {
                if (this.selection.pageIndex < layout.validPageCount) {
                    const pageArea = layout.pages[this.selection.pageIndex].otherPageAreas[subDoc.id];
                    validLayoutInterval = pageArea ? [new FixedInterval(0, subDoc.getDocumentEndPosition())] : [];
                }
                else
                    validLayoutInterval = [];
            }
            for (let interval of IntervalAlgorithms.getIntersectionsTwoArraysOfInterval(validLayoutInterval, selIntervals))
                this.createExtendedSelectionLayout(interval, this.layoutSelection.selectionInfo, selIntervals);
        }
    }
    buildPageSelection(pageIndex) {
        const selection = this.selection;
        const pageInfo = this.layoutSelection.selectionInfo.pageInfos[pageIndex];
        if (pageInfo)
            pageInfo.beforeRecreatePageSelection();
        if (selection.isCollapsed()) {
            this.layoutSelection.selectionInfo.changes = [];
            this.createCollapsedSelectionLayout(pageIndex);
        }
        else {
            const page = selection.layout.pages[pageIndex];
            const subDocument = selection.activeSubDocument;
            let intersPageIntervalsAndSelectionIntervals = [];
            if (subDocument.isMain())
                intersPageIntervalsAndSelectionIntervals =
                    IntervalAlgorithms.getIntersectionsTwoArraysOfInterval(selection.intervals, page.getContentIntervals());
            else if (page.otherPageAreas[subDocument.id] && pageIndex == selection.pageIndex)
                intersPageIntervalsAndSelectionIntervals = selection.intervals;
            for (let interval of intersPageIntervalsAndSelectionIntervals)
                if (interval.length > 0)
                    this.createExtendedSelectionLayout(interval, this.layoutSelection.selectionInfo, selection.intervals);
        }
    }
    buildRangePermissionSelection(subDocument, pageIndex) {
        const selection = this.selection;
        const page = selection.layout.pages[pageIndex];
        const rpIntervals = ListUtils.map(subDocument.availableRangePermissions, (rp) => rp.interval);
        const intersPageIntervalsAndSelectionIntervals = subDocument.isMain() ?
            IntervalAlgorithms.getIntersectionsTwoArraysOfInterval(rpIntervals, page.getContentIntervals()) :
            rpIntervals;
        this.createSimpleLayout(subDocument, SelectionFormatter.translateInteralsToIterators(this.selection.layout, subDocument, pageIndex, intersPageIntervalsAndSelectionIntervals), this.layoutSelection.rangePermissionInfo, SimpleSelectionLayoutType.RangePermission);
    }
    createCollapsedSelectionLayout(dontCreateSelectionIfNotThisPageIndex) {
        const selection = this.selection;
        const selectionPosition = selection.intervals[0].start;
        const layout = selection.layout;
        const subDocument = selection.activeSubDocument;
        const cursorPos = subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(layout, subDocument, selectionPosition, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false))
            : new LayoutPositionOtherSubDocumentCreator(layout, subDocument, selectionPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!cursorPos || dontCreateSelectionIfNotThisPageIndex >= 0 && cursorPos.pageIndex != dontCreateSelectionIfNotThisPageIndex ||
            !cursorPos.page.isValid)
            return;
        let stepBackward = true;
        while (EnumUtils.isAnyOf(cursorPos.box.getType(), LayoutBoxType.AnchorPicture, LayoutBoxType.AnchorTextBox)) {
            if (stepBackward) {
                if (!cursorPos.advanceToPrevBoxInRow())
                    stepBackward = false;
            }
            else {
                if (!cursorPos.advanceToNextBoxInRow())
                    break;
            }
        }
        const cellInfo = cursorPos.row.tableCellInfo;
        if (cellInfo && cellInfo.boundFlags.get(TableCellBoundFlags.EndOnThisColumn)) {
            const rowInfo = cellInfo.parentRow;
            const tableGrid = rowInfo.parentTable.logicInfo.grid;
            const cellGridInfo = tableGrid.tableCellGridInfos[rowInfo.rowIndex][cellInfo.cellGridIndex];
            const cell = tableGrid.table.rows[cellGridInfo.getStartRowIndex()].cells[cellGridInfo.getCellIndex(0)];
            if (selectionPosition == cell.endParagrapPosition.value - 1) {
                for (let prevNestedTableColumnInfo of cursorPos.column.tablesInfo) {
                    if (prevNestedTableColumnInfo.logicInfo.grid.table.getEndPosition() == selectionPosition) {
                        const lastBorder = ListUtils.last(prevNestedTableColumnInfo.verticalBorders);
                        const prevLayoutRow = cursorPos.column.rows[cursorPos.rowIndex - 1];
                        const parMarkBoxHeight = cursorPos.row.boxes[0].height;
                        const floatingObjectId = SelectionFormatter.getFloatingObjId(subDocument, cursorPos.page);
                        const selectionCursor = new LayoutSelectionCursorItem();
                        selectionCursor.setPosition(new Point(cursorPos.pageArea.x + cursorPos.column.x + prevNestedTableColumnInfo.x + lastBorder.xPos + Math.max(1, lastBorder.borderInfo.width) + 1, cursorPos.pageArea.y + cursorPos.column.y + prevLayoutRow.bottom - parMarkBoxHeight));
                        selectionCursor.setSize(new Size(1, parMarkBoxHeight));
                        selectionCursor.floatingObjectId = floatingObjectId;
                        this.layoutSelection.selectionInfo.registerItem(cursorPos.pageIndex, selectionCursor);
                        return;
                    }
                }
            }
        }
        SelectionFormatter.setPositionOnVisibleBox(cursorPos);
        if (cursorPos.row.height == 0 || cursorPos.row.width == 0)
            return;
        const floatingObjectId = SelectionFormatter.getFloatingObjId(subDocument, cursorPos.page);
        const selectionCursor = LayoutSelectionItem.create(cursorPos, new Size(1, cursorPos.box.height), floatingObjectId, LayoutSelectionCursorItem);
        selectionCursor.x += cursorPos.box.x + (cursorPos.box.isVisible() ? cursorPos.box.getCharOffsetXInPixels(this.measurer, cursorPos.charOffset) : 0);
        selectionCursor.y += cursorPos.row.getSpacingBefore() + cursorPos.row.baseLine - cursorPos.box.getAscent() - cursorPos.row.getSpacingBefore();
        if (cursorPos.box.characterProperties.script === CharacterFormattingScript.Subscript) {
            const multiplier = cursorPos.box.characterProperties.fontInfo.scriptMultiplier;
            selectionCursor.y += UnitConverter.pointsToPixelsF(cursorPos.box.characterProperties.fontSize) *
                (cursorPos.box.characterProperties.fontInfo.subScriptOffset * multiplier - multiplier + 1);
        }
        this.layoutSelection.selectionInfo.registerItem(cursorPos.pageIndex, selectionCursor);
    }
    createExtendedSelectionLayout(interval, layoutSelectionInfo, allIntervals) {
        const layout = this.selection.layout;
        if (layout.pages.length == 0)
            return;
        const activeSubDocument = this.selection.activeSubDocument;
        const isMainSubDoc = activeSubDocument.isMain();
        const page = isMainSubDoc ? layout.getLastValidPage() : layout.pages[this.layoutSelection.pageIndex];
        if (!page)
            return;
        if (this.selection.specialRunInfo.isPictureSelected() || (this.selection.specialRunInfo.isTextBoxSelected() && !activeSubDocument.isTextBox()))
            return;
        const startPos = interval.start;
        const endPos = Math.min(interval.end, isMainSubDoc ? page.getEndPosition() : page.otherPageAreas[activeSubDocument.id].getEndPosition());
        const iterator = isMainSubDoc ?
            new LayoutBoxIteratorMainSubDocument(activeSubDocument, layout, startPos, endPos) :
            new LayoutBoxIteratorOtherSubDocument(activeSubDocument, layout, startPos, endPos, this.layoutSelection.pageIndex);
        if (!iterator.isInitialized())
            throw new Error(Errors.InternalException);
        let currentLayoutRow = null;
        let currSelectionItem = null;
        const selectedCellsCollector = new SelectedCellsCollector();
        let currPageIndex = -1;
        for (let isFirstBox = true; iterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(!isFirstBox), new LayoutPositionCreatorConflictFlags().setDefault(true)); isFirstBox = false) {
            if (currPageIndex < iterator.position.pageIndex) {
                currPageIndex = iterator.position.pageIndex;
                NumberMapUtils.forEach(iterator.position.page.anchoredObjectHolder.objects, (obj) => {
                    const pos = layout.anchorObjectsPositionInfo.getPosition(obj.objectId);
                    if (obj.belongsToSubDocId == this.layoutSelection.subDocumentInfo.subDocumentId &&
                        interval.containsInterval(new FixedInterval(pos, 1))) {
                        const ancObjSelItem = new LayoutSelectionFloatingObjectItem();
                        ancObjSelItem.copyFrom(obj.getOuterBounds(false));
                        layoutSelectionInfo.registerItem(currPageIndex, ancObjSelItem);
                    }
                });
            }
            const currPosition = iterator.position;
            const row = currPosition.row;
            if (row.tableCellInfo) {
                const cell = Table.getTableCellByPosition(activeSubDocument.tables, currPosition.getLogPosition(DocumentLayoutDetailsLevel.Box));
                if (SelectionFormatter.isCellFullySelected(cell, allIntervals)) {
                    if (selectedCellsCollector.isNeedAddCellToSelection(cell, row.tableCellInfo)) {
                        currentLayoutRow = row;
                        const selectionBound = row.tableCellInfo.createRectangle();
                        selectionBound.x += currPosition.pageArea.x + currPosition.column.x;
                        selectionBound.y += currPosition.pageArea.y + currPosition.column.y;
                        currSelectionItem = new LayoutSelectionItem();
                        currSelectionItem.floatingObjectId = SelectionFormatter.getFloatingObjId(activeSubDocument, currPosition.page);
                        currSelectionItem.copyFrom(selectionBound);
                        layoutSelectionInfo.registerItem(currPosition.pageIndex, currSelectionItem);
                    }
                    continue;
                }
            }
            const rightCharOffset = Math.min(endPos - currPosition.getLogPosition(DocumentLayoutDetailsLevel.Box), currPosition.box.getLength());
            const currentBoxLeftOffsetX = currPosition.box.getCharOffsetXInPixels(this.measurer, currPosition.charOffset);
            const currentBoxRightOffsetX = currPosition.box.getCharOffsetXInPixels(this.measurer, rightCharOffset);
            const absRowOffsetX = currPosition.pageArea.x + currPosition.column.x + currPosition.row.x;
            const absBoxOffsetX = currPosition.box.x + currentBoxLeftOffsetX + absRowOffsetX;
            const thereIsGap = !!currSelectionItem && !MathUtils.numberCloseTo(absBoxOffsetX, currSelectionItem.x + currSelectionItem.width);
            const isNeedCreateNewSelectionRow = row !== currentLayoutRow || thereIsGap;
            if (isNeedCreateNewSelectionRow) {
                currentLayoutRow = row;
                const floatingObjectId = SelectionFormatter.getFloatingObjId(activeSubDocument, currPosition.page);
                currSelectionItem = LayoutSelectionItem.create(currPosition, new Size(0, row.height), floatingObjectId, LayoutSelectionItem);
                currSelectionItem.x += currPosition.box.x + currentBoxLeftOffsetX;
                layoutSelectionInfo.registerItem(currPosition.pageIndex, currSelectionItem);
            }
            currSelectionItem.width += currentBoxRightOffsetX - currentBoxLeftOffsetX;
        }
    }
    static isCellFullySelected(cell, allIntervals) {
        if (!cell)
            return false;
        for (let interval of allIntervals)
            if (cell.startParagraphPosition.value >= interval.start && cell.endParagrapPosition.value <= interval.end)
                return true;
        return false;
    }
    static translateInteralsToIterators(layout, subDocument, pageIndex, finalIntervals) {
        const makeIter = subDocument.isMain() ?
            (interval) => new LayoutBoxIteratorMainSubDocument(subDocument, layout, interval.start, interval.end) :
            (interval) => new LayoutBoxIteratorOtherSubDocument(subDocument, layout, interval.start, interval.end, pageIndex);
        return ListUtils.reducedMap(finalIntervals, (interval) => {
            if (interval.length > 0) {
                const iter = makeIter(interval);
                return iter.isInitialized() ? iter : null;
            }
            return null;
        });
    }
    intersectModelIntervalsWithValidPageIntervals(subDocument, modelIntervals, pageIndex) {
        const layout = this.selection.layout;
        if (layout.pages.length == 0)
            return [];
        if (subDocument.isMain()) {
            const pageIntervals = ListUtils.accumulate(layout.pages, [], (acc, page) => ListUtils.addListOnTail(acc, page.getContentIntervals()), 0, layout.validPageCount);
            const mergedIntervals = IntervalAlgorithms.getMergedIntervals(pageIntervals, true);
            const finalIntervals = IntervalAlgorithms.getIntersectionsTwoArraysOfInterval(modelIntervals, mergedIntervals);
            return SelectionFormatter.translateInteralsToIterators(this.selection.layout, subDocument, pageIndex, finalIntervals);
        }
        else {
            const page = layout.pages[pageIndex];
            if (!page || !page.otherPageAreas[subDocument.id])
                return [];
            return SelectionFormatter.translateInteralsToIterators(this.selection.layout, subDocument, pageIndex, modelIntervals);
        }
    }
    createSimpleLayout(subDocument, iterators, layoutSelectionInfo, type) {
        for (let iterator of iterators) {
            let currentLayoutRow = null;
            let currSelectionItem = null;
            let color = this.documentProtectionSettings.rangeHighlightColor;
            if (type == SimpleSelectionLayoutType.RangePermission) {
                const currentInterval = new FixedInterval(iterator.intervalStart, iterator.intervalEnd - iterator.intervalStart);
                const intersections = ListUtils.filter(subDocument.availableRangePermissions, (perm) => IntervalAlgorithms.getIntersection(perm.interval, currentInterval) != null);
                if (intersections.length)
                    color = ListUtils.last(intersections).getRangePermissionColor(subDocument.documentModel, this.documentProtectionSettings);
            }
            for (let isFirstBox = true; iterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(!isFirstBox), new LayoutPositionCreatorConflictFlags().setDefault(true)); isFirstBox = false) {
                const currPosition = iterator.position;
                const row = currPosition.row;
                const rightCharOffset = Math.min(iterator.intervalEnd - currPosition.getLogPosition(DocumentLayoutDetailsLevel.Box), currPosition.box.getLength());
                const currentBoxLeftOffsetX = currPosition.box.getCharOffsetXInPixels(this.measurer, currPosition.charOffset);
                const currentBoxRightOffsetX = currPosition.box.getCharOffsetXInPixels(this.measurer, rightCharOffset);
                const absRowOffsetX = currPosition.pageArea.x + currPosition.column.x + currPosition.row.x;
                const absBoxOffsetX = currPosition.box.x + currentBoxLeftOffsetX + absRowOffsetX;
                const thereIsGap = !!currSelectionItem && !MathUtils.numberCloseTo(absBoxOffsetX, currSelectionItem.x + currSelectionItem.width);
                const isNeedCreateNewSelectionRow = row !== currentLayoutRow || thereIsGap;
                if (isNeedCreateNewSelectionRow) {
                    currentLayoutRow = row;
                    const height = type == SimpleSelectionLayoutType.Misspelled ?
                        row.baseLine :
                        row.height - row.getSpacingAfter() - row.getSpacingBefore();
                    const yOffset = type == SimpleSelectionLayoutType.Misspelled ?
                        0 :
                        row.getSpacingBefore();
                    const floatingObjectId = SelectionFormatter.getFloatingObjId(subDocument, currPosition.page);
                    currSelectionItem = LayoutSelectionItem.create(currPosition, new Size(0, height), floatingObjectId, SelectionFormatter.itemConstructorsMap[type]);
                    if (type == SimpleSelectionLayoutType.RangePermission)
                        currSelectionItem.color = color;
                    currSelectionItem.x += currPosition.box.x + currentBoxLeftOffsetX;
                    currSelectionItem.y += yOffset;
                    layoutSelectionInfo.registerItem(currPosition.pageIndex, currSelectionItem);
                }
                currSelectionItem.width += currentBoxRightOffsetX - currentBoxLeftOffsetX;
            }
        }
    }
    raiseSelectionLayoutChanged() {
        this.layoutSelection.selectionInfo.collectPageChanges(this.selection.layout);
        this.layoutSelection.updatePageIndexWithSelection();
        this.onSelectionLayoutChanged.listeners.forEach(listener => listener.NotifySelectionLayoutChanged());
    }
    raiseSearchSelectionLayoutChanged() {
        this.layoutSelection.searchInfo.collectPageChanges(this.selection.layout);
        this.onSelectionLayoutChanged.listeners.forEach(listener => listener.NotifySearchSelectionLayoutChanged());
    }
    raiseMisspelledSelectionLayoutChanged() {
        this.layoutSelection.misspelledInfo.collectPageChanges(this.selection.layout);
        this.onSelectionLayoutChanged.listeners.forEach(listener => listener.NotifyMisspelledSelectionLayoutChanged());
    }
    raiseRangePermissionLayoutChanged() {
        this.layoutSelection.rangePermissionInfo.collectPageChanges(this.selection.layout);
        this.onSelectionLayoutChanged.listeners.forEach(listener => listener.NotifyRangePermissionLayoutChanged());
    }
    static setPositionOnVisibleBox(cursorPos) {
        if (cursorPos.charOffset != 0)
            return;
        for (let boxIndex = cursorPos.boxIndex - 1; boxIndex >= 0; boxIndex--) {
            if (cursorPos.row.boxes[boxIndex].isVisible()) {
                cursorPos.boxIndex = boxIndex;
                cursorPos.box = cursorPos.row.boxes[cursorPos.boxIndex];
                cursorPos.charOffset = cursorPos.box.getLength();
                return;
            }
        }
    }
    static getFloatingObjId(subDocument, page) {
        if (subDocument.isMain())
            return LayoutSelectionItem.mainPageAreaSelection;
        else if (subDocument.isHeaderFooter())
            return LayoutSelectionItem.headerFooterPageAreaSelection;
        else
            return page.anchoredObjectHolder.getTextBoxByInternalSubDocId(subDocument.id).objectId;
    }
}
SelectionFormatter.itemConstructorsMap = new MapCreator()
    .add(SimpleSelectionLayoutType.Misspelled, LayoutSelectionMisspelledItem)
    .add(SimpleSelectionLayoutType.RangePermission, LayoutRangePermissionItem)
    .add(SimpleSelectionLayoutType.Search, LayoutSelectionSearchItem)
    .get();
class SelectedCellsCollector {
    constructor() {
        this.fullySelectedCells = {};
    }
    isNeedAddCellToSelection(cell, cellInfo) {
        const key = cell.endParagrapPosition.value;
        const cellInfos = this.fullySelectedCells[key];
        if (cellInfos === undefined) {
            this.fullySelectedCells[key] = [cellInfo];
            return true;
        }
        for (let info of cellInfos)
            if (info === cellInfo)
                return false;
        cellInfos.push(cellInfo);
        return true;
    }
}
