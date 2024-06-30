import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
import { ParagraphAlignment } from '../../../model/paragraph/paragraph-properties';
export class BoxAligner {
    static findLastVisibleBoxIndex(boxes, startIndex, endIndex) {
        return ListUtils.reverseIndexBy(boxes, (box) => box.isVisibleForRowAlign(), startIndex, endIndex);
    }
    static align(row, alignment, endXPosition, fromBoxIndex, dontJustifyLinesEndingInSoftLineBreak) {
        switch (alignment) {
            case ParagraphAlignment.Right:
                BoxAligner.alignRightCenter(BoxAligner.getBoxes(row, fromBoxIndex), endXPosition, 1);
                break;
            case ParagraphAlignment.Center:
                BoxAligner.alignRightCenter(BoxAligner.getBoxes(row, fromBoxIndex), endXPosition, 2);
                break;
            case ParagraphAlignment.Justify:
            case ParagraphAlignment.JustifyHigh:
            case ParagraphAlignment.JustifyLow:
            case ParagraphAlignment.JustifyMedium:
            case ParagraphAlignment.Distribute:
            case ParagraphAlignment.ThaiDistribute:
                BoxAligner.alignJustify(BoxAligner.getBoxes(row, fromBoxIndex), endXPosition, dontJustifyLinesEndingInSoftLineBreak);
                break;
            case ParagraphAlignment.Left:
                break;
            default:
                throw new Error(Errors.InternalException);
        }
    }
    static getBoxes(row, fromBoxIndex) {
        if (fromBoxIndex)
            return row.boxes.slice(fromBoxIndex);
        if (!row.numberingListBox)
            return row.boxes;
        const boxes = row.boxes.slice();
        if (row.numberingListBox.separatorBox)
            boxes.unshift(row.numberingListBox.separatorBox);
        boxes.unshift(row.numberingListBox.textBox);
        return boxes;
    }
    static alignRightCenter(boxes, endXPosition, divider) {
        let avaliableWidth = BoxAligner.calculateFreeSpace(boxes, BoxAligner.findLastVisibleBoxIndex(boxes), endXPosition);
        if (divider > 1)
            avaliableWidth = Math.floor(avaliableWidth / divider);
        if (avaliableWidth > 0)
            for (let box of boxes)
                box.x += avaliableWidth;
    }
    static alignJustify(boxes, endXPosition, dontJustifyLinesEndingInSoftLineBreak) {
        switch (ListUtils.last(boxes).getType()) {
            case LayoutBoxType.ParagraphMark:
            case LayoutBoxType.ColumnBreak:
            case LayoutBoxType.PageBreak:
            case LayoutBoxType.SectionMark:
                return;
            case LayoutBoxType.LineBreak:
                if (dontJustifyLinesEndingInSoftLineBreak)
                    return;
        }
        const prevBox = boxes[boxes.length - 2];
        const lastVisibleBoxIndex = BoxAligner.findLastVisibleBoxIndex(boxes);
        if (prevBox && (prevBox.getType() == LayoutBoxType.ParagraphMark || prevBox.getType() == LayoutBoxType.PageBreak) ||
            prevBox && prevBox.getType() == LayoutBoxType.PageBreak ||
            lastVisibleBoxIndex < 0)
            return;
        const firstNonSpaceBoxIndex = BoxAligner.firstNonSpaceBoxIndex(boxes);
        if (firstNonSpaceBoxIndex < 0)
            return;
        let totalSpaceWidth = 0;
        for (let i = firstNonSpaceBoxIndex + 1; i <= lastVisibleBoxIndex; i++) {
            const box = boxes[i];
            const boxType = box.getType();
            if (boxType == LayoutBoxType.Space)
                totalSpaceWidth += box.width;
        }
        const freeSpace = BoxAligner.calculateFreeSpace(boxes, lastVisibleBoxIndex, endXPosition);
        if (totalSpaceWidth == 0 || freeSpace <= 0)
            return;
        let leftX = boxes[firstNonSpaceBoxIndex].right;
        for (let i = firstNonSpaceBoxIndex + 1; i <= lastVisibleBoxIndex; i++) {
            const box = boxes[i];
            box.x = leftX;
            const boxType = box.getType();
            if (boxType == LayoutBoxType.Space)
                box.width += (freeSpace * box.width) / totalSpaceWidth;
            leftX += box.width;
        }
        for (let i = lastVisibleBoxIndex + 1, box; box = boxes[i]; i++) {
            box.x = leftX;
            leftX += box.width;
        }
    }
    static calculateFreeSpace(boxes, lastVisibleBoxIndex, rightBoundsPosition) {
        return rightBoundsPosition - (lastVisibleBoxIndex >= 0 ? boxes[lastVisibleBoxIndex].right : boxes[0].x);
    }
    static firstNonSpaceBoxIndex(boxes) {
        let lastNonSpace = -1;
        for (let i = boxes.length - 1; i >= 0; i--)
            switch (boxes[i].getType()) {
                case LayoutBoxType.TabSpace: return lastNonSpace;
                case LayoutBoxType.Space:
                case LayoutBoxType.NonBreakingSpace:
                    break;
                default: lastNonSpace = i;
            }
        return lastNonSpace;
    }
}
