import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ParagraphInsertedSubDocumentChange } from '../../changes/sub-document/text/paragraph-inserted';
import { InsertParagraphHistoryItem } from '../../history/items/insert-paragraph-history-item';
import { Paragraph } from '../../paragraph/paragraph';
import { RichUtils } from '../../rich-utils';
import { RunType } from '../../runs/run-type';
import { ParagraphRun } from '../../runs/simple-runs';
import { RunsBaseManipulator } from '../runs-base-manipulator';
export class ParagraphManipulator extends RunsBaseManipulator {
    insertParagraphViaHistory(params) {
        if (!params.correctAndCheckParams())
            return new FixedInterval(params.subDocPos.position, 0);
        this.history.addAndRedo(new InsertParagraphHistoryItem(this.modelManipulator, params));
        return new FixedInterval(params.subDocPos.position, 1);
    }
    insertParagraphInner(params) {
        const subDocument = params.subDocPos.subDocument;
        if (ParagraphManipulator.insertParagraphInEnd(subDocument, params.subDocPos.position, params.charPropsBundle)) {
            this.modelManipulator.notifyModelChanged(new ParagraphInsertedSubDocumentChange(subDocument.id, params.subDocPos.position, ListUtils.last(subDocument.paragraphs)));
            return;
        }
        const insertedRun = this.insertRunInternal(params.subDocPos, params.charPropsBundle, RunType.ParagraphRun, RichUtils.specialCharacters.ParagraphMark);
        const currentRun = subDocument.chunks[insertedRun.chunkIndex].textRuns[insertedRun.runIndex];
        const oldParagraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, (p) => p.startLogPosition.value, params.subDocPos.position + 1);
        const oldParagraph = subDocument.paragraphs[oldParagraphIndex];
        subDocument.positionManager.unregisterPosition(oldParagraph.startLogPosition);
        const newParagraph = new Paragraph(subDocument, null, 1, null, null);
        newParagraph.onParagraphPropertiesChanged();
        this.applyParagraphProperties(newParagraph, oldParagraph, !params.applyDirectlyToNewParagraph, params.parPropsBundle);
        currentRun.paragraph = newParagraph;
        subDocument.paragraphs.splice(oldParagraphIndex, 0, newParagraph);
        let indexRun = insertedRun.runIndex - 1;
        completeExecuteAllCycles: for (var indexChunk = insertedRun.chunkIndex, chunk; chunk = subDocument.chunks[indexChunk]; indexChunk--) {
            for (var run; run = chunk.textRuns[indexRun]; indexRun--) {
                if (run.isParagraphOrSectionRun())
                    break completeExecuteAllCycles;
                run.paragraph = newParagraph;
                run.onCharacterPropertiesChanged();
                newParagraph.length += run.getLength();
                oldParagraph.length -= run.getLength();
            }
            if (indexChunk > 0)
                indexRun = subDocument.chunks[indexChunk - 1].textRuns.length - 1;
        }
        newParagraph.startLogPosition = subDocument.positionManager.registerPosition(run != undefined ? chunk.startLogPosition.value + run.startOffset + 1 : 0);
        oldParagraph.startLogPosition = subDocument.positionManager.registerPosition(params.subDocPos.position + 1);
        indexRun = insertedRun.runIndex + 1;
        completeExecuteAllCycles: for (var indexChunk = insertedRun.chunkIndex, chunk; chunk = subDocument.chunks[indexChunk]; indexChunk++) {
            for (var run; run = chunk.textRuns[indexRun]; indexRun++) {
                run.onCharacterPropertiesChanged();
                if (run.isParagraphOrSectionRun())
                    break completeExecuteAllCycles;
            }
            indexRun = 0;
        }
        this.modelManipulator.notifyModelChanged(new ParagraphInsertedSubDocumentChange(subDocument.id, params.subDocPos.position, newParagraph));
        params.actionAfter(this.modelManipulator.modelManager);
    }
    applyParagraphProperties(newParagraph, oldParagraph, copyPropertiesToOldParagraph, parPropsBundle) {
        if (parPropsBundle.props) {
            if (copyPropertiesToOldParagraph) {
                oldParagraph.onParagraphPropertiesChanged();
                newParagraph.setParagraphProperties(oldParagraph.maskedParagraphProperties);
                oldParagraph.setParagraphProperties(parPropsBundle.props);
            }
            else {
                newParagraph.setParagraphProperties(parPropsBundle.props);
            }
        }
        else
            newParagraph.setParagraphProperties(oldParagraph.maskedParagraphProperties);
        if (parPropsBundle.style) {
            if (copyPropertiesToOldParagraph) {
                newParagraph.paragraphStyle = oldParagraph.paragraphStyle;
                oldParagraph.paragraphStyle = parPropsBundle.style;
            }
            else {
                newParagraph.paragraphStyle = parPropsBundle.style;
            }
        }
        else
            newParagraph.paragraphStyle = oldParagraph.paragraphStyle;
        if (parPropsBundle.listInfo !== undefined && parPropsBundle.listInfo.listLevelIndex !== undefined && parPropsBundle.listInfo.numberingListIndex !== undefined) {
            if (copyPropertiesToOldParagraph) {
                newParagraph.numberingListIndex = oldParagraph.numberingListIndex;
                newParagraph.listLevelIndex = oldParagraph.listLevelIndex;
                oldParagraph.numberingListIndex = parPropsBundle.listInfo.numberingListIndex;
                oldParagraph.listLevelIndex = parPropsBundle.listInfo.listLevelIndex;
            }
            else {
                newParagraph.numberingListIndex = parPropsBundle.listInfo.numberingListIndex;
                newParagraph.listLevelIndex = parPropsBundle.listInfo.listLevelIndex;
            }
        }
        else {
            newParagraph.numberingListIndex = oldParagraph.numberingListIndex;
            newParagraph.listLevelIndex = oldParagraph.listLevelIndex;
        }
        if (parPropsBundle.tabs) {
            if (copyPropertiesToOldParagraph) {
                newParagraph.tabs = oldParagraph.tabs.clone();
                oldParagraph.tabs = parPropsBundle.tabs;
            }
            else {
                newParagraph.tabs = parPropsBundle.tabs;
            }
        }
        else
            newParagraph.tabs = oldParagraph.tabs.clone();
    }
    static insertParagraphInEnd(subDocument, position, charPropsBundle) {
        var lastChunk = subDocument.chunks[subDocument.chunks.length - 1];
        var offsetAtStartDocumentLastSymbol = lastChunk.startLogPosition.value + lastChunk.textBuffer.length;
        if (position >= offsetAtStartDocumentLastSymbol) {
            position = offsetAtStartDocumentLastSymbol;
            const prevParagraph = subDocument.paragraphs[subDocument.paragraphs.length - 1];
            const newParagraph = new Paragraph(subDocument, subDocument.positionManager.registerPosition(position), 1, prevParagraph.paragraphStyle, prevParagraph.maskedParagraphProperties);
            const newTextRun = new ParagraphRun(position - lastChunk.startLogPosition.value, newParagraph, charPropsBundle);
            subDocument.paragraphs.push(newParagraph);
            lastChunk.textRuns.push(newTextRun);
            lastChunk.textBuffer = lastChunk.textBuffer + RichUtils.specialCharacters.ParagraphMark;
            var lastSection = subDocument.documentModel.sections[subDocument.documentModel.sections.length - 1];
            lastSection.setLength(subDocument, lastSection.getLength() + 1);
            return true;
        }
        return false;
    }
}
