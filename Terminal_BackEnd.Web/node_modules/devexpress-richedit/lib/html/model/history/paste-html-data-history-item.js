import { HyperlinkInfoChangedSubDocumentChange } from '../../../core/model/changes/sub-document/field/hyperlink-info-changed';
import { FieldInsertedSubDocumentChange } from '../../../core/model/changes/sub-document/field/inserted';
import { CharacterStyle } from '../../../core/model/character/character-style';
import { Field } from '../../../core/model/fields/field';
import { IntervalBasedHistoryItem } from '../../../core/model/history/base/interval-based-history-item';
import { InsertParagraphManipulatorParams } from '../../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { TableNormalizator } from '../../../core/model/manipulators/tables/table-normalizator';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { Table } from '../../../core/model/tables/main-structures/table';
import { TableCell } from '../../../core/model/tables/main-structures/table-cell';
import { TableRow } from '../../../core/model/tables/main-structures/table-row';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class PasteHtmlDataHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, historyRuns, tablesInfo, charPropsBundle) {
        super(modelManipulator, subDocInterval);
        this.historyRuns = historyRuns;
        this.tablesInfo = tablesInfo;
        this.charPropsBundle = charPropsBundle;
    }
    redo() {
        this.insertRuns();
        this.insertTables();
    }
    undo() {
        for (let table of this.historyTables)
            this.modelManipulator.table.removeTable(this.boundSubDocument, table);
        this.modelManipulator.range.removeIntervalWithoutHistory(this.boundSubDocument, this.interval, false);
    }
    insertRuns() {
        const fields = this.boundSubDocument.fields;
        const fieldStackHistory = [];
        for (var historyRunIndex = 0, historyRun; historyRun = this.historyRuns[historyRunIndex]; historyRunIndex++) {
            switch (historyRun.type) {
                case RunType.ParagraphRun:
                    var historyRunParagraph = historyRun;
                    this.modelManipulator.paragraph.insertParagraphInner(new InsertParagraphManipulatorParams(new SubDocumentPosition(this.boundSubDocument, historyRunParagraph.offsetAtStartDocument), historyRunParagraph.charPropsBundle, historyRunParagraph.parPropsBundle, historyRunParagraph.applyDirectlyToNewParagraph, () => { }));
                    break;
                case RunType.InlinePictureRun:
                    const historyInlinePictureRun = historyRun;
                    this.modelManipulator.picture.insertInlinePictureInner(new SubDocumentPosition(this.boundSubDocument, historyInlinePictureRun.offsetAtStartDocument), historyInlinePictureRun.charPropsBundle, historyInlinePictureRun.picInfo, historyInlinePictureRun.options);
                    break;
                case RunType.FieldCodeStartRun:
                    fieldStackHistory.push(historyRun);
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.boundSubDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    break;
                case RunType.FieldResultEndRun:
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.boundSubDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    var histFieldCodeStartRun = fieldStackHistory.pop();
                    var fieldInsertIndex = 0;
                    if (fields.length > 0) {
                        fieldInsertIndex = Math.max(0, Field.normedBinaryIndexOf(fields, histFieldCodeStartRun.startPosition + 1));
                        if (histFieldCodeStartRun.startPosition > fields[fieldInsertIndex].getFieldStartPosition())
                            fieldInsertIndex++;
                    }
                    var field = new Field(this.boundSubDocument.positionManager, fieldInsertIndex, histFieldCodeStartRun.startPosition, histFieldCodeStartRun.separatorPosition, histFieldCodeStartRun.endPosition, histFieldCodeStartRun.showCode, histFieldCodeStartRun.hyperlinkInfo ? histFieldCodeStartRun.hyperlinkInfo.clone() : undefined);
                    Field.addField(fields, field);
                    this.modelManipulator.notifyModelChanged(new FieldInsertedSubDocumentChange(this.boundSubDocument.id, histFieldCodeStartRun.startPosition, histFieldCodeStartRun.separatorPosition, histFieldCodeStartRun.endPosition));
                    if (histFieldCodeStartRun.hyperlinkInfo) {
                        let codeInterval = FixedInterval.fromPositions(histFieldCodeStartRun.startPosition + 1, histFieldCodeStartRun.separatorPosition);
                        let resultInterval = FixedInterval.fromPositions(histFieldCodeStartRun.separatorPosition + 1, histFieldCodeStartRun.endPosition - 1);
                        this.modelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(this.boundSubDocument.id, resultInterval, codeInterval, histFieldCodeStartRun.hyperlinkInfo));
                        if (resultInterval.length)
                            this.modelManipulator.style.setCharacterStyle(this.boundSubDocument, resultInterval, this.boundSubDocument.documentModel.getCharacterStyleByName(CharacterStyle.hyperlinkStyleName), false);
                    }
                    break;
                default:
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.boundSubDocument, historyRun.offsetAtStartDocument), historyRun.charPropsBundle, historyRun.type, historyRun.text));
                    break;
            }
        }
    }
    insertTables() {
        this.historyTables = [];
        for (let tableInfo of this.tablesInfo) {
            const table = new Table(tableInfo.properties, this.boundSubDocument.documentModel.getDefaultTableStyle());
            table.preferredWidth = tableInfo.width;
            for (let rowInfo of tableInfo.rows) {
                const row = new TableRow(table, this.boundSubDocument.documentModel.cache.tableRowPropertiesCache.getItem(rowInfo.properties));
                row.gridAfter = rowInfo.gridAfter;
                row.gridBefore = rowInfo.gridBefore;
                row.widthAfter = rowInfo.widthAfter;
                row.widthBefore = rowInfo.widthBefore;
                table.rows.push(row);
                for (let cellInfo of rowInfo.cells) {
                    const cell = new TableCell(row, this.boundSubDocument.documentModel.cache.tableCellPropertiesCache.getItem(cellInfo.properties));
                    cell.preferredWidth = cellInfo.preferredWidth;
                    cell.startParagraphPosition = this.boundSubDocument.positionManager.registerPosition(cellInfo.startPosition);
                    cell.endParagrapPosition = this.boundSubDocument.positionManager.registerPosition(cellInfo.endPosition);
                    cell.columnSpan = cellInfo.columnSpan;
                    cell.verticalMerging = cellInfo.firstWhenVerticallyMerged ?
                        (cellInfo.rowSpan > 1 ? TableCellMergingState.Restart : TableCellMergingState.None) :
                        TableCellMergingState.Continue;
                    row.cells.push(cell);
                }
            }
            const positionToPaste = tableInfo.rows[0].cells[0].startPosition;
            this.modelManipulator.table.pasteTable(this.boundSubDocument, table, positionToPaste);
            const insertedTable = Table.getTableByPosition(this.boundSubDocument.tables, positionToPaste, true);
            new TableNormalizator(insertedTable, (table, rowIndex, newValue) => table.rows[rowIndex].gridBefore = newValue, (table, rowIndex, newValue) => table.rows[rowIndex].gridAfter = newValue, (table, rowIndex, newValue) => table.rows[rowIndex].widthBefore = newValue, (table, rowIndex, newValue) => table.rows[rowIndex].widthAfter = newValue, (table, rowIndex, cellIndex, newValue) => table.rows[rowIndex].cells[cellIndex].columnSpan = newValue, (table, rowIndex, cellIndex, newValue) => table.rows[rowIndex].cells[cellIndex].verticalMerging = newValue)
                .normalizeAll();
            if (insertedTable)
                this.historyTables.push(insertedTable);
        }
    }
}
