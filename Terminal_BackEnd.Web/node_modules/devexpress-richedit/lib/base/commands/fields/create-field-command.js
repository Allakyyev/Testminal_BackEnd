import { Field } from '../../../core/model/fields/field';
import { UpdateFieldsOptions } from '../../../core/model/fields/tree-creator';
import { FieldInsertHistoryItem } from '../../../core/model/history/items/field-insert-history-item';
import { InsertTextHistoryItem } from '../../../core/model/history/items/insert-text-history-item';
import { RemoveIntervalHistoryItem } from '../../../core/model/history/items/remove-interval-history-item';
import { InsertParagraphManipulatorParams } from '../../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { ControlOptions } from '../../../core/model/options/control';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../../core/model/sub-document';
import { Table } from '../../../core/model/tables/main-structures/table';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { IntervalCommandState } from '../command-states';
import { FieldCommandHelper } from './field-command-helper';
import { UpdateFieldCommandBase } from './update-field-command-base';
export class CreateFieldCommandBase extends CommandBase {
    getState() {
        return new IntervalCommandState(this.isEnabled(), this.selection.lastSelectedInterval);
    }
    static isTableProtectionOk(subDocumentInreval) {
        const subDoc = subDocumentInreval.subDocument;
        const interval = CreateFieldCommandBase.getIntervalWithoutLastParagraphMark(subDocumentInreval.interval, subDoc);
        if (interval.length == 0)
            return true;
        const tables = subDocumentInreval.subDocument.tables;
        for (let tblIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(tables, (t) => t.getStartPosition(), interval.start)), table; table = tables[tblIndex]; tblIndex++) {
            if (table.getStartPosition() >= interval.end)
                break;
            if (IntervalAlgorithms.getIntersectionNonNullLength(table.interval, interval)) {
                const startCell = Table.getTableCellByPosition(tables, interval.start);
                const endCell = Table.getTableCellByPosition(tables, interval.end);
                return startCell && endCell && startCell === endCell &&
                    interval.end < subDoc.getParagraphByPosition(endCell.endParagrapPosition.value).getEndPosition();
            }
        }
        return true;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            CreateFieldCommandBase.isTableProtectionOk(this.selection.subDocumentInterval);
    }
    static getIntervalWithoutLastParagraphMark(interval, subDocument) {
        interval = interval.clone();
        var lastDocPos = subDocument.getDocumentEndPosition();
        if (interval.end == lastDocPos) {
            interval.length--;
            if (interval.length < 0)
                interval = new FixedInterval(lastDocPos - 1, 0);
        }
        return interval;
    }
}
export class CreateFieldCommand extends CreateFieldCommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.intervals = [CreateFieldCommandBase.getIntervalWithoutLastParagraphMark(this.selection.lastSelectedInterval, options.subDocument)];
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        const interval = options.intervalsInfo.interval;
        this.history.addTransaction(() => {
            this.history.addAndRedo(new FieldInsertHistoryItem(this.modelManipulator, subDocument, interval.start, interval.length, 0, true, this.inputPosition.charPropsBundle));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(interval.start + 1)));
        });
        return true;
    }
}
export class CreatePredefinedFieldCommand extends CreateFieldCommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.interval = CreateFieldCommandBase.getIntervalWithoutLastParagraphMark(this.selection.lastSelectedInterval, options.subDocument);
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        const interval = options.intervalsInfo.interval;
        var history = this.history;
        history.beginTransaction();
        var startPosition = interval.start;
        history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(startPosition)));
        if (interval.length > 0)
            history.addAndRedo(new RemoveIntervalHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, interval), false));
        var run = subDocument.getRunByPosition(startPosition);
        var prefix = this.getPrefix();
        if (prefix.length > 0) {
            history.addAndRedo(new InsertTextHistoryItem(this.modelManipulator, new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, startPosition), run.getCharPropsBundle(this.modelManipulator.model), RunType.TextRun, prefix + " ")));
            startPosition += prefix.length + 1;
        }
        if (this.needNewParagraph()) {
            const currentParagraph = subDocument.getParagraphByPosition(startPosition);
            if (startPosition > currentParagraph.startLogPosition.value) {
                this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, startPosition), this.inputPosition));
                startPosition++;
            }
            this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, startPosition), this.inputPosition));
        }
        history.addAndRedo(new FieldInsertHistoryItem(this.modelManipulator, subDocument, startPosition, 0, 0, !this.needUpdate(), this.inputPosition.charPropsBundle));
        var insertedText = this.getInsertedText(options.param);
        history.addAndRedo(new InsertTextHistoryItem(this.modelManipulator, new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, startPosition + 1), run.getCharPropsBundle(this.modelManipulator.model), RunType.TextRun, insertedText)));
        const fieldInterval = this.needUpdate() ?
            new FixedInterval(startPosition, insertedText.length + 3) :
            new FixedInterval(startPosition + insertedText.length, 0);
        if (this.needUpdate()) {
            UpdateFieldCommandBase.updateFields(this, [new SubDocumentIntervals(subDocument, [fieldInterval])], () => {
                const fieldEndPos = subDocument.fields[Field.normedBinaryIndexOf(subDocument.fields, startPosition + 1)].getFieldEndPosition();
                history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(fieldEndPos)));
                history.endTransaction();
            }, new UpdateFieldsOptions());
        }
        else {
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(fieldInterval)));
            history.endTransaction();
        }
        return true;
    }
    needUpdate() {
        return true;
    }
    needNewParagraph() {
        return false;
    }
    getPrefix() {
        return "";
    }
}
export class CreateFieldWithCodeCommand extends CreatePredefinedFieldCommand {
    getInsertedText(code) {
        return code;
    }
}
export class CreatePageFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "PAGE";
    }
}
export class CreatePageCountFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "NUMPAGES";
    }
}
export class CreateDateFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return `DATE \\@ \"${this.control.modelManager.richOptions.fields.defaultDateFormat}\"`;
    }
}
export class CreateTimeFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return `TIME \\@ \"${this.control.modelManager.richOptions.fields.defaultTimeFormat}\"`;
    }
}
export class CreateMergeFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(parameter) {
        return parameter.indexOf(" ") !== -1 ? `MERGEFIELD \"${parameter}\"` : `MERGEFIELD ${parameter}`;
    }
}
export class CreateEmptyMergeFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "MERGEFIELD \"\"";
    }
    needUpdate() {
        return false;
    }
}
export class CreateEmptyDocVariableFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "DOCVARIABLE \"\"";
    }
    needUpdate() {
        return false;
    }
}
export class CreateTableOfContentCommandBase extends CreatePredefinedFieldCommand {
    isEnabled() {
        const currentTocField = FieldCommandHelper.findTocFieldBySelection(this.selection.activeSubDocument, this.selection);
        return super.isEnabled() && currentTocField == null;
    }
    getInsertedText(_parameter) {
        return "TOC \\h \\c \"Table\"";
    }
    needNewParagraph() {
        return true;
    }
}
export class CreateTocFieldCommand extends CreateTableOfContentCommandBase {
    getInsertedText(_parameter) {
        return "TOC \\h \\u";
    }
}
export class CreateTableOfEquationsFieldCommand extends CreateTableOfContentCommandBase {
    getInsertedText(_parameter) {
        return "TOC \\h \\c \"Equation\"";
    }
}
export class CreateTableOfFiguresFieldCommand extends CreateTableOfContentCommandBase {
    getInsertedText(_parameter) {
        return "TOC \\h \\c \"Figure\"";
    }
}
export class CreateTableOfTablesFieldCommand extends CreateTableOfContentCommandBase {
    getInsertedText(_parameter) {
        return "TOC \\h \\c \"Table\"";
    }
}
export class CreateEquationCaptionFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "SEQ Equation \\* ARABIC";
    }
    getPrefix() {
        return this.control.stringResources.seqCaptionPrefixes.equationPrefix;
    }
}
export class CreateFigureCaptionFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "SEQ Figure \\* ARABIC";
    }
    getPrefix() {
        return this.control.stringResources.seqCaptionPrefixes.figurePrefix;
    }
}
export class CreateTableCaptionFieldCommand extends CreatePredefinedFieldCommand {
    getInsertedText(_parameter) {
        return "SEQ Table \\* ARABIC";
    }
    getPrefix() {
        return this.control.stringResources.seqCaptionPrefixes.tablePrefix;
    }
}
