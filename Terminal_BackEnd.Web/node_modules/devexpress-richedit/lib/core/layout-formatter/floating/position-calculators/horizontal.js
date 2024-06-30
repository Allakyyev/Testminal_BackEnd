import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType } from '../../../model/floating-objects/enums';
import { AnchorObjectPositionCalculatorBase } from './base-calculator';
export class AnchorObjectHorizontalPositionCalculator extends AnchorObjectPositionCalculatorBase {
    calculate(obj) {
        this.init(obj);
        this.obj.x = this.getX();
        this.correctInTextAnchorPosition();
    }
    get leftCellMargin() { return this.manager.activeFormatter.tableFormatter.actualFormatter.tableInfo.currCellInfo.marginLeft; }
    get rightCellMargin() { return this.manager.activeFormatter.tableFormatter.actualFormatter.tableInfo.currCellInfo.marginRight; }
    getX() {
        if (this.anchorInfo.isUsedHorizontalAlignment())
            return this.alignment(this.anchorInfo.horizontalPositionType, this.anchorInfo.horizontalPositionAlignment);
        if (this.anchorInfo.isUsedHorizontalAbsolutePosition())
            return UnitConverter.twipsToPixelsF(this.anchorInfo.offset.x) + this.absolute();
        if (this.anchorInfo.isUsedHorizontalBookLayout())
            return this.bookLayout();
        if (this.anchorInfo.isUsedHorizontalRelativePosition())
            return this.relative();
        throw new Error(Errors.InternalException);
    }
    relativeColumnPos() {
        return this.lp.pageArea.x + this.lp.column.x;
    }
    correctInTextAnchorPosition() {
        if (!this.isRelativeCell || !this.obj.isInText())
            return;
        const leftBounds = this.relativeColumnPos() + this.lp.row.tableCellInfo.x;
        this.obj.x = Math.max(this.obj.x, leftBounds);
        const rightBound = this.relativeColumnPos() + this.lp.row.tableCellInfo.right;
        const leftOffset = this.obj.right - rightBound;
        if (leftOffset > 0) {
            const avalLeftOffset = this.obj.x - leftBounds;
            this.obj.x -= Math.min(leftOffset, avalLeftOffset);
        }
    }
    alignment(type, alignment) {
        switch (type) {
            case AnchorObjectHorizontalPositionType.Character:
                return this.getAlignPosition(alignment, 0);
            case AnchorObjectHorizontalPositionType.Column:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x +
                        this.getAlignPosition(alignment, this.lp.row.tableCellInfo.width - this.leftCellMargin - this.rightCellMargin) :
                    this.relativeColumnPos() + this.getAlignPosition(alignment, this.lp.column.width);
            case AnchorObjectHorizontalPositionType.Page:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.getAlignPosition(alignment, this.lp.row.tableCellInfo.width) :
                    this.getAlignPosition(alignment, this.manager.boundsCalculator.pageWidth);
            case AnchorObjectHorizontalPositionType.Margin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.leftCellMargin +
                        this.getAlignPosition(alignment, this.lp.row.tableCellInfo.width - this.leftCellMargin - this.rightCellMargin) :
                    this.manager.boundsCalculator.marginLeft + this.getAlignPosition(alignment, this.lp.pageArea.width);
            case AnchorObjectHorizontalPositionType.LeftMargin:
            case AnchorObjectHorizontalPositionType.InsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.getAlignPosition(alignment, this.leftCellMargin) :
                    this.getAlignPosition(alignment, this.manager.boundsCalculator.marginLeft);
            case AnchorObjectHorizontalPositionType.RightMargin:
            case AnchorObjectHorizontalPositionType.OutsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.right - this.rightCellMargin +
                        this.getAlignPosition(AnchorObjectHorizontalPositionAlignment.Right, this.rightCellMargin) :
                    this.manager.boundsCalculator.pageWidth - this.manager.boundsCalculator.marginRight +
                        this.getAlignPosition(alignment, this.manager.boundsCalculator.marginRight);
            default:
                throw new Error(Errors.InternalException);
        }
    }
    getAlignPosition(alignment, width) {
        switch (alignment) {
            case AnchorObjectHorizontalPositionAlignment.Left:
                return 0;
            case AnchorObjectHorizontalPositionAlignment.Center:
                return width / 2 - this.obj.width / 2;
            case AnchorObjectHorizontalPositionAlignment.Right:
                return width - this.obj.width;
            default:
                throw new Error(Errors.InternalException);
        }
    }
    absolute() {
        switch (this.anchorInfo.horizontalPositionType) {
            case AnchorObjectHorizontalPositionType.Page:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.x : 0;
            case AnchorObjectHorizontalPositionType.Column:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.leftCellMargin : this.relativeColumnPos();
            case AnchorObjectHorizontalPositionType.Character: {
                const rowAbsPos = this.lp.getLogPosition(DocumentLayoutDetailsLevel.Row);
                const ancBoxAbsPos = this.obj.rowOffset;
                const boxIndex = SearchUtils.normedInterpolationIndexOf(this.lp.row.boxes, (box) => rowAbsPos + box.rowOffset, ancBoxAbsPos);
                const box = this.lp.row.boxes[boxIndex];
                if (!box)
                    return this.lp.getLayoutX(null, DocumentLayoutDetailsLevel.Row);
                const symbolCount = Math.max(0, ancBoxAbsPos - rowAbsPos - box.rowOffset);
                return this.lp.getLayoutX(null, DocumentLayoutDetailsLevel.Row) + box.x +
                    box.getCharOffsetXInPixels(this.manager.measurer, symbolCount);
            }
            case AnchorObjectHorizontalPositionType.Margin:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.leftCellMargin :
                    this.manager.boundsCalculator.marginLeft;
            case AnchorObjectHorizontalPositionType.LeftMargin:
            case AnchorObjectHorizontalPositionType.OutsideMargin:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.leftCellMargin :
                    0;
            case AnchorObjectHorizontalPositionType.RightMargin:
            case AnchorObjectHorizontalPositionType.InsideMargin:
                return this.isRelativeCell ? this.relativeColumnPos() +
                    this.lp.row.tableCellInfo.right - this.rightCellMargin :
                    this.manager.boundsCalculator.pageWidth - this.manager.boundsCalculator.marginRight;
            default:
                throw new Error(Errors.InternalException);
        }
    }
    bookLayout() {
        return this.alignment(this.anchorInfo.horizontalPositionType, AnchorObjectHorizontalPositionCalculator.mapBookLayoutALignmentType[this.anchorInfo.horizontalPositionAlignment]);
    }
    relative() {
        const type = this.anchorInfo.horizontalPositionType;
        switch (type) {
            case AnchorObjectHorizontalPositionType.Page:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.anchorInfo.getRelativeOffsetX(this.lp.row.tableCellInfo.width) :
                    this.anchorInfo.getRelativeOffsetX(this.manager.boundsCalculator.pageWidth);
            case AnchorObjectHorizontalPositionType.Margin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.leftCellMargin +
                        this.anchorInfo.getRelativeOffsetX(this.lp.row.tableCellInfo.width - this.leftCellMargin - this.rightCellMargin) :
                    this.manager.boundsCalculator.marginLeft +
                        this.anchorInfo.getRelativeOffsetX(this.manager.boundsCalculator.pageWidth - this.manager.boundsCalculator.marginLeft - this.manager.boundsCalculator.marginRight);
            case AnchorObjectHorizontalPositionType.LeftMargin:
            case AnchorObjectHorizontalPositionType.InsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.x + this.anchorInfo.getRelativeOffsetX(this.leftCellMargin) :
                    this.anchorInfo.getRelativeOffsetX(this.manager.boundsCalculator.marginLeft);
            case AnchorObjectHorizontalPositionType.RightMargin:
            case AnchorObjectHorizontalPositionType.OutsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.right - this.rightCellMargin +
                        this.anchorInfo.getRelativeOffsetX(this.rightCellMargin) :
                    this.manager.boundsCalculator.pageWidth - this.manager.boundsCalculator.marginRight +
                        this.anchorInfo.getRelativeOffsetX(this.manager.boundsCalculator.marginRight);
            default: throw new Error(Errors.InternalException);
        }
    }
}
AnchorObjectHorizontalPositionCalculator.mapBookLayoutALignmentType = {
    [AnchorObjectHorizontalPositionAlignment.Inside]: AnchorObjectHorizontalPositionAlignment.Left,
    [AnchorObjectHorizontalPositionAlignment.Outside]: AnchorObjectHorizontalPositionAlignment.Right,
};
