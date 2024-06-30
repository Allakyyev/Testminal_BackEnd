import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../model/floating-objects/enums';
import { AnchorObjectPositionCalculatorBase } from './base-calculator';
export class AnchorObjectVerticalPositionCalculator extends AnchorObjectPositionCalculatorBase {
    calculate(obj) {
        this.init(obj);
        this.obj.y = this.getY();
        this.correctInTextAnchorPosition();
    }
    get topCellMargin() {
        return this.manager.activeFormatter.tableFormatter.actualFormatter.tableInfo.currRowInfo.topAndBottomMargins.topMargin;
    }
    getY() {
        if (this.anchorInfo.isUsedVerticalAbsolutePosition())
            return UnitConverter.twipsToPixelsF(this.anchorInfo.offset.y) + this.absolute();
        if (this.anchorInfo.isUsedVerticalAlignment())
            return this.alignment();
        if (this.anchorInfo.isUsedVerticalRelativePosition())
            return this.relative();
        throw new Error(Errors.InternalException);
    }
    relativeColumnPos() {
        return this.lp.pageArea.y + this.lp.column.y;
    }
    correctInTextAnchorPosition() {
        if (!this.isRelativeCell || !this.obj.isInText())
            return;
        const topBounds = this.relativeColumnPos() + this.lp.row.tableCellInfo.y;
        this.obj.y = Math.max(this.obj.y, topBounds);
    }
    getRowWhatStartParagraphY() {
        const paragraphStartPosition = this.lp.pageArea.subDocument
            .paragraphs[this.manager.activeFormatter.rowFormatter.result.paragraphIndex].startLogPosition.value;
        const rows = this.lp.column.rows;
        const parRelativeColumnOffset = paragraphStartPosition - this.lp.getLogPosition(DocumentLayoutDetailsLevel.Column);
        const rowInd = this.lp.rowIndex;
        let rowWhatStartParagraph = rowInd >= rows.length ? this.lp.row : rows[rowInd];
        for (let row, rowIndex = rowInd - 1; (row = rows[rowIndex]) &&
            row.columnOffset >= parRelativeColumnOffset; rowIndex--)
            rowWhatStartParagraph = row;
        const relativeY = rowWhatStartParagraph.initialY - this.manager.activeFormatter.layoutPosition.getOffsetRelativeColumn().y;
        return Math.min(relativeY, rowWhatStartParagraph.y);
    }
    absolute() {
        switch (this.anchorInfo.verticalPositionType) {
            case AnchorObjectVerticalPositionType.Page:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin : 0;
            case AnchorObjectVerticalPositionType.Paragraph:
                return this.relativeColumnPos() + this.getRowWhatStartParagraphY();
            case AnchorObjectVerticalPositionType.Line:
                return this.relativeColumnPos() + this.lp.row.y;
            case AnchorObjectVerticalPositionType.Margin:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.marginTop;
            case AnchorObjectVerticalPositionType.TopMargin:
            case AnchorObjectVerticalPositionType.InsideMargin:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin : 0;
            case AnchorObjectVerticalPositionType.BottomMargin:
            case AnchorObjectVerticalPositionType.OutsideMargin:
                return this.isRelativeCell ? this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.pageHeight - this.manager.boundsCalculator.marginBottom;
            default:
                throw new Error(Errors.InternalException);
        }
    }
    alignment() {
        switch (this.anchorInfo.verticalPositionType) {
            case AnchorObjectVerticalPositionType.Page:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.getAlignPosition(this.manager.boundsCalculator.pageHeight);
            case AnchorObjectVerticalPositionType.Line:
                return this.lp.getLayoutY(DocumentLayoutDetailsLevel.Column) + this.lp.row.y +
                    this.getAlignPosition(this.lp.row.height);
            case AnchorObjectVerticalPositionType.Paragraph:
                return this.relativeColumnPos() + this.getRowWhatStartParagraphY();
            case AnchorObjectVerticalPositionType.Margin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.marginTop +
                        this.getAlignPosition(this.manager.boundsCalculator.pageHeight - this.manager.boundsCalculator.marginTop -
                            this.manager.boundsCalculator.marginBottom);
            case AnchorObjectVerticalPositionType.TopMargin:
            case AnchorObjectVerticalPositionType.InsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.getAlignPosition(this.manager.boundsCalculator.marginTop);
            case AnchorObjectVerticalPositionType.BottomMargin:
            case AnchorObjectVerticalPositionType.OutsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.pageHeight - this.manager.boundsCalculator.marginBottom +
                        this.getAlignPosition(this.manager.boundsCalculator.marginBottom);
            default:
                throw new Error(Errors.InternalException);
        }
    }
    getAlignPosition(height) {
        const alignment = this.anchorInfo.verticalPositionAlignment;
        switch (alignment) {
            case AnchorObjectVerticalPositionAlignment.Top:
            case AnchorObjectVerticalPositionAlignment.Inside:
                return 0;
            case AnchorObjectVerticalPositionAlignment.Center:
                return height / 2 - this.obj.height / 2;
            case AnchorObjectVerticalPositionAlignment.Bottom:
            case AnchorObjectVerticalPositionAlignment.Outside:
                return height - this.obj.height;
            default:
                throw new Error(Errors.InternalException);
        }
    }
    relative() {
        switch (this.anchorInfo.verticalPositionType) {
            case AnchorObjectVerticalPositionType.Page:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.anchorInfo.getRelativeOffsetY(this.manager.boundsCalculator.pageHeight);
            case AnchorObjectVerticalPositionType.Margin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.marginTop +
                        this.anchorInfo.getRelativeOffsetY(this.manager.boundsCalculator.pageHeight - this.manager.boundsCalculator.marginTop - this.manager.boundsCalculator.marginBottom);
            case AnchorObjectVerticalPositionType.TopMargin:
            case AnchorObjectVerticalPositionType.InsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.anchorInfo.getRelativeOffsetY(this.manager.boundsCalculator.marginTop);
            case AnchorObjectVerticalPositionType.BottomMargin:
            case AnchorObjectVerticalPositionType.OutsideMargin:
                return this.isRelativeCell ?
                    this.relativeColumnPos() + this.lp.row.tableCellInfo.y + this.topCellMargin :
                    this.manager.boundsCalculator.pageHeight - this.manager.boundsCalculator.marginBottom +
                        this.anchorInfo.getRelativeOffsetY(this.manager.boundsCalculator.marginBottom);
            default:
                throw new Error(Errors.InternalException);
        }
    }
}
