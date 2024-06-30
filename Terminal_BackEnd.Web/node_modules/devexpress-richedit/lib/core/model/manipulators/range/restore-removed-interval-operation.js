import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ConstBookmark } from '../../bookmarks';
import { HyperlinkInfoChangedSubDocumentChange } from '../../changes/sub-document/field/hyperlink-info-changed';
import { FieldInsertedSubDocumentChange } from '../../changes/sub-document/field/inserted';
import { HistoryRunFieldCodeStart, HistoryRunInlinePicture, HistoryRunParagraph, HistoryRunSection } from '../../character/history-runs';
import { Field } from '../../fields/field';
import { RunType } from '../../runs/run-type';
import { SubDocumentPosition } from '../../sub-document';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../text-manipulator/insert-text-manipulator-params';
export class RestoreRemovedIntervalOperation {
    constructor(manipulator, subDocument) {
        this.currentTableIndex = undefined;
        this.modelManipulator = manipulator;
        this.subDocument = subDocument;
    }
    execute(removeOperationResult) {
        var iterator = removeOperationResult.getIterator();
        var subDocument = this.subDocument;
        var fields = this.subDocument.fields;
        const fieldStackHistory = [];
        while (iterator.moveNext()) {
            var historyRun = iterator.currentHistoryRun;
            switch (historyRun.type) {
                case RunType.ParagraphRun: {
                    if (!(historyRun instanceof HistoryRunParagraph))
                        throw new Error("In unpackHistoryRunsToModel type text run = TextRunType.ParagraphRun, but type historyRun != HistoryRunParagraph. historyRun.offsetAtStartDocument = " +
                            historyRun.offsetAtStartDocument + ", historyRun.text = " + historyRun.text);
                    let historyRunParagraph = historyRun;
                    let currentTable = this.getTableForShifting(historyRunParagraph.offsetAtStartDocument);
                    this.modelManipulator.paragraph.insertParagraphInner(new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, historyRunParagraph.offsetAtStartDocument), historyRunParagraph.charPropsBundle, historyRunParagraph.parPropsBundle, historyRunParagraph.applyDirectlyToNewParagraph));
                    if (currentTable && currentTable.nestedLevel > iterator.currentNestingLevel)
                        this.shiftTablesToPosition(currentTable, historyRunParagraph.offsetAtStartDocument + 1, iterator.currentNestingLevel);
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
                    const inlineHistoryRun = historyRun;
                    this.modelManipulator.picture.insertInlinePictureInner(new SubDocumentPosition(subDocument, inlineHistoryRun.offsetAtStartDocument), inlineHistoryRun.charPropsBundle, inlineHistoryRun.picInfo, inlineHistoryRun.options);
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
                        this.modelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(subDocument.id, FixedInterval.fromPositions(histFieldCodeStartRun.separatorPosition + 1, histFieldCodeStartRun.endPosition - 1), FixedInterval.fromPositions(histFieldCodeStartRun.startPosition + 1, histFieldCodeStartRun.endPosition), histFieldCodeStartRun.hyperlinkInfo));
                    break;
                }
                case RunType.AnchoredPictureRun: {
                    const anchoredPictureHistoryRun = historyRun;
                    this.modelManipulator.picture.insertAnchoredPictureInner(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, anchoredPictureHistoryRun.picInfo);
                    break;
                }
                case RunType.AnchoredTextBoxRun: {
                    const anchoredTextBoxHistoryRun = historyRun;
                    const innerSubDocument = anchoredTextBoxHistoryRun.textBoxInfo.innerSubDocument;
                    this.modelManipulator.textBox.insertAnchoredTextBox(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, anchoredTextBoxHistoryRun.textBoxInfo);
                    this.modelManipulator.model.subDocumentsCollection.restore(innerSubDocument.id);
                    break;
                }
                default: {
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    break;
                }
            }
        }
        for (let bkmTemplate of removeOperationResult.bookmarkItems)
            this.modelManipulator.bookmark.createBookmark(subDocument, bkmTemplate, false);
        subDocument.bookmarks = subDocument.bookmarks.sort(ConstBookmark.comparer);
    }
    shiftTablesToPosition(table, position, minNestingLevel) {
        this.modelManipulator.table.changeTableStartPosition(this.subDocument, table, position);
        var prevTable = this.subDocument.tables[table.index - 1];
        if (prevTable && prevTable.nestedLevel > minNestingLevel)
            this.shiftTablesToPosition(prevTable, position, minNestingLevel);
    }
    getTableForShifting(position) {
        if (this.currentTableIndex === undefined) {
            this.currentTableIndex = SearchUtils.normedInterpolationIndexOf(this.subDocument.tables, t => t.getStartPosition(), position);
            while (this.currentTableIndex > -1 && this.subDocument.tables[this.currentTableIndex].nestedLevel > 0)
                this.currentTableIndex--;
        }
        var table;
        while (table = this.subDocument.tables[this.currentTableIndex]) {
            if (position >= table.getEndPosition()) {
                this.currentTableIndex++;
                continue;
            }
            else if (position < table.getStartPosition())
                return null;
            var nextTable = this.subDocument.tables[this.currentTableIndex + 1];
            if (!nextTable || nextTable.getStartPosition() > position)
                return table;
            this.currentTableIndex++;
        }
        return null;
    }
}
