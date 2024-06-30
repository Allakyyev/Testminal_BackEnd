import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ModelIterator } from '../model-iterator';
import { LinkedInterval } from '../position/linked-interval';
import { RichUtils } from '../rich-utils';
import { RunType } from '../runs/run-type';
import { SubDocumentInterval, SubDocumentIntervals } from '../sub-document';
import { Field } from './field';
import { FieldCodeParser } from './parsers/field-code-parser';
import { FieldCodeParserDate } from './parsers/field-code-parser-date';
import { FieldCodeParserDocVariable } from './parsers/field-code-parser-doc-variable';
import { FieldCodeParserHyperlink } from './parsers/field-code-parser-hyperlink';
import { FieldCodeParserMailMerge } from './parsers/field-code-parser-merge-field';
import { FieldCodeParserNumPages } from './parsers/field-code-parser-num-pages';
import { FieldCodeParserPage } from './parsers/field-code-parser-page';
import { FieldCodeParserPageRef } from './parsers/field-code-parser-page-ref';
import { FieldCodeParserSeq } from './parsers/field-code-parser-seq';
import { FieldCodeParserTc } from './parsers/field-code-parser-tc';
import { FieldCodeParserTime } from './parsers/field-code-parser-time';
import { FieldCodeParserToc } from './parsers/field-code-parser-toc';
import { FieldCodeParserFillIn } from './parsers/fill-in';
class FieldParsersAndIntervals {
    constructor(interval) {
        this.interval = interval;
        this.parsers = [];
        this.updated = false;
    }
    destructor(manager) {
        this.interval.destructor(manager);
    }
}
export class FieldUpdateResult {
    constructor(subDocIntervals) {
        this.subDocIntervals = subDocIntervals;
    }
}
export class UpdateFieldsOptions {
    constructor(updateToc = true, updateFillIn = true) {
        this.updateToc = updateToc;
        this.updateFillIn = updateFillIn;
    }
}
export class FieldsWaitingForUpdate {
    constructor(modelManager, layoutFormatterManager, requestManager, subDocumentIntervals, options, callback) {
        this.infoForFutureUpdate = [];
        this.savedSelectionIntervals = [];
        this.modelManager = modelManager;
        this.layoutFormatterManager = layoutFormatterManager;
        this.requestManager = requestManager;
        this.callback = callback;
        this.subDocument = subDocumentIntervals.subDocument;
        this.options = options;
        this.infoForFutureUpdate = ListUtils.map(subDocumentIntervals.intervals, (interval) => new FieldParsersAndIntervals(new LinkedInterval(this.subDocument.positionManager, interval)));
        this.savedSelectionIntervals = ListUtils.map(subDocumentIntervals.intervals, (interval) => new LinkedInterval(this.subDocument.positionManager, interval));
    }
    get fields() { return this.subDocument.fields; }
    update(response, immediateSendRequest = true) {
        if (this.fields.length == 0) {
            this.endAction();
            return;
        }
        this.requestManager.checkResponse(this.subDocument, response);
        this.requestManager.clear(this.subDocument);
        var countUpdatedInfos = 0;
        for (var infoIndex = 0, info; info = this.infoForFutureUpdate[infoIndex]; infoIndex++) {
            if (info.updated) {
                countUpdatedInfos++;
                continue;
            }
            if (info.parsers.length > 0) {
                if (this.continueUpdateCurrentInterval(info.parsers, response)) {
                    info.updated = true;
                    countUpdatedInfos++;
                }
                continue;
            }
            var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(this.fields, info.interval.start + 1));
            var field = this.fields[fieldIndex];
            while (!field.getAllFieldInterval().containsWithIntervalEnd(info.interval.start) && field.parent)
                field = field.parent;
            var startParent = field.parent;
            var someFieldInCurrentInfoNotUpdated = false;
            for (fieldIndex = field.index; field = this.fields[fieldIndex]; fieldIndex++) {
                const startPos = field.getFieldStartPosition();
                if (startPos > info.interval.end || startPos == info.interval.end && info.interval.length > 0)
                    break;
                if (field.getFieldEndPosition() <= info.interval.start ||
                    (field.parent != null && field.parent != startParent) ||
                    !this.subDocument.isEditable([field.getAllFieldInterval()]))
                    continue;
                const fieldParser = FieldsWaitingForUpdate.getParser(this.modelManager, this.layoutFormatterManager, this.requestManager, this.subDocument, field);
                if (fieldParser) {
                    if (!this.options.updateToc && fieldParser instanceof FieldCodeParserToc ||
                        !this.options.updateFillIn && fieldParser instanceof FieldCodeParserFillIn) {
                        const skipAllBefore = field.getFieldEndPosition();
                        fieldParser.destructor();
                        for (let ind = fieldIndex + 1; field = this.fields[ind]; ind++) {
                            if (field.getFieldStartPosition() >= skipAllBefore) {
                                fieldIndex = ind - 1;
                                break;
                            }
                        }
                        continue;
                    }
                    if (!fieldParser.update(response)) {
                        someFieldInCurrentInfoNotUpdated = true;
                        info.parsers.push(fieldParser);
                    }
                    else
                        fieldParser.destructor();
                }
                else {
                    this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, field.getResultInterval()), true, false);
                    FieldCodeParser.finalAction(this.layoutFormatterManager, field, this.subDocument);
                }
            }
            if (!someFieldInCurrentInfoNotUpdated) {
                info.updated = true;
                countUpdatedInfos++;
            }
        }
        if (this.infoForFutureUpdate.length != countUpdatedInfos)
            this.requestManager.sendRequest(this.subDocument, this.modelManager.richOptions.mailMerge.activeRecordIndex, immediateSendRequest);
        else {
            this.requestManager.forceSendDelayedRequests();
            this.endAction();
        }
    }
    endAction() {
        const selectionIntervals = ListUtils.map(this.savedSelectionIntervals, (interval) => {
            const fixed = interval.getFixedInterval();
            interval.destructor(this.subDocument.positionManager);
            return fixed;
        });
        for (let info of this.infoForFutureUpdate)
            info.destructor(this.subDocument.positionManager);
        this.infoForFutureUpdate = [];
        this.callback(new FieldUpdateResult(new SubDocumentIntervals(this.subDocument, selectionIntervals)));
    }
    continueUpdateCurrentInterval(fieldParsers, response) {
        var allFieldUpdated = true;
        for (var parserIndex = 0, parser; parser = fieldParsers[parserIndex]; parserIndex++) {
            if (parser.update(response)) {
                parser.destructor();
                fieldParsers.splice(parserIndex, 1);
                parserIndex--;
            }
            else
                allFieldUpdated = false;
        }
        return allFieldUpdated;
    }
    static getParser(modelManager, layoutFormatterManager, requestManager, subDocument, field) {
        const modelIterator = new ModelIterator(subDocument, false);
        modelIterator.setPosition(field.getCodeStartPosition());
        const result = FieldsWaitingForUpdate.findName(modelIterator);
        const parserConstructor = FieldsWaitingForUpdate.parsersMap[result.fieldName];
        return parserConstructor ?
            parserConstructor({
                modelManager: modelManager,
                layoutFormatterManager: layoutFormatterManager,
                requestManager: requestManager,
                subDocument: subDocument,
                field: field,
                modelIterator: modelIterator,
                fieldNameFirstLetterPosition: result.fieldNameFirstLetterPosition
            }) : null;
    }
    static findName(modelIterator) {
        while (modelIterator.run.getType() == RunType.TextRun && RichUtils.isWhitespace.test(modelIterator.getCurrentChar()) ||
            modelIterator.run.getType() == RunType.ParagraphRun ||
            modelIterator.run.getType() == RunType.SectionRun)
            modelIterator.moveToNextChar();
        const fieldNameFirstLetterPosition = modelIterator.getAbsolutePosition();
        let fieldName = "";
        do {
            fieldName += modelIterator.getCurrentChar();
            modelIterator.moveToNextChar();
        } while (modelIterator.run.getType() == RunType.TextRun && !RichUtils.isWhitespace.test(modelIterator.getCurrentChar()) &&
            modelIterator.run.getType() != RunType.ParagraphRun && modelIterator.run.getType() != RunType.SectionRun);
        return new FindFieldNameResult(fieldName.toUpperCase(), fieldNameFirstLetterPosition);
    }
}
FieldsWaitingForUpdate.TOC_NAME = "TOC";
FieldsWaitingForUpdate.parsersMap = {
    ["DATE"]: (args) => new FieldCodeParserDate(args),
    ["TIME"]: (args) => new FieldCodeParserTime(args),
    ["DOCVARIABLE"]: (args) => new FieldCodeParserDocVariable(args),
    ["HYPERLINK"]: (args) => new FieldCodeParserHyperlink(args),
    ["MERGEFIELD"]: (args) => new FieldCodeParserMailMerge(args),
    ["NUMPAGES"]: (args) => new FieldCodeParserNumPages(args),
    ["PAGE"]: (args) => new FieldCodeParserPage(args),
    ["SEQ"]: (args) => new FieldCodeParserSeq(args),
    ["TC"]: (args) => new FieldCodeParserTc(args),
    [FieldsWaitingForUpdate.TOC_NAME]: (args) => new FieldCodeParserToc(args),
    ["PAGEREF"]: (args) => new FieldCodeParserPageRef(args),
    ["FILLIN"]: (args) => new FieldCodeParserFillIn(args),
};
export class FindFieldNameResult {
    constructor(fieldName, fieldNameFirstLetterPosition) {
        this.fieldName = fieldName;
        this.fieldNameFirstLetterPosition = fieldNameFirstLetterPosition;
    }
}
