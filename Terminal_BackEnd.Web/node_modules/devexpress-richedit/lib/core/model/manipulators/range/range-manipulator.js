import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { HyperlinkInfoChangedSubDocumentChange } from '../../changes/sub-document/field/hyperlink-info-changed';
import { FieldInsertedSubDocumentChange } from '../../changes/sub-document/field/inserted';
import { HistoryRunFieldCodeStart, HistoryRunInlinePicture, HistoryRunParagraph, HistoryRunSection } from '../../character/history-runs';
import { Field } from '../../fields/field';
import { ParagraphPropertiesHistoryItem } from '../../history/items/paragraph-properties-history-items';
import { RemoveIntervalHistoryItem } from '../../history/items/remove-interval-history-item';
import { MaskedParagraphProperties } from '../../paragraph/paragraph-properties';
import { TabProperties } from '../../paragraph/paragraph-style';
import { RunType } from '../../runs/run-type';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../sub-document';
import { BaseManipulator } from '../base-manipulator';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../text-manipulator/insert-text-manipulator-params';
import { RangeCopy } from './create-range-copy-operation';
import { RemoveIntervalOperation } from './remove-interval-operation';
import { RestoreRemovedIntervalOperation } from './restore-removed-interval-operation';
export class RangeManipulator extends BaseManipulator {
    copyIntervalTo(subDocument, interval, toPosition) {
        this.history.addTransaction(() => {
            RangeCopy.create(new SubDocumentIntervals(subDocument, [interval]))
                .insertTo(this.modelManipulator, new SubDocumentPosition(subDocument, toPosition));
        });
    }
    moveIntervalTo(subDocInterval, toPosition) {
        subDocInterval.validateInterval();
        this.history.beginTransaction();
        const rangeCopy = RangeCopy.create(new SubDocumentIntervals(subDocInterval.subDocument, [subDocInterval.interval]));
        const insertedInterval = rangeCopy.insertTo(this.modelManipulator, new SubDocumentPosition(subDocInterval.subDocument, toPosition));
        if (toPosition < subDocInterval.interval.start)
            this.removeInterval(new SubDocumentInterval(subDocInterval.subDocument, new FixedInterval(subDocInterval.interval.start + insertedInterval.length, subDocInterval.interval.length)), false, true);
        else {
            this.removeInterval(subDocInterval, false, true);
            insertedInterval.start -= subDocInterval.interval.length;
        }
        this.history.endTransaction();
        return insertedInterval;
    }
    removeIntervalInner(subDocument, interval, setPropertiesSecondParagraph) {
        var operation = new RemoveIntervalOperation(this.modelManipulator, subDocument);
        return operation.execute(interval, setPropertiesSecondParagraph, true);
    }
    removeIntervalWithoutHistory(subDocument, interval, setPropertiesSecondParagraph) {
        var operation = new RemoveIntervalOperation(this.modelManipulator, subDocument);
        operation.execute(interval, setPropertiesSecondParagraph, false);
    }
    restoreRemovedInterval(subDocument, removeOperationResult) {
        new RestoreRemovedIntervalOperation(this.modelManipulator, subDocument).execute(removeOperationResult);
    }
    unpackHistoryRunsToModel(subDocument, historyRuns) {
        var fields = subDocument.fields;
        var fieldStackHistory = [];
        for (var historyRunIndex = 0, historyRun; historyRun = historyRuns[historyRunIndex]; historyRunIndex++) {
            switch (historyRun.type) {
                case RunType.ParagraphRun: {
                    if (!(historyRun instanceof HistoryRunParagraph))
                        throw new Error("In unpackHistoryRunsToModel type text run = TextRunType.ParagraphRun, but type historyRun != HistoryRunParagraph. historyRun.offsetAtStartDocument = " +
                            historyRun.offsetAtStartDocument + ", historyRun.text = " + historyRun.text);
                    var historyRunParagraph = historyRun;
                    this.modelManipulator.paragraph.insertParagraphInner(new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, historyRunParagraph.offsetAtStartDocument), historyRunParagraph.charPropsBundle, historyRunParagraph.parPropsBundle, historyRunParagraph.applyDirectlyToNewParagraph));
                    break;
                }
                case RunType.SectionRun: {
                    if (!(historyRun instanceof HistoryRunSection))
                        throw new Error("In unpackHistoryRunsToModel type text run = TextRunType.SectionRun, but type historyRun != HistoryRunSection. historyRun.offsetAtStartDocument = " +
                            historyRun.offsetAtStartDocument + ", historyRun.text = " + historyRun.text);
                    var historyRunSection = historyRun;
                    this.modelManipulator.section.insertSection(new SubDocumentPosition(subDocument, historyRunSection.offsetAtStartDocument), historyRunSection.charPropsBundle, historyRunSection.sectionProperties, true, historyRunSection.parPropsBundle, historyRunSection.applyDirectlyToNewParagraph);
                    break;
                }
                case RunType.InlinePictureRun: {
                    if (!(historyRun instanceof HistoryRunInlinePicture))
                        throw new Error("In unpackHistoryRunsToModel type text run = TextRunType.InlinePictureRun, but type historyRun != HistoryRunInlinePicture. historyRun.offsetAtStartDocument = " +
                            historyRun.offsetAtStartDocument + ", historyRun.text = " + historyRun.text);
                    this.modelManipulator.picture.insertInlinePictureInner(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.picInfo, historyRun.options);
                    break;
                }
                case RunType.FieldCodeStartRun: {
                    if (!(historyRun instanceof HistoryRunFieldCodeStart))
                        throw new Error("In unpackHistoryRunsToModel type text run = TextRunType.HistoryRunFieldCodeStart, but type historyRun != HistoryRunFieldCodeStart. historyRun.offsetAtStartDocument = " +
                            historyRun.offsetAtStartDocument + ", historyRun.text = " + historyRun.text);
                    fieldStackHistory.push(historyRun);
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    break;
                }
                case RunType.FieldResultEndRun: {
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    var histFieldCodeStartRun = fieldStackHistory.pop();
                    var fieldInsertIndex = 0;
                    if (fields.length > 0) {
                        fieldInsertIndex = Math.max(0, Field.normedBinaryIndexOf(fields, histFieldCodeStartRun.startPosition + 1));
                        if (histFieldCodeStartRun.startPosition > fields[fieldInsertIndex].getFieldStartPosition())
                            fieldInsertIndex++;
                    }
                    var newField = new Field(subDocument.positionManager, fieldInsertIndex, histFieldCodeStartRun.startPosition, histFieldCodeStartRun.separatorPosition, histFieldCodeStartRun.endPosition, histFieldCodeStartRun.showCode, histFieldCodeStartRun.hyperlinkInfo ? histFieldCodeStartRun.hyperlinkInfo.clone() : undefined);
                    Field.addField(fields, newField);
                    this.modelManipulator.notifyModelChanged(new FieldInsertedSubDocumentChange(subDocument.id, histFieldCodeStartRun.startPosition, histFieldCodeStartRun.separatorPosition, histFieldCodeStartRun.endPosition));
                    if (histFieldCodeStartRun.hyperlinkInfo)
                        this.modelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(subDocument.id, FixedInterval.fromPositions(histFieldCodeStartRun.separatorPosition + 1, histFieldCodeStartRun.endPosition - 1), FixedInterval.fromPositions(histFieldCodeStartRun.startPosition + 1, histFieldCodeStartRun.separatorPosition), histFieldCodeStartRun.hyperlinkInfo));
                    break;
                }
                default: {
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    break;
                }
            }
        }
    }
    removeInterval(subDocInterval, removeTableIfItMatchesWithInterval, clearLastParagraphIfIntervalMatchesWholeDocument, forbidNonEmptyParagraphRemovingBeforeTable) {
        if (subDocInterval.interval.length == 0)
            return;
        this.history.beginTransaction();
        this.modelManipulator.table.removeTablesOnInterval(subDocInterval, removeTableIfItMatchesWithInterval);
        const documentEndPosition = subDocInterval.subDocument.getDocumentEndPosition();
        const isWholeDocumentRemoved = clearLastParagraphIfIntervalMatchesWholeDocument &&
            subDocInterval.interval.start === 0 && subDocInterval.interval.length === documentEndPosition;
        const intervalEndPosition = subDocInterval.interval.end;
        if (intervalEndPosition == documentEndPosition)
            subDocInterval.interval.length -= 1;
        else {
            const endParIndex = subDocInterval.subDocument.getParagraphIndexByPosition(intervalEndPosition);
            if (endParIndex > 0) {
                const endPar = subDocInterval.subDocument.paragraphs[endParIndex];
                const beforeEndPar = subDocInterval.subDocument.paragraphs[endParIndex - 1];
                const intervalEndsInParagraphStart = intervalEndPosition == endPar.startLogPosition.value;
                const isOnlyParagraphMarkRemoved = intervalEndsInParagraphStart && subDocInterval.interval.length == 1;
                const isParagraphEndsBeforeTable = intervalEndsInParagraphStart && !beforeEndPar.getTableCell() && endPar.getTableCell();
                if (!isOnlyParagraphMarkRemoved && forbidNonEmptyParagraphRemovingBeforeTable && isParagraphEndsBeforeTable)
                    subDocInterval.interval.length -= 1;
            }
        }
        var setPropertiesSecondParagraph = SearchUtils.binaryIndexOf(subDocInterval.subDocument.paragraphs, (p) => p.startLogPosition.value - subDocInterval.interval.start) >= 0;
        this.history.addAndRedo(new RemoveIntervalHistoryItem(this.modelManipulator, subDocInterval, setPropertiesSecondParagraph));
        if (isWholeDocumentRemoved) {
            this.history.addAndRedo(new ParagraphPropertiesHistoryItem(this.modelManipulator, subDocInterval.subDocument, 0, MaskedParagraphProperties.createDefault(this.model), this.model.getDefaultParagraphStyle(), -1, -1, new TabProperties()));
            this.modelManipulator.characterProperties.resetCharacterFormatting(subDocInterval.subDocument, new FixedInterval(0, 1));
        }
        this.history.endTransaction();
    }
}
