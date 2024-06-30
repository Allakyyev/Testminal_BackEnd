import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { AnchoredObjectLevelType } from '../../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
import { ParagraphLineSpacingType } from '../../../model/paragraph/paragraph-properties';
import { LineSpacingCalculator } from '../utils/line-spacing-calculator';
import { RowHeightState } from './row-height-state';
export class RowHeightCalculator {
    constructor(rowFormatter, rowSpacingBeforeApplier) {
        this.rowFormatter = rowFormatter;
        this.rowSpacingBeforeApplier = rowSpacingBeforeApplier;
        this.lineSpacingCalculator = LineSpacingCalculator.create(this.rowFormatter.paragraphProps.lineSpacing, this.rowFormatter.paragraphProps.lineSpacingType);
        this.currState = new RowHeightState(0, 0, 0, 0);
        this.currState.height = 0;
        this.currState.baseLine = 0;
        this.currState.spacingBefore = 0;
        this.applyState(this.getState(this.rowFormatter.currBox));
    }
    get row() {
        return this.rowFormatter.row;
    }
    getState(box) {
        let info;
        switch (box.getType()) {
            case LayoutBoxType.Text:
            case LayoutBoxType.FieldCodeStart:
            case LayoutBoxType.FieldCodeEnd:
            case LayoutBoxType.Dash: {
                info = new RowHeightState(Math.max(box.height, this.currState.maxBoxHeight), Math.max(box.getAscent(), this.currState.maxAscent), Math.max(box.getDescent(), this.currState.maxDescent), this.currState.maxPictureBoxHeight);
                break;
            }
            case LayoutBoxType.Picture: {
                info = new RowHeightState(Math.max(box.height, this.currState.maxBoxHeight), this.currState.maxAscent, this.currState.maxDescent, Math.max(box.height, this.currState.maxPictureBoxHeight));
                break;
            }
            default:
                return this.currState;
        }
        return this.calcNewState(info);
    }
    calcNewState(newInfo) {
        if (this.currState.equalHeights(newInfo) || newInfo.maxBoxHeight == 0)
            return this.currState;
        this.calcRowParams(newInfo.maxBoxHeight, newInfo.maxAscent, newInfo.maxDescent, newInfo.maxPictureBoxHeight);
        newInfo.initFromRow(this.row);
        return newInfo;
    }
    applyState(state) {
        this.currState = state;
    }
    T584234() {
        const row = this.row;
        if (row.boxes.length && row.boxes[0].getType() == LayoutBoxType.Picture &&
            ListUtils.allOf(row.boxes, (b) => RowHeightCalculator.affectedBoxesT584234[b.getType()], 1)) {
            let prevBox = row.boxes[0];
            let applied = false;
            for (let boxIndex = 2, box; box = row.boxes[boxIndex]; boxIndex++) {
                if (box.getType() == LayoutBoxType.Picture &&
                    prevBox.getType() != LayoutBoxType.Picture && RowHeightCalculator.affectedBoxesT584234[prevBox.getType()]) {
                    applied = true;
                    this.applyT584234Height(prevBox);
                }
                prevBox = box;
            }
            if (!applied) {
                ListUtils.reverseForEach(row.boxes, (b) => {
                    if (b.getType() != LayoutBoxType.Picture) {
                        this.applyT584234Height(b);
                    }
                });
            }
        }
    }
    applyT584234Height(b) {
        const info = new RowHeightState(Math.max(b.height, this.currState.maxBoxHeight), Math.max(b.getAscent(), this.currState.maxAscent), Math.max(b.getDescent(), this.currState.maxDescent), this.currState.maxPictureBoxHeight);
        this.applyState(this.calcNewState(info));
    }
    setFinalRowParams() {
        const row = this.row;
        if (this.currState.maxBoxHeight != 0) {
            this.T584234();
            this.currState.applyToRow(row);
            return true;
        }
        const lastBox = ListUtils.last(row.boxes);
        if (!lastBox && ListUtils.unsafeAnyOf(this.rowFormatter.result.newAnchoredObjects, (obj) => obj.levelType == AnchoredObjectLevelType.InText))
            return true;
        this.calcRowParams(lastBox.height, lastBox.getAscent(), lastBox.getDescent(), this.currState.maxPictureBoxHeight);
        this.currState.initFromRow(this.row);
        return false;
    }
    calcRowParams(maxBoxHeight, maxAscent, maxDescent, maxPictureBoxHeight) {
        const row = this.row;
        row.rollbackSpacingBefore();
        row.height = this.lineSpacingCalculator.calculate(maxBoxHeight, maxAscent, maxDescent, maxPictureBoxHeight);
        switch (this.rowFormatter.paragraphProps.lineSpacingType) {
            case ParagraphLineSpacingType.AtLeast:
            case ParagraphLineSpacingType.Exactly:
                row.baseLine = Math.max(0, row.height - maxDescent);
                row.lineHeight = row.height;
                break;
            default:
                row.baseLine = Math.max(maxAscent, maxPictureBoxHeight);
                row.lineHeight = Math.max(maxAscent + maxDescent, maxPictureBoxHeight);
        }
        this.rowSpacingBeforeApplier.apply(this.row, this.rowFormatter.result.paragraphIndex);
    }
}
RowHeightCalculator.affectedBoxesT584234 = {
    [LayoutBoxType.LineBreak]: true,
    [LayoutBoxType.ParagraphMark]: true,
    [LayoutBoxType.TabSpace]: true,
    [LayoutBoxType.Space]: true,
    [LayoutBoxType.Picture]: true,
};
