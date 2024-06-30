import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { Grid } from '../../layout-formatter/table/grid-engine/grid';
import { RunType } from '../runs/run-type';
import { SubDocument } from '../sub-document';
import { Table } from '../tables/main-structures/table';
import { TableCellMergingState } from '../tables/secondary-structures/table-base-structures';
import { PositionChecker } from './position';
export var ModelCheckerResult;
(function (ModelCheckerResult) {
    ModelCheckerResult[ModelCheckerResult["None"] = 0] = "None";
    ModelCheckerResult[ModelCheckerResult["Run"] = 1] = "Run";
    ModelCheckerResult[ModelCheckerResult["Paragraph"] = 2] = "Paragraph";
    ModelCheckerResult[ModelCheckerResult["Chunk"] = 3] = "Chunk";
    ModelCheckerResult[ModelCheckerResult["Section"] = 4] = "Section";
    ModelCheckerResult[ModelCheckerResult["SubDocument"] = 5] = "SubDocument";
    ModelCheckerResult[ModelCheckerResult["Field"] = 6] = "Field";
    ModelCheckerResult[ModelCheckerResult["Table"] = 7] = "Table";
    ModelCheckerResult[ModelCheckerResult["PositionManager"] = 8] = "PositionManager";
    ModelCheckerResult[ModelCheckerResult["RangePermission"] = 9] = "RangePermission";
})(ModelCheckerResult || (ModelCheckerResult = {}));
export class ModelChecker {
    constructor(model) {
        this.results = [];
        this.model = model;
    }
    checkAll() {
        if (ModelChecker.disableCheckModel)
            return true;
        this.check([
            this.checkModelProps,
            this.checkParagraphs,
            this.checkChunks,
            this.checkSections,
            this.checkParagraphChunk,
            this.checkFields,
            this.checkTables,
            this.checkPositions
        ]);
        return !this.results.length;
    }
    check(checks) {
        for (let check of checks) {
            const result = check.call(this);
            if (result != ModelCheckerResult.None && result !== null) {
                this.results.push(result);
                break;
            }
        }
    }
    checkModelProps() {
        if (!this.model.mainSubDocument)
            return ModelCheckerResult.SubDocument;
        if (!this.model.subDocuments[SubDocument.MAIN_SUBDOCUMENT_ID])
            return ModelCheckerResult.SubDocument;
        return ModelCheckerResult.None;
    }
    checkParagraphs() {
        return NumberMapUtils.unsafeAnyOf(this.model.subDocuments, sd => {
            if (!sd.paragraphs[0] || sd.paragraphs[0].startLogPosition.value != 0)
                return ModelCheckerResult.Paragraph;
            let parPos = 0;
            for (let par of sd.paragraphs) {
                if (par.startLogPosition.value != parPos || par.length < 1 ||
                    !sd.getRunByPosition(par.getEndPosition() - 1).isParagraphOrSectionRun())
                    return ModelCheckerResult.Paragraph;
                const checkTabsResult = this.checkTabs(par.tabs);
                if (checkTabsResult)
                    return checkTabsResult;
                parPos += par.length;
            }
            return ModelCheckerResult.None;
        });
    }
    checkTabs(tabs) {
        for (let tab of tabs.tabsInfo) {
            if (tab.leader === undefined)
                return ModelCheckerResult.Paragraph;
        }
        return ModelCheckerResult.None;
    }
    checkChunks() {
        return NumberMapUtils.unsafeAnyOf(this.model.subDocuments, sd => {
            if (!sd.chunks[0] && sd.chunks[0].startLogPosition.value != 0)
                return ModelCheckerResult.Chunk;
            let chunkPos = 0;
            for (let chunk of sd.chunks) {
                if (chunk.textBuffer.length < 1 || chunk.textRuns.length < 1 || chunk.startLogPosition.value != chunkPos)
                    return ModelCheckerResult.Chunk;
                for (let run of chunk.textRuns) {
                    if (!run.maskedCharacterProperties.fontInfo || !run.characterStyle)
                        return ModelCheckerResult.Run;
                }
                chunkPos += chunk.textBuffer.length;
            }
            return ModelCheckerResult.None;
        });
    }
    checkSections() {
        const mainSubDoc = this.model.mainSubDocument;
        if (!this.model.sections[0] || this.model.sections[0].startLogPosition.value != 0)
            return ModelCheckerResult.Section;
        let sectionPos = 0;
        for (let section of this.model.sections) {
            if (sectionPos != section.startLogPosition.value || section.getLength() < 1 ||
                !mainSubDoc.getRunByPosition(section.getEndPosition() - 1).isParagraphOrSectionRun())
                return ModelCheckerResult.Section;
            sectionPos += section.getLength();
        }
        if (ListUtils.last(this.model.sections).getEndPosition() != ListUtils.last(mainSubDoc.paragraphs).getEndPosition())
            return ModelCheckerResult.Section;
        return ModelCheckerResult.None;
    }
    checkParagraphChunk() {
        return NumberMapUtils.unsafeAnyOf(this.model.subDocuments, sd => {
            const lastPos = ListUtils.last(sd.paragraphs).getEndPosition();
            if (lastPos != ListUtils.last(sd.chunks).getEndPosition())
                return ModelCheckerResult.Chunk;
            return ModelCheckerResult.None;
        });
    }
    checkFields() {
        return NumberMapUtils.unsafeAnyOf(this.model.subDocuments, sd => {
            const fieldsCopy = ListUtils.shallowCopy(sd.fields).sort((a, b) => a.getFieldStartPosition() - b.getFieldStartPosition());
            if (!ListUtils.allOf2(fieldsCopy, sd.fields, (a, b) => a.index == b.index))
                return ModelCheckerResult.Field;
            return ListUtils.unsafeAnyOf(sd.fields, (field, index) => {
                if (field.index != index)
                    return ModelCheckerResult.Field;
                const result = this.checkField(sd, field);
                return result;
            });
        });
    }
    checkTables() {
        return NumberMapUtils.unsafeAnyOf(this.model.subDocuments, sd => {
            const tablesCopy = ListUtils.shallowCopy(sd.tables);
            tablesCopy.sort(Table.comparer);
            if (!ListUtils.allOf2(tablesCopy, sd.tables, (a, b) => a.index == b.index))
                return ModelCheckerResult.Table;
            if (sd.tables.length != ListUtils.accumulateNumber(sd.tablesByLevels, tblOnLevel => tblOnLevel.length))
                return ModelCheckerResult.Table;
            if (ListUtils.unsafeAnyOf(sd.tablesByLevels, tablesOnLevel => ListUtils.unsafeAnyOf(tablesOnLevel, (table, index) => table.getStartPosition() - tablesOnLevel[index - 1].getEndPosition() < 1, 1)))
                return ModelCheckerResult.Table;
            return ListUtils.unsafeAnyOf(sd.tables, (table, index) => {
                if (table.index != index)
                    return ModelCheckerResult.Table;
                const result = this.checkTable(sd, table);
                return result;
            });
        });
    }
    checkField(sd, field) {
        const startPos = field.getFieldStartPosition();
        const codeStartPos = field.getCodeStartPosition();
        const sepPos = field.getSeparatorPosition();
        const resultStartPos = field.getResultStartPosition();
        const resultEndPos = field.getResultEndPosition();
        const endPos = field.getFieldEndPosition();
        if (!(startPos + 1 == codeStartPos &&
            sepPos + 1 == resultStartPos &&
            resultEndPos + 1 == endPos &&
            sepPos > startPos &&
            resultEndPos - sepPos > 0 &&
            sd.getRunByPosition(startPos).getType() == RunType.FieldCodeStartRun &&
            sd.getRunByPosition(sepPos).getType() == RunType.FieldCodeEndRun &&
            sd.getRunByPosition(resultEndPos).getType() == RunType.FieldResultEndRun)) {
            return ModelCheckerResult.Field;
        }
        if (field.parent) {
            if (!this.isParentOfField(field, field.parent))
                return ModelCheckerResult.Field;
        }
        return ModelCheckerResult.None;
    }
    isParentOfField(field, parent) {
        const allFieldInterval = field.getAllFieldInterval();
        const parentInterval = field.getFieldStartPosition() < parent.getSeparatorPosition() ?
            parent.getCodeInterval() :
            parent.getResultInterval();
        return allFieldInterval.start >= parentInterval.start && allFieldInterval.end <= parentInterval.end;
    }
    checkTable(sd, table) {
        if (table.parentCell) {
            if (!table.parentCell.interval.containsIntervalWithoutEnd(table.interval))
                return ModelCheckerResult.Table;
        }
        if (!table.rows[0] || !table.rows[0].cells[0])
            return ModelCheckerResult.Table;
        let cellPos = table.rows[0].cells[0].startParagraphPosition.value;
        const numLogicalColumns = table.rows[0].getTotalCellsInRowConsiderGrid();
        for (let row, rowIndex = 0; row = table.rows[rowIndex]; rowIndex++) {
            if (row.getTotalCellsInRowConsiderGrid() != numLogicalColumns || !row.cells[0])
                return ModelCheckerResult.Table;
            for (let cell, cellIndex = 0; cell = row.cells[cellIndex]; cellIndex++) {
                const cellInterval = cell.interval;
                if (cellInterval.start != cellPos || cellInterval.length < 1 ||
                    sd.getRunByPosition(cellInterval.end - 1).getType() != RunType.ParagraphRun ||
                    cell.columnSpan < 1) {
                    return ModelCheckerResult.Table;
                }
                cellPos += cellInterval.length;
            }
        }
        const grid = new Grid(table);
        for (let row, rowIndex = 0; row = table.rows[rowIndex]; rowIndex++) {
            for (let cell, cellIndex = 0; cell = row.cells[cellIndex]; cellIndex++) {
                const info = grid.tableCellInfos[rowIndex][cellIndex];
                switch (cell.verticalMerging) {
                    case TableCellMergingState.None:
                        {
                            if (!(rowIndex == info.getStartRowIndex() && rowIndex + 1 == info.getEndRowIndex())) {
                                return ModelCheckerResult.Table;
                            }
                        }
                        break;
                    case TableCellMergingState.Continue:
                        if (!(rowIndex > info.getStartRowIndex() && rowIndex < info.getEndRowIndex())) {
                            return ModelCheckerResult.Table;
                        }
                        break;
                    case TableCellMergingState.Restart:
                        if (!(rowIndex == info.getStartRowIndex() && info.getEndRowIndex() > rowIndex + 1)) {
                            return ModelCheckerResult.Table;
                        }
                        break;
                    default:
                        return ModelCheckerResult.Table;
                }
            }
        }
        return ModelCheckerResult.None;
    }
    checkPositions() {
        return new PositionChecker(this.model).check() ? ModelCheckerResult.None : ModelCheckerResult.PositionManager;
    }
}
ModelChecker.disableCheckModel = false;
