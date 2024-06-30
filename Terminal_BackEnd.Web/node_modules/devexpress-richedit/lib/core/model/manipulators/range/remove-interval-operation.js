import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SectionMergedSubDocumentChange } from '../../changes/model/section-merged';
import { AnchorObjectRemovedSubDocumentChange } from '../../changes/sub-document/text/anchor-object-removed';
import { IntervalRemovedSubDocumentChange } from '../../changes/sub-document/text/interval-removed';
import { ParagraphMergedSubDocumentChange } from '../../changes/sub-document/text/paragraph-merged';
import { HistoryRun, HistoryRunAnchoredPicture, HistoryRunAnchoredTextBox, HistoryRunFieldCodeEnd, HistoryRunFieldCodeStart, HistoryRunFieldResultEnd, HistoryRunInlinePicture, HistoryRunParagraph, HistoryRunSection } from '../../character/history-runs';
import { Field } from '../../fields/field';
import { AnchoredPictureRun } from '../../runs/anchored-picture-run';
import { AnchoredTextBoxRun } from '../../runs/anchored-text-box-run';
import { InlinePictureRun } from '../../runs/inline-picture-run';
import { RunType } from '../../runs/run-type';
import { RunsBaseManipulator } from '../runs-base-manipulator';
import { BaseTextBoxInfo } from '../text-box-manipulator';
export class RemoveIntervalOperation {
    constructor(manipulator, subDocument) {
        this.currentCellIndex = 0;
        this.modelManipulator = manipulator;
        this.subDocument = subDocument;
    }
    execute(interval, applyPropertiesToLeft, needHistory) {
        this.cellsIterator = new SelectedCellsIterator(this.subDocument, interval);
        const result = new RemoveIntervalOperationResult(this.cellsIterator);
        result.bookmarkItems = this.modelManipulator.bookmark.deleteBookmarks(this.subDocument, interval);
        if (this.tryPackSelectionInOneRun(interval, result))
            return result;
        var iterator = this.subDocument.getRunIterator(interval);
        if (needHistory)
            this.fillResult(interval, result);
        this.initializeStartPositions(interval.start);
        this.executeCore(applyPropertiesToLeft, interval.start, iterator, result);
        this.correctTablesStart();
        return result;
    }
    correctTablesStart() {
        for (let tbl of this.subDocument.tables) {
            const tblPos = tbl.getStartPosition();
            const parPos = this.subDocument.getParagraphByPosition(tblPos).startLogPosition.value;
            if (tblPos != parPos)
                this.modelManipulator.table.changeTableStartPosition(this.subDocument, tbl, parPos);
        }
    }
    initializeStartPositions(intervalStart) {
        this.position = intervalStart;
        this.currentChunkIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.chunks, (c) => c.startLogPosition.value, intervalStart);
        this.currentSectionIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.documentModel.sections, s => s.startLogPosition.value, intervalStart);
        this.currentParagraphIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.paragraphs, p => p.startLogPosition.value, intervalStart);
        this.fieldIndexThatNeedDelete = -1;
    }
    executeCore(applyPropertiesToLeft, startPosition, iterator, result) {
        var subDocument = this.subDocument;
        var accumulatedInterval = new FixedInterval(this.position, 0);
        let removedTextList = [];
        while (iterator.moveNext()) {
            if (EnumUtils.isAnyOf(iterator.currentRun.getType(), RunType.AnchoredPictureRun, RunType.AnchoredTextBoxRun))
                this.modelManipulator.notifyModelChanged(new AnchorObjectRemovedSubDocumentChange(this.subDocument.id, (iterator.currentRun).anchoredObjectID, iterator.currentInterval().start));
            if (iterator.currentChunk !== subDocument.chunks[this.currentChunkIndex]) {
                this.removeAccumulatedInterval(accumulatedInterval, this.position, 0, removedTextList);
                this.currentChunkIndex++;
            }
            if (subDocument.documentModel.sections[this.currentSectionIndex] !== iterator.currentSection)
                this.currentSectionIndex++;
            var runIndex = SearchUtils.normedInterpolationIndexOf(subDocument.chunks[this.currentChunkIndex].textRuns, r => r.startOffset, iterator.currentRun.startOffset);
            if (iterator.currentRun.getType() == RunType.FieldCodeStartRun)
                this.removeField(startPosition);
            if (iterator.currentRun.getType() == RunType.ParagraphRun) {
                if (subDocument.paragraphs.length === 1) {
                    result.removeLastParagraphRun();
                    continue;
                }
            }
            iterator.currentRun.paragraph.length -= iterator.currentRun.getLength();
            this.modifySectionLength(iterator.currentSection, -iterator.currentRun.getLength());
            const strategy = this.getStrategy(iterator, accumulatedInterval);
            strategy.call(this, accumulatedInterval, removedTextList, runIndex);
        }
        this.removeAccumulatedInterval(accumulatedInterval, -1, 0, removedTextList);
        if (this.shouldMergeParagraphs)
            this.tryMergeStartEndParagraphs(startPosition, applyPropertiesToLeft);
        this.cellsIterator.reset();
    }
    modifySectionLength(section, delta) {
        section.setLength(this.subDocument, section.getLength() + delta);
    }
    getStrategy(iterator, accumulatedInterval) {
        if (!this.canRemoveRun(iterator.currentRun, iterator.currentRun.startOffset + iterator.currentChunk.startLogPosition.value + accumulatedInterval.length, iterator.currentRun.paragraph.length === 0))
            return this.skipRunAndMoveToNextParagraph;
        else if (iterator.currentRun.getType() === RunType.SectionRun && iterator.currentSection.getLength() == 0)
            return this.removeWholeSection;
        else if (iterator.currentRun.getType() === RunType.ParagraphRun && iterator.currentRun.paragraph.length === 0)
            return this.removeWholeParagraph;
        else if (iterator.currentRun.getType() === RunType.SectionRun && this.shouldMergeParagraphs && iterator.currentRun.paragraph.length === 0)
            return this.mergePreviousParagraph;
        else if (!iterator.currentRun.isParagraphOrSectionRun())
            return this.removeTextRun;
        else
            return this.skipParagraphRunAndMergeParagraphsAtTheEnd;
    }
    removeTextRun(accumulatedInterval, removedTextList, runIndex) {
        accumulatedInterval.length += this.subDocument.chunks[this.currentChunkIndex].textRuns[runIndex].getLength();
        removedTextList.push(this.removeRunInternal(this.subDocument, runIndex));
    }
    skipParagraphRunAndMergeParagraphsAtTheEnd(accumulatedInterval, removedTextList, runIndex) {
        this.skipRunAndMoveToNextParagraph(accumulatedInterval, removedTextList, runIndex);
        this.shouldMergeParagraphs = true;
    }
    skipRunAndMoveToNextParagraph(accumulatedInterval, removedTextList, _runIndex) {
        this.subDocument.paragraphs[this.currentParagraphIndex].length++;
        this.modifySectionLength(this.subDocument.documentModel.sections[this.currentSectionIndex], 1);
        this.position++;
        this.removeAccumulatedInterval(accumulatedInterval, this.position, 0, removedTextList);
        this.currentParagraphIndex++;
    }
    mergePreviousParagraph(accumulatedInterval, removedTextList, runIndex) {
        if (runIndex === 0)
            this.currentChunkIndex--;
        var paragraphIndex = this.currentParagraphIndex;
        const par = this.subDocument.paragraphs[paragraphIndex];
        const remodedParagraphMarkPos = par.getEndPosition() - 1;
        par.length++;
        this.removeAccumulatedInterval(accumulatedInterval, this.position, 0, removedTextList);
        this.mergeParagraphsInternal(this.subDocument, paragraphIndex - 1, false);
        this.modelManipulator.notifyModelChanged(new ParagraphMergedSubDocumentChange(this.subDocument.id, new FixedInterval(remodedParagraphMarkPos, 1), this.subDocument.paragraphs[paragraphIndex - 1].getEndPosition() - 1, false));
    }
    removeWholeSection(accumulatedInterval, removedTextList, runIndex) {
        var subDocument = this.subDocument;
        var currentSection = subDocument.documentModel.sections[this.currentSectionIndex];
        this.removeAccumulatedInterval(accumulatedInterval, this.position, -1, removedTextList);
        if (subDocument.documentModel.sections.length > 1) {
            const deletedSectionMarkPosition = currentSection.getEndPosition();
            subDocument.positionManager.unregisterPosition(currentSection.startLogPosition);
            subDocument.documentModel.sections.splice(this.currentSectionIndex, 1);
            subDocument.positionManager.unregisterPosition(subDocument.paragraphs[this.currentParagraphIndex].startLogPosition);
            subDocument.paragraphs.splice(this.currentParagraphIndex, 1);
            this.removeRunInternal(subDocument, runIndex);
            this.currentSectionIndex--;
            this.modelManipulator.notifyModelChanged(new SectionMergedSubDocumentChange(this.currentSectionIndex + 1, new FixedInterval(deletedSectionMarkPosition, 1), false));
        }
    }
    removeWholeParagraph(accumulatedInterval, removedTextList, runIndex) {
        var subDocument = this.subDocument;
        this.removeAccumulatedInterval(accumulatedInterval, this.position, -1, removedTextList);
        if (subDocument.paragraphs.length > 1) {
            const pos = subDocument.paragraphs[this.currentParagraphIndex].startLogPosition;
            const removedParagraphMarkPos = pos.value;
            subDocument.positionManager.unregisterPosition(pos);
            subDocument.paragraphs.splice(this.currentParagraphIndex, 1);
            this.removeRunInternal(subDocument, runIndex);
            this.modelManipulator.notifyModelChanged(new ParagraphMergedSubDocumentChange(subDocument.id, new FixedInterval(removedParagraphMarkPos, 1), this.position, false));
        }
    }
    tryMergeStartEndParagraphs(startPosition, applyPropertiesToLeft) {
        var subDocument = this.subDocument;
        var firstParagraphIndex = subDocument.getParagraphIndexByPosition(startPosition), firstParagraph = subDocument.paragraphs[firstParagraphIndex], lastParagraph = subDocument.paragraphs[firstParagraphIndex + 1];
        var firstSectionIndex = SearchUtils.normedInterpolationIndexOf(subDocument.documentModel.sections, s => s.startLogPosition.value, firstParagraph.startLogPosition.value), firstSection = subDocument.documentModel.sections[firstSectionIndex];
        if (lastParagraph) {
            this.modifySectionLength(firstSection, -1);
            if (this.subDocument.isMain() && firstSection.getEndPosition() === firstParagraph.getEndPosition() - 1 && firstSectionIndex < subDocument.documentModel.sections.length - 1) {
                const lastSection = subDocument.documentModel.sections[firstSectionIndex + 1];
                const deletedSectionMarkPos = firstSection.getEndPosition();
                subDocument.positionManager.unregisterPosition(lastSection.startLogPosition);
                lastSection.startLogPosition = subDocument.positionManager.registerPosition(firstSection.startLogPosition.value);
                this.modifySectionLength(lastSection, firstSection.getLength());
                subDocument.positionManager.unregisterPosition(firstSection.startLogPosition);
                subDocument.documentModel.sections.splice(firstSectionIndex, 1);
                this.mergeParagraphsInternal(subDocument, firstParagraphIndex, applyPropertiesToLeft);
                this.modelManipulator.notifyModelChanged(new SectionMergedSubDocumentChange(firstSectionIndex, new FixedInterval(deletedSectionMarkPos, 1), !!applyPropertiesToLeft));
            }
            else {
                const deletedParagraphMarkPos = lastParagraph.startLogPosition.value - 1;
                this.mergeParagraphsInternal(subDocument, firstParagraphIndex, applyPropertiesToLeft);
                this.modelManipulator.notifyModelChanged(new ParagraphMergedSubDocumentChange(subDocument.id, new FixedInterval(deletedParagraphMarkPos, 1), lastParagraph.startLogPosition.value - 1, !!applyPropertiesToLeft));
            }
        }
    }
    removeField(startPosition) {
        if (this.fieldIndexThatNeedDelete < 0) {
            this.fieldIndexThatNeedDelete = Field.normedBinaryIndexOf(this.subDocument.fields, startPosition + 1);
            if (this.fieldIndexThatNeedDelete < 0 || startPosition > this.subDocument.fields[this.fieldIndexThatNeedDelete].getFieldStartPosition())
                this.fieldIndexThatNeedDelete++;
        }
        Field.deleteFieldByIndex(this.subDocument, this.fieldIndexThatNeedDelete, this.modelManipulator);
    }
    tryPackSelectionInOneRun(interval, result) {
        const runInfo = this.subDocument.getRunAndIndexesByPosition(interval.start);
        const runStartPosition = runInfo.chunk.startLogPosition.value + runInfo.run.startOffset;
        const runEndPosition = runStartPosition + runInfo.run.getLength();
        const selectionEndPosition = interval.end;
        const selectionStartPosition = interval.start;
        if ((runStartPosition < selectionStartPosition) && (selectionEndPosition < runEndPosition)) {
            const chunkStartPosition = runInfo.chunk.startLogPosition.value;
            const offsetStartSelectionAtChunk = selectionStartPosition - chunkStartPosition;
            const offsetEndSelectionAtChunk = selectionEndPosition - chunkStartPosition;
            const removedText = runInfo.chunk.getTextInChunk(offsetStartSelectionAtChunk, interval.length);
            result.registerItem(new HistoryRun(runInfo.run.getType(), runInfo.run.getCharPropsBundle(this.modelManipulator.model), selectionStartPosition, removedText));
            runInfo.run.incLength(-interval.length);
            runInfo.chunk.textBuffer = [runInfo.chunk.textBuffer.substr(0, offsetStartSelectionAtChunk), runInfo.chunk.textBuffer.substr(offsetEndSelectionAtChunk)].join('');
            const paragraphIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.paragraphs, (p) => p.startLogPosition.value, selectionStartPosition);
            this.subDocument.paragraphs[paragraphIndex].length -= interval.length;
            const sectionIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.documentModel.sections, (s) => s.startLogPosition.value, selectionStartPosition);
            this.modifySectionLength(this.subDocument.documentModel.sections[sectionIndex], -interval.length);
            RunsBaseManipulator.moveRunsInChunk(runInfo.chunk, runInfo.runIndex + 1, -interval.length);
            this.subDocument.positionManager.advance(selectionStartPosition, -interval.length);
            this.modelManipulator.notifyModelChanged(new IntervalRemovedSubDocumentChange(this.subDocument.id, interval, removedText));
            return true;
        }
        return false;
    }
    canRemoveRun(run, absolutePosition, isLastRunInParagraph) {
        if (run.getType() === RunType.ParagraphRun) {
            this.cellsIterator.moveTo(absolutePosition);
            let currentCell = this.cellsIterator.getCurrent();
            if (currentCell && absolutePosition === currentCell.endParagrapPosition.value - 1)
                return false;
            let nextCell = this.cellsIterator.getNext();
            if (nextCell && nextCell.startParagraphPosition.value === absolutePosition + 1) {
                if (!isLastRunInParagraph)
                    return false;
                let prevCell = this.cellsIterator.getPrev();
                if (prevCell && prevCell.parentRow.parentTable.getLastCell() === prevCell)
                    return false;
            }
        }
        return true;
    }
    fillResult(interval, result) {
        var iterator = this.subDocument.getRunIterator(interval);
        var isInsertPropertiesAndStyleIndexToCurrentParagraph = undefined;
        var lastParagraphRemovingLength = 0;
        while (iterator.moveNext()) {
            var currentRun = iterator.currentRun;
            var currentChunk = iterator.currentChunk;
            var currentInterval = iterator.currentInterval();
            lastParagraphRemovingLength += currentInterval.length;
            if (!this.canRemoveRun(currentRun, currentInterval.start, iterator.currentRun.paragraph.length === lastParagraphRemovingLength)) {
                if (currentRun.isParagraphOrSectionRun())
                    lastParagraphRemovingLength = 0;
                continue;
            }
            switch (currentRun.getType()) {
                case RunType.TextRun:
                    result.registerItem(new HistoryRun(currentRun.getType(), currentRun.getCharPropsBundle(this.modelManipulator.model), currentInterval.start, currentChunk.getRunText(currentRun)));
                    break;
                case RunType.ParagraphRun:
                case RunType.SectionRun:
                    if (isInsertPropertiesAndStyleIndexToCurrentParagraph === undefined)
                        isInsertPropertiesAndStyleIndexToCurrentParagraph = currentRun.paragraph.startLogPosition.value == interval.start;
                    var paragraph;
                    if (isInsertPropertiesAndStyleIndexToCurrentParagraph)
                        paragraph = currentRun.paragraph;
                    else {
                        var nextParagraphIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.paragraphs, (p) => p.startLogPosition.value, currentRun.paragraph.startLogPosition.value) + 1;
                        paragraph = this.subDocument.paragraphs[nextParagraphIndex];
                    }
                    if (currentRun.getType() == RunType.ParagraphRun) {
                        result.registerItem(new HistoryRunParagraph(currentRun.getType(), currentRun.getCharPropsBundle(this.modelManipulator.model), paragraph.getParagraphBundleFull(this.modelManipulator.model), currentInterval.start, currentChunk.getRunText(currentRun), isInsertPropertiesAndStyleIndexToCurrentParagraph));
                    }
                    else {
                        result.registerItem(new HistoryRunSection(currentRun.getCharPropsBundle(this.modelManipulator.model), paragraph.getParagraphBundleFull(this.modelManipulator.model), iterator.currentSection, currentInterval.start, isInsertPropertiesAndStyleIndexToCurrentParagraph));
                    }
                    lastParagraphRemovingLength = 0;
                    break;
                case RunType.InlinePictureRun:
                    var currentPictureRun = currentRun;
                    if (!(currentPictureRun instanceof InlinePictureRun))
                        throw new Error("In TexManipulator.getHistoryRunsFromInterval currentPictureRun not have type InlinePictureRun");
                    result.registerItem(new HistoryRunInlinePicture(currentInterval.start, currentRun.getCharPropsBundle(this.modelManipulator.model), currentPictureRun.info.clone()));
                    break;
                case RunType.FieldCodeStartRun:
                    var globalOffset = currentInterval.start;
                    var fieldIndex = Field.normedBinaryIndexOf(this.subDocument.fields, globalOffset + 1);
                    var field = this.subDocument.fields[fieldIndex];
                    result.registerItem(new HistoryRunFieldCodeStart(currentRun.getType(), currentRun.getCharPropsBundle(this.modelManipulator.model), globalOffset, currentChunk.getRunText(currentRun), field.showCode, field.getFieldStartPosition(), field.getSeparatorPosition(), field.getFieldEndPosition(), field.getHyperlinkInfo() ? field.getHyperlinkInfo().clone() : undefined));
                    break;
                case RunType.FieldCodeEndRun:
                    result.registerItem(new HistoryRunFieldCodeEnd(currentRun.getType(), currentRun.getCharPropsBundle(this.modelManipulator.model), currentInterval.start, currentChunk.getRunText(currentRun)));
                    break;
                case RunType.FieldResultEndRun:
                    result.registerItem(new HistoryRunFieldResultEnd(currentRun.getType(), currentRun.getCharPropsBundle(this.modelManipulator.model), currentInterval.start, currentChunk.getRunText(currentRun)));
                    break;
                case RunType.AnchoredPictureRun:
                    var currentAnchoredRun = currentRun;
                    if (!(currentAnchoredRun instanceof AnchoredPictureRun))
                        throw new Error("In TextManipulator.getHistoryRunsFromInterval currentAnchoredRun is not of type AnchoredPictureRun");
                    result.registerItem(new HistoryRunAnchoredPicture(currentRun.getCharPropsBundle(this.modelManipulator.model), currentAnchoredRun.info.clone(), currentInterval.start));
                    break;
                case RunType.AnchoredTextBoxRun:
                    const currentAnchoredTextBoxRun = currentRun;
                    if (!(currentAnchoredTextBoxRun instanceof AnchoredTextBoxRun))
                        throw new Error("In TextManipulator.getHistoryRunsFromInterval currentAnchoredTextBoxRun is not of type AnchoredTextBoxRun");
                    result.registerItem(new HistoryRunAnchoredTextBox(currentRun.getCharPropsBundle(this.modelManipulator.model), new BaseTextBoxInfo(this.modelManipulator.model.subDocuments[currentAnchoredTextBoxRun.subDocId], currentAnchoredTextBoxRun.size.clone(), currentAnchoredTextBoxRun.shape.clone(), currentAnchoredTextBoxRun.anchorInfo.clone(), currentAnchoredTextBoxRun.textBoxProperties.clone(), currentAnchoredTextBoxRun.containerProperties.clone()), currentInterval.start));
                    break;
            }
        }
        iterator.reset();
        this.cellsIterator.reset();
    }
    removeAccumulatedInterval(removingInterval, newPosition, advanceDelta, removedTextList) {
        advanceDelta -= removingInterval.length;
        if (Math.abs(advanceDelta) > 0)
            this.subDocument.positionManager.advance(removingInterval.start, advanceDelta);
        if (removingInterval.length) {
            const removedText = removedTextList.join('');
            this.modelManipulator.notifyModelChanged(new IntervalRemovedSubDocumentChange(this.subDocument.id, removingInterval.clone(), removedText));
            removedTextList.splice(0);
        }
        removingInterval.start = newPosition;
        removingInterval.length = 0;
    }
    mergeParagraphsInternal(subDocument, paragraphIndex, setPropertiesSecondParagraph) {
        var firstParagraph = subDocument.paragraphs[paragraphIndex];
        var lastParagraph = subDocument.paragraphs[paragraphIndex + 1];
        var runInfo = subDocument.getRunAndIndexesByPosition(lastParagraph.startLogPosition.value - 1);
        if (setPropertiesSecondParagraph)
            firstParagraph.copyFrom(lastParagraph);
        var runs = subDocument.getRunsByInterval(new FixedInterval(lastParagraph.startLogPosition.value, lastParagraph.length));
        var chunkIndexDelta = this.currentChunkIndex - runInfo.chunkIndex;
        this.currentChunkIndex = runInfo.chunkIndex;
        this.removeRunInternal(subDocument, runInfo.runIndex);
        this.currentChunkIndex += chunkIndexDelta;
        firstParagraph.length--;
        for (var i = 0, run; run = runs[i]; i++) {
            run.paragraph = firstParagraph;
            run.onCharacterPropertiesChanged();
            firstParagraph.length += run.getLength();
        }
        subDocument.positionManager.advance(lastParagraph.startLogPosition.value, -1, -1);
        subDocument.positionManager.unregisterPosition(lastParagraph.startLogPosition);
        subDocument.paragraphs.splice(paragraphIndex + 1, 1);
    }
    removeRunInternal(subDocument, runIndex) {
        const currentChunk = subDocument.chunks[this.currentChunkIndex];
        const currentRun = currentChunk.textRuns[runIndex];
        const removedText = currentChunk.textBuffer.substr(currentRun.startOffset, currentRun.getLength());
        currentChunk.textBuffer = currentChunk.textBuffer.substr(0, currentRun.startOffset) + currentChunk.textBuffer.substr(currentRun.startOffset + currentRun.getLength());
        currentChunk.textRuns.splice(runIndex, 1);
        RunsBaseManipulator.moveRunsInChunk(currentChunk, runIndex, -currentRun.getLength());
        if (currentChunk.textRuns.length === 0) {
            subDocument.positionManager.unregisterPosition(currentChunk.startLogPosition);
            subDocument.chunks.splice(this.currentChunkIndex--, 1);
        }
        return removedText;
    }
}
export class RemoveIntervalOperationResult {
    constructor(cellsIterator) {
        this.historyRuns = [];
        this.nestingLevels = [];
        this.bookmarkItems = [];
        this.cellsIterator = cellsIterator;
    }
    registerItem(historyRun) {
        this.cellsIterator.moveTo(historyRun.offsetAtStartDocument);
        var cell = this.cellsIterator.getCurrent();
        this.registerItemCore(historyRun, cell ? cell.parentRow.parentTable.nestedLevel : -1);
    }
    registerItemCore(historyRun, nestingLevel) {
        this.historyRuns.push(historyRun);
        this.nestingLevels.push(nestingLevel);
    }
    removeLastParagraphRun() {
        var lastIndex = this.historyRuns.length - 1;
        var lastHistoryRun = this.historyRuns[lastIndex];
        if (lastHistoryRun && lastHistoryRun.type == RunType.ParagraphRun) {
            this.historyRuns.splice(lastIndex, 1);
            this.nestingLevels.splice(lastIndex, 1);
        }
    }
    getIterator() {
        return new RemoveIntervalOperationResultIterator(this.historyRuns, this.nestingLevels);
    }
}
export class SelectedCellsIterator {
    constructor(subDocument, interval) {
        this.current = 0;
        this.cells = SelectedCellsIterator.getCellsByInterval(subDocument, interval);
    }
    moveTo(position) {
        if (position < this.position)
            this.reset();
        this.position = position;
        let cell;
        while (cell = this.cells[this.current]) {
            if (position >= cell.endParagrapPosition.value)
                this.current++;
            else
                return true;
        }
        return false;
    }
    getCurrent() {
        let cell = this.cells[this.current];
        return cell ? SelectedCellsIterator.correctCurrent(this.position, cell) : null;
    }
    getPrev() {
        let cell = this.cells[this.current];
        if (cell && this.position >= cell.endParagrapPosition.value)
            return cell;
        return this.cells[this.current - 1] || null;
    }
    getNext() {
        let cell = this.cells[this.current];
        if (cell && this.position < cell.startParagraphPosition.value)
            return cell;
        return this.cells[this.current + 1] || null;
    }
    reset() {
        this.current = 0;
        this.position = 0;
    }
    static getCellsByInterval(subDocument, interval) {
        if (subDocument.tables.length === 0)
            return [];
        let table = subDocument.tablesByLevels[0][Math.max(0, SearchUtils.normedInterpolationIndexOf(subDocument.tablesByLevels[0], t => t.getStartPosition(), interval.start))];
        let intervalEnd = interval.end;
        if (intervalEnd < table.getStartPosition())
            return [];
        let result = [];
        this.collectCellsByIntervalCore(subDocument, result, table, interval.start, intervalEnd);
        return result.sort((c1, c2) => c1.endParagrapPosition.value - c2.endParagrapPosition.value);
    }
    static collectCellsByIntervalCore(subDocument, result, table, intervalStart, intervalEnd) {
        let nextTable = subDocument.tables[table.index + 1];
        if (nextTable && nextTable.getStartPosition() <= intervalEnd)
            this.collectCellsByIntervalCore(subDocument, result, nextTable, intervalStart, intervalEnd);
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                if (intervalStart < cell.endParagrapPosition.value && intervalEnd > cell.startParagraphPosition.value)
                    result.push(cell);
                else if (intervalStart === cell.endParagrapPosition.value && cell.parentRow.parentTable.getLastCell() === cell)
                    result.push(cell);
                else if (cell.parentRow.parentTable.getFirstCell() === cell && cell.startParagraphPosition.value === intervalEnd)
                    result.push(cell);
                else if (cell.startParagraphPosition.value > intervalEnd)
                    return;
            }
        }
    }
    static correctCurrent(position, cell) {
        if (position >= cell.startParagraphPosition.value && position < cell.endParagrapPosition.value)
            return cell;
        if (position < cell.startParagraphPosition.value && cell.parentRow.parentTable.parentCell)
            return this.correctCurrent(position, cell.parentRow.parentTable.parentCell);
        return null;
    }
}
export class RemoveIntervalOperationResultIterator {
    constructor(historyRuns, nestingLevels) {
        this.position = -1;
        this.historyRuns = historyRuns;
        this.nestingLevels = nestingLevels;
    }
    moveNext() {
        this.position++;
        this.currentHistoryRun = this.historyRuns[this.position];
        this.currentNestingLevel = this.nestingLevels[this.position];
        return !!this.currentHistoryRun;
    }
}
