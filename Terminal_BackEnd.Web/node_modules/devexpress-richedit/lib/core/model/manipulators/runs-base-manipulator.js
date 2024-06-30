import { Size } from '@devexpress/utils/lib/geometry/size';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { AnchorInfo } from '../floating-objects/anchor-info';
import { RelativeHeightType, RelativeWidthType } from '../floating-objects/enums';
import { AnchorTextBoxSize, InlineTextBoxSize } from '../floating-objects/sizes';
import { TextBoxProperties } from '../floating-objects/text-box-properties';
import { AnchoredPictureRun } from '../runs/anchored-picture-run';
import { AnchoredTextBoxRun } from '../runs/anchored-text-box-run';
import { InlinePictureRun } from '../runs/inline-picture-run';
import { InlineTextBoxRun } from '../runs/inline-text-box-run';
import { RunType } from '../runs/run-type';
import { EndNoteRun, FieldCodeEndRun, FieldCodeStartRun, FieldResultEndRun, FootNoteRun, LayoutDependentRun, NoteContinuationSeparatorRun, NoteSeparatorRun, ParagraphRun, SectionRun } from '../runs/simple-runs';
import { TextRun } from '../runs/text-run';
import { Shape } from '../shapes/shape';
import { BaseManipulator } from './base-manipulator';
import { AnchorPictureInfo, InlinePictureInfo } from './picture-manipulator/insert-picture-manipulator-params';
export class RunsBaseManipulator extends BaseManipulator {
    insertRunInternal(subDocPos, charPropsBundle, type, text) {
        const subDocument = subDocPos.subDocument;
        let insertPositionAtStartDocument = subDocPos.position;
        const lastCharacterIndex = subDocument.getDocumentEndPosition();
        if (insertPositionAtStartDocument >= lastCharacterIndex)
            insertPositionAtStartDocument--;
        const chunkIndex = SearchUtils.normedInterpolationIndexOf(subDocument.chunks, (c) => c.startLogPosition.value, insertPositionAtStartDocument);
        const chunk = subDocument.chunks[chunkIndex];
        const startOffsetAtChunk = insertPositionAtStartDocument - chunk.startLogPosition.value;
        let currentRunIndex = SearchUtils.normedInterpolationIndexOf(chunk.textRuns, (r) => r.startOffset, startOffsetAtChunk);
        let currentRun = chunk.textRuns[currentRunIndex];
        const sectionIndex = SearchUtils.normedInterpolationIndexOf(subDocument.documentModel.sections, (s) => s.startLogPosition.value, insertPositionAtStartDocument);
        subDocument.documentModel.sections[sectionIndex].setLength(subDocument, subDocument.documentModel.sections[sectionIndex].getLength() + text.length);
        chunk.textBuffer = [chunk.textBuffer.substr(0, startOffsetAtChunk), text, chunk.textBuffer.substr(startOffsetAtChunk)].join('');
        if (startOffsetAtChunk != currentRun.startOffset) {
            if (type == RunType.TextRun && currentRun.getType() == RunType.TextRun && currentRun.characterStyle.equalsByName(charPropsBundle.style) &&
                currentRun.maskedCharacterProperties.equals(charPropsBundle.props)) {
                currentRun.incLength(text.length);
                RunsBaseManipulator.moveRunsInChunk(chunk, currentRunIndex + 1, text.length);
                subDocument.positionManager.advance(insertPositionAtStartDocument, text.length, 1);
                return { chunkIndex: chunkIndex, runIndex: currentRunIndex };
            }
            chunk.splitRun(currentRunIndex, startOffsetAtChunk - currentRun.startOffset);
            currentRunIndex++;
            currentRun = chunk.textRuns[currentRunIndex];
        }
        subDocument.positionManager.advance(insertPositionAtStartDocument, text.length, 1);
        let newTextRun;
        const prevRun = chunk.textRuns[currentRunIndex - 1];
        if (prevRun && type == RunType.TextRun && prevRun.getType() == RunType.TextRun && prevRun.characterStyle.equalsByName(charPropsBundle.style) &&
            prevRun.maskedCharacterProperties.equals(charPropsBundle.props)) {
            prevRun.incLength(text.length);
            RunsBaseManipulator.moveRunsInChunk(chunk, currentRunIndex, text.length);
            return { chunkIndex: chunkIndex, runIndex: currentRunIndex - 1 };
        }
        else {
            if (type == RunType.TextRun && currentRun.getType() == RunType.TextRun && currentRun.characterStyle.equalsByName(charPropsBundle.style) &&
                currentRun.maskedCharacterProperties.equals(charPropsBundle.props)) {
                currentRun.incLength(text.length);
                RunsBaseManipulator.moveRunsInChunk(chunk, currentRunIndex + 1, text.length);
                return { chunkIndex: chunkIndex, runIndex: currentRunIndex };
            }
            else {
                newTextRun = RunTemplateCreatorHelper.createRun[type](startOffsetAtChunk, text.length, currentRun.paragraph, charPropsBundle);
                chunk.textRuns.splice(currentRunIndex, 0, newTextRun);
                RunsBaseManipulator.moveRunsInChunk(chunk, currentRunIndex + 1, text.length);
                return { chunkIndex: chunkIndex, runIndex: currentRunIndex };
            }
        }
    }
    static moveRunsInChunk(chunk, startRunIndex, offset) {
        for (let i = startRunIndex, run; run = chunk.textRuns[i]; i++)
            run.startOffset += offset;
    }
}
class RunTemplateCreatorHelper {
}
RunTemplateCreatorHelper.createRun = {
    [RunType.TextRun]: (startOffset, length, paragraph, charPropsBundle) => new TextRun(startOffset, length, paragraph, charPropsBundle),
    [RunType.ParagraphRun]: (startOffset, _length, paragraph, charPropsBundle) => new ParagraphRun(startOffset, paragraph, charPropsBundle),
    [RunType.SectionRun]: (startOffset, _length, paragraph, charPropsBundle) => new SectionRun(startOffset, paragraph, charPropsBundle),
    [RunType.FieldCodeStartRun]: (startOffset, _length, paragraph, charPropsBundle) => new FieldCodeStartRun(startOffset, paragraph, charPropsBundle),
    [RunType.FieldCodeEndRun]: (startOffset, _length, paragraph, charPropsBundle) => new FieldCodeEndRun(startOffset, paragraph, charPropsBundle),
    [RunType.FieldResultEndRun]: (startOffset, _length, paragraph, charPropsBundle) => new FieldResultEndRun(startOffset, paragraph, charPropsBundle),
    [RunType.AnchoredPictureRun]: (startOffset, _length, paragraph, charPropsBundle) => new AnchoredPictureRun(startOffset, paragraph, charPropsBundle, AnchorPictureInfo.defaultInfo(null, new Size(0, 0)), -1),
    [RunType.AnchoredTextBoxRun]: (startOffset, _length, paragraph, charPropsBundle) => new AnchoredTextBoxRun(startOffset, paragraph, charPropsBundle, new Shape(), -1, new AnchorTextBoxSize(true, 0, new Size(0, 0), new Size(0, 0), RelativeWidthType.Page, RelativeHeightType.Page, true, true), new AnchorInfo(), -1, new TextBoxProperties()),
    [RunType.InlinePictureRun]: (startOffset, _length, paragraph, charPropsBundle) => new InlinePictureRun(startOffset, paragraph, charPropsBundle, InlinePictureInfo.defaultInfo(null)),
    [RunType.InlineTextBoxRun]: (startOffset, _length, paragraph, charPropsBundle) => new InlineTextBoxRun(startOffset, paragraph, charPropsBundle, new Shape(), -1, new InlineTextBoxSize(true, 0, new Size(0, 0)), new TextBoxProperties()),
    [RunType.LayoutDependentRun]: (startOffset, _length, paragraph, charPropsBundle) => new LayoutDependentRun(startOffset, paragraph, charPropsBundle),
    [RunType.FootNoteRun]: (startOffset, _length, paragraph, charPropsBundle) => new FootNoteRun(startOffset, paragraph, charPropsBundle),
    [RunType.EndNoteRun]: (startOffset, _length, paragraph, charPropsBundle) => new EndNoteRun(startOffset, paragraph, charPropsBundle),
    [RunType.NoteSeparatorRun]: (startOffset, _length, paragraph, charPropsBundle) => new NoteSeparatorRun(startOffset, paragraph, charPropsBundle),
    [RunType.NoteContinuationSeparatorRun]: (startOffset, _length, paragraph, charPropsBundle) => new NoteContinuationSeparatorRun(startOffset, paragraph, charPropsBundle)
};
