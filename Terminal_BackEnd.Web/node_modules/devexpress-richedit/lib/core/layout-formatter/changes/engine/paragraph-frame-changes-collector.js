import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ParagraphFrame } from '../../../layout/main-structures/layout-column';
import { LayoutRowStateFlags } from '../../../layout/main-structures/layout-row';
import { ColorHelper } from '../../../model/color/color';
import { ParagraphFirstLineIndent } from '../../../model/paragraph/paragraph-properties';
import { LayoutChangeType, ParagraphFrameChange } from '../changes/layout-change-base';
export class ParagraphFrameCollector {
    static collect(colorProvider, newColumn, pageAreaOffset, paragraphs) {
        return ParagraphFrameCollector.collectNewParFrames(colorProvider, paragraphs, newColumn.rows, pageAreaOffset + newColumn.pageAreaOffset);
    }
    static collectNewParFrames(colorProvider, paragraphs, rows, columnPos) {
        const parFrames = [];
        const firstRowStartPos = columnPos + rows[0].columnOffset;
        let parIndex = SearchUtils.normedInterpolationIndexOf(paragraphs, (p) => p.startLogPosition.value, firstRowStartPos);
        let paragraph = paragraphs[parIndex];
        let parInterval = paragraph.interval;
        let prevParIndex = parIndex - 1;
        let parProps = paragraphs[parIndex].getParagraphMergedProperties();
        let parFrame;
        let prevParColor;
        for (let rowIndex = 0, prevRow, row; row = rows[rowIndex]; rowIndex++) {
            const rowPos = columnPos + row.columnOffset;
            while (true) {
                if (parInterval.contains(rowPos)) {
                    if (parIndex != prevParIndex || parProps.firstLineIndentType != ParagraphFirstLineIndent.None) {
                        parFrame = new ParagraphFrame();
                        parFrames.push(parFrame);
                        parFrame.paragraphColor = parProps.shadingInfo.getActualColor(colorProvider);
                        parFrame.x = row.x;
                        parFrame.width = row.right - UnitConverter.twipsToPixelsF(parProps.rightIndent) - parFrame.x;
                        parFrame.y = row.y;
                        parFrame.height = row.height;
                        if (rowIndex == 0 ||
                            prevRow && prevRow.tableCellInfo && !row.tableCellInfo ||
                            row.tableCellInfo && row.tableCellInfo.layoutRows[0] == row ||
                            (prevParColor == ColorHelper.NO_COLOR || prevParColor == ColorHelper.AUTOMATIC_COLOR)) {
                            parFrame.y += row.getSpacingBefore();
                            parFrame.height -= row.getSpacingBefore();
                        }
                        if (ParagraphFrameCollector.isRemoveSpacingAfter(colorProvider, row, rows[rowIndex + 1], paragraphs, parIndex))
                            parFrame.height -= row.getSpacingAfter();
                        prevParColor = parFrame.paragraphColor;
                    }
                    else {
                        parFrame.height = row.bottom - parFrame.y;
                        if (ParagraphFrameCollector.isRemoveSpacingAfter(colorProvider, row, rows[rowIndex + 1], paragraphs, parIndex))
                            parFrame.height -= row.getSpacingAfter();
                    }
                    prevParIndex = parIndex;
                    break;
                }
                else {
                    parIndex++;
                    paragraph = paragraphs[parIndex];
                    parInterval = paragraph.interval;
                    parProps = paragraph.getParagraphMergedProperties();
                }
            }
            prevRow = row;
        }
        return ParagraphFrameCollector.mergeParagraphFrames(parFrames);
    }
    static isRemoveSpacingAfter(colorProvider, row, nextRow, paragraphs, parIndex) {
        let nextParColor;
        return (!nextRow ||
            row.flags.get(LayoutRowStateFlags.ParagraphEnd) && (!row.tableCellInfo && nextRow.tableCellInfo ||
                row.tableCellInfo && ListUtils.last(row.tableCellInfo.layoutRows) == row ||
                ((nextParColor = paragraphs[parIndex + 1].getParagraphMergedProperties().shadingInfo.getActualColor(colorProvider)) == ColorHelper.NO_COLOR ||
                    nextParColor == ColorHelper.AUTOMATIC_COLOR)));
    }
    static mergeParagraphFrames(paragraphFrames) {
        const mergedParFrames = [];
        let currParFrame;
        for (let parFrameIndex = 0, paragraphFrame; paragraphFrame = paragraphFrames[parFrameIndex]; parFrameIndex++) {
            if (paragraphFrame.paragraphColor == ColorHelper.NO_COLOR || paragraphFrame.paragraphColor == ColorHelper.AUTOMATIC_COLOR) {
                currParFrame = null;
                continue;
            }
            if (currParFrame &&
                paragraphFrame.paragraphColor == currParFrame.paragraphColor &&
                paragraphFrame.x == currParFrame.x &&
                paragraphFrame.width == currParFrame.width &&
                Math.abs(paragraphFrame.y - currParFrame.bottom) < 2) {
                currParFrame.height = paragraphFrame.bottom - currParFrame.y;
            }
            else {
                currParFrame = paragraphFrame;
                mergedParFrames.push(currParFrame);
            }
        }
        return mergedParFrames;
    }
}
export class ParagraphFrameChangesCollector {
    static collect(oldParFrames, newParFrames) {
        const changes = [];
        for (let frameIndex = 0; frameIndex < newParFrames.length; frameIndex++) {
            const newParFrame = newParFrames[frameIndex];
            const oldParFrame = oldParFrames[frameIndex];
            if (!oldParFrame)
                changes.push(new ParagraphFrameChange(frameIndex, LayoutChangeType.Inserted));
            else {
                if (!newParFrame.equals(oldParFrame))
                    changes.push(new ParagraphFrameChange(frameIndex, LayoutChangeType.Replaced));
            }
        }
        for (let frameIndex = newParFrames.length; frameIndex < oldParFrames.length; frameIndex++)
            changes.push(new ParagraphFrameChange(newParFrames.length, LayoutChangeType.Deleted));
        return changes;
    }
}
