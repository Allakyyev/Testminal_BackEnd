import { Point } from '@devexpress/utils/lib/geometry/point';
import { LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from './document-layout-details-level';
import { LayoutPoint } from './layout-point';
export class LayoutAndModelPositions {
    constructor(layoutPosition, modelPosition) {
        this.layoutPosition = layoutPosition;
        this.modelPosition = modelPosition;
    }
}
export class LayoutRowPosition {
    constructor() {
        this.row = null;
        this.box = null;
        this.boxIndex = -1;
        this.charOffset = -1;
    }
}
export class LayoutPositionBase extends LayoutRowPosition {
    constructor() {
        super(...arguments);
        this.detailsLevel = DocumentLayoutDetailsLevel.None;
        this.rowIndex = -1;
        this.column = null;
        this.columnIndex = -1;
        this.pageArea = null;
        this.pageAreaIndex = -1;
        this.page = null;
        this.pageIndex = -1;
    }
    getRelatedSubDocumentPagePosition() {
        return this.pageArea.subDocument.isMain() ? this.page.getPosition() : 0;
    }
    equals(obj) {
        if (this.detailsLevel != obj.detailsLevel)
            return false;
        switch (this.detailsLevel) {
            case DocumentLayoutDetailsLevel.Character: if (this.charOffset != obj.charOffset)
                return false;
            case DocumentLayoutDetailsLevel.Box: if (this.boxIndex != obj.boxIndex)
                return false;
            case DocumentLayoutDetailsLevel.Row: if (this.rowIndex != obj.rowIndex)
                return false;
            case DocumentLayoutDetailsLevel.Column: if (this.columnIndex != obj.columnIndex)
                return false;
            case DocumentLayoutDetailsLevel.PageArea: if (this.pageAreaIndex != obj.pageAreaIndex || this.pageArea.subDocument.id != obj.pageArea.subDocument.id)
                return false;
            case DocumentLayoutDetailsLevel.Page: if (this.pageIndex != obj.pageIndex)
                return false;
        }
        return true;
    }
    getOffsetRelativeColumn() {
        return new Point(this.pageArea.x + this.column.x, this.pageArea.y + this.column.y);
    }
    stepBackRow() {
        if (this.rowIndex == 0)
            return false;
        this.row = this.column.rows[--this.rowIndex];
        return true;
    }
    stepForwardRow() {
        const newRow = this.column.rows[++this.rowIndex];
        if (newRow) {
            this.row = newRow;
            return true;
        }
        this.rowIndex--;
        return false;
    }
    getPositionRelativePage(measurer) {
        return new LayoutPoint(this.page.index, this.getLayoutX(measurer), this.getLayoutY());
    }
    getLayoutX(measurer, detailsLevel) {
        if (!detailsLevel)
            detailsLevel = this.detailsLevel;
        let xPos = 0;
        switch (detailsLevel) {
            case DocumentLayoutDetailsLevel.Max:
            case DocumentLayoutDetailsLevel.Character: xPos += this.box.getCharOffsetXInPixels(measurer, this.charOffset);
            case DocumentLayoutDetailsLevel.Box: xPos += this.box.x;
            case DocumentLayoutDetailsLevel.Row: xPos += this.row.x;
            case DocumentLayoutDetailsLevel.Column: xPos += this.column.x;
            case DocumentLayoutDetailsLevel.PageArea: xPos += this.pageArea.x;
        }
        return xPos;
    }
    getLayoutY(detailsLevel) {
        if (!detailsLevel)
            detailsLevel = this.detailsLevel;
        let yPos = 0;
        switch (detailsLevel) {
            case DocumentLayoutDetailsLevel.Max:
            case DocumentLayoutDetailsLevel.Character:
            case DocumentLayoutDetailsLevel.Box: yPos += this.row.baseLine - this.box.getAscent() - this.row.getSpacingBefore();
            case DocumentLayoutDetailsLevel.Row: yPos += this.row.y;
            case DocumentLayoutDetailsLevel.Column: yPos += this.column.y;
            case DocumentLayoutDetailsLevel.PageArea: yPos += this.pageArea.y;
        }
        return yPos;
    }
    getPageAreaBySubDocument(subDocument) {
        return subDocument.isMain() ? this.page.mainSubDocumentPageAreas[this.pageAreaIndex] : this.page.otherPageAreas[subDocument.id];
    }
    advanceToPrevRow(layout) {
        this.rowIndex--;
        if (this.rowIndex < 0) {
            if (!this.pageArea.subDocument.isMain()) {
                this.rowIndex = 0;
                return false;
            }
            this.columnIndex--;
            if (this.columnIndex < 0) {
                this.pageAreaIndex--;
                if (this.pageAreaIndex < 0) {
                    this.pageIndex--;
                    if (this.pageIndex < 0) {
                        this.pageIndex = 0;
                        this.pageAreaIndex = 0;
                        this.columnIndex = 0;
                        this.rowIndex = 0;
                        return false;
                    }
                    this.page = layout.pages[this.pageIndex];
                    this.pageAreaIndex = this.page.mainSubDocumentPageAreas.length - 1;
                }
                this.pageArea = this.page.mainSubDocumentPageAreas[this.pageAreaIndex];
                this.columnIndex = this.pageArea.columns.length - 1;
            }
            this.column = this.pageArea.columns[this.columnIndex];
            this.rowIndex = this.column.rows.length - 1;
        }
        this.row = this.column.rows[this.rowIndex];
        return true;
    }
    advanceToNextBoxInRow() {
        if (this.boxIndex + 1 < this.row.boxes.length) {
            this.boxIndex++;
            this.box = this.row.boxes[this.boxIndex];
            this.charOffset = 0;
            return true;
        }
        return false;
    }
    advanceToPrevBoxInRow() {
        if (this.boxIndex > 0) {
            this.boxIndex--;
            this.box = this.row.boxes[this.boxIndex];
            this.charOffset = this.box.getLength() - 1;
            return true;
        }
        return false;
    }
    advanceToNextRow(layout) {
        this.rowIndex++;
        if (this.rowIndex >= this.column.rows.length) {
            if (!this.pageArea.subDocument.isMain()) {
                this.rowIndex--;
                return false;
            }
            this.rowIndex = 0;
            this.columnIndex++;
            if (this.columnIndex >= this.pageArea.columns.length) {
                this.columnIndex = 0;
                this.pageAreaIndex++;
                if (this.pageAreaIndex >= this.page.mainSubDocumentPageAreas.length) {
                    this.pageAreaIndex = 0;
                    this.pageIndex++;
                    if (this.pageIndex >= layout.validPageCount) {
                        this.pageIndex--;
                        this.pageAreaIndex = this.page.mainSubDocumentPageAreas.length - 1;
                        this.columnIndex = this.pageArea.columns.length - 1;
                        this.rowIndex = this.column.rows.length - 1;
                        return false;
                    }
                    this.page = layout.pages[this.pageIndex];
                }
                this.pageArea = this.page.mainSubDocumentPageAreas[this.pageAreaIndex];
            }
            this.column = this.pageArea.columns[this.columnIndex];
        }
        this.row = this.column.rows[this.rowIndex];
        return true;
    }
}
export class LayoutPosition extends LayoutPositionBase {
    constructor(detailsLevel) {
        super();
        this.detailsLevel = detailsLevel;
    }
    static ensure(formatterController, selection, subDocument, logPosition, detailsLevel, endRowConflictFlags, middleRowConflictFlags) {
        const layout = formatterController.layout;
        if (subDocument.isMain())
            return LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(formatterController, subDocument, logPosition, detailsLevel, endRowConflictFlags, middleRowConflictFlags);
        while (true) {
            const lp = new LayoutPositionOtherSubDocumentCreator(layout, subDocument, logPosition, selection.pageIndex, detailsLevel)
                .create(endRowConflictFlags, middleRowConflictFlags);
            if (lp)
                return lp;
            if (!formatterController.forceFormatPage(layout.validPageCount))
                return null;
        }
    }
    getLogPosition(detailsLevel = null) {
        if (!detailsLevel)
            detailsLevel = this.detailsLevel;
        var position = 0;
        switch (detailsLevel) {
            case DocumentLayoutDetailsLevel.Max:
            case DocumentLayoutDetailsLevel.Character: position += this.charOffset;
            case DocumentLayoutDetailsLevel.Box: position += this.box.rowOffset;
            case DocumentLayoutDetailsLevel.Row: position += this.row.columnOffset;
            case DocumentLayoutDetailsLevel.Column: position += this.column.pageAreaOffset;
            case DocumentLayoutDetailsLevel.PageArea: position += this.pageArea.pageOffset;
        }
        if (detailsLevel >= DocumentLayoutDetailsLevel.PageArea && this.pageArea.subDocument.isMain())
            position += this.page.getPosition();
        return position;
    }
    isPositionBoxEnd() {
        return this.charOffset == this.box.getLength();
    }
    isLastBoxInRow() {
        return this.boxIndex == this.row.boxes.length - 1;
    }
    isPositionAfterLastBoxInRow() {
        return this.isLastBoxInRow() && this.isPositionBoxEnd();
    }
    isPositionBeforeFirstBoxInRow() {
        return this.boxIndex == 0 && this.charOffset == 0;
    }
    switchToEndPrevBoxInRow() {
        if (this.charOffset == 0 && this.boxIndex > 0) {
            this.boxIndex--;
            this.box = this.row.boxes[this.boxIndex];
            this.charOffset = this.box.getLength();
            return true;
        }
        return false;
    }
    switchToStartNextBoxInRow() {
        if (this.charOffset == this.box.getLength() && this.boxIndex + 1 < this.row.boxes.length) {
            this.boxIndex++;
            this.box = this.row.boxes[this.boxIndex];
            this.charOffset = 0;
        }
    }
    copyFrom(source) {
        this.detailsLevel = source.detailsLevel;
        this.pageIndex = source.pageIndex;
        this.page = source.page;
        this.pageArea = source.pageArea;
        this.pageAreaIndex = source.pageAreaIndex;
        this.column = source.column;
        this.columnIndex = source.columnIndex;
        this.row = source.row;
        this.rowIndex = source.rowIndex;
        this.box = source.box;
        this.boxIndex = source.boxIndex;
        this.charOffset = source.charOffset;
    }
    clone() {
        var clone = new LayoutPosition(this.detailsLevel);
        clone.copyFrom(this);
        return clone;
    }
    initByIndexes(pageIndex, pageAreaIndex = -1, columnIndex = -1, rowIndex = -1, boxIndex = -1, charOffset = -1) {
        this.pageIndex = pageIndex;
        this.pageAreaIndex = pageAreaIndex;
        this.columnIndex = columnIndex;
        this.rowIndex = rowIndex;
        this.boxIndex = boxIndex;
        this.charOffset = charOffset;
        return this;
    }
    applyObjectsAsMainSubDocument(layout, idOtherSubDoc) {
        this.page = layout.pages[this.pageIndex];
        if (idOtherSubDoc < 0) {
            if (this.pageAreaIndex < 0)
                return this;
            this.pageArea = this.page.mainSubDocumentPageAreas[this.pageAreaIndex];
        }
        else
            this.pageArea = this.page.otherPageAreas[idOtherSubDoc];
        if (this.columnIndex < 0)
            return this;
        this.column = this.pageArea.columns[this.columnIndex];
        if (this.rowIndex < 0)
            return this;
        this.row = this.column.rows[this.rowIndex];
        if (this.boxIndex < 0)
            return this;
        this.box = this.row.boxes[this.boxIndex];
        return this;
    }
    posIsStartPage() {
        return this.rowIndex == 0 && this.columnIndex == 0 && this.pageAreaIndex == 0;
    }
    isFirstRowOnPage() {
        return this.pageAreaIndex == 0 && this.columnIndex == 0 && this.rowIndex == 0;
    }
}
export class LayoutPositionDiscardHelper {
    static onStartCharLevel(lp) {
        lp.charOffset = 0;
    }
    static onStartBoxLevel(lp) {
        lp.boxIndex = 0;
        lp.box = lp.row.boxes[0];
        LayoutPositionDiscardHelper.onStartCharLevel(lp);
    }
    static onStartRowLevel(lp) {
        lp.rowIndex = 0;
        lp.row = lp.column.rows[0];
        LayoutPositionDiscardHelper.onStartBoxLevel(lp);
    }
    static onStartColumnLevel(lp) {
        lp.columnIndex = 0;
        lp.column = lp.pageArea.columns[0];
        LayoutPositionDiscardHelper.onStartRowLevel(lp);
    }
    static onStartPageAreaLevel(lp) {
        lp.pageAreaIndex = 0;
        lp.pageArea = lp.page.mainSubDocumentPageAreas[0];
        LayoutPositionDiscardHelper.onStartColumnLevel(lp);
    }
    static onStartPageLevel(pages, lp) {
        lp.pageIndex = 0;
        lp.page = pages[0];
        LayoutPositionDiscardHelper.onStartPageAreaLevel(lp);
    }
    static onEndCharLevel(lp) {
        lp.charOffset = 0;
    }
    static onEndBoxLevel(lp) {
        lp.boxIndex = lp.row.boxes.length - 1;
        lp.box = lp.row.boxes[lp.boxIndex];
        LayoutPositionDiscardHelper.onEndCharLevel(lp);
    }
    static onEndRowLevel(lp) {
        lp.rowIndex = lp.column.rows.length - 1;
        lp.row = lp.column.rows[lp.rowIndex];
        LayoutPositionDiscardHelper.onEndBoxLevel(lp);
    }
    static onEndColumnLevel(lp) {
        lp.columnIndex = lp.pageArea.columns.length - 1;
        lp.column = lp.pageArea.columns[lp.columnIndex];
        LayoutPositionDiscardHelper.onEndRowLevel(lp);
    }
    static onEndPageAreaLevel(lp) {
        lp.pageAreaIndex = lp.page.mainSubDocumentPageAreas.length - 1;
        lp.pageArea = lp.page.mainSubDocumentPageAreas[lp.pageAreaIndex];
        LayoutPositionDiscardHelper.onEndColumnLevel(lp);
    }
    static onEndPageLevel(layout, lp) {
        lp.pageIndex = layout.pages.length - 1;
        lp.page = layout.pages[lp.pageIndex];
        LayoutPositionDiscardHelper.onEndPageAreaLevel(lp);
    }
}
