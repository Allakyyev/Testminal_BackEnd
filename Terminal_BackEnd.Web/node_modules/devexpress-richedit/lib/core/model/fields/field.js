import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { FieldDeletedSubDocumentChange } from '../changes/sub-document/field/deleted';
import { RunType } from '../runs/run-type';
export var FieldNameType;
(function (FieldNameType) {
    FieldNameType[FieldNameType["None"] = 0] = "None";
    FieldNameType[FieldNameType["CreateDate"] = 1] = "CreateDate";
    FieldNameType[FieldNameType["Date"] = 2] = "Date";
    FieldNameType[FieldNameType["DocVariable"] = 3] = "DocVariable";
    FieldNameType[FieldNameType["Hyperlink"] = 4] = "Hyperlink";
    FieldNameType[FieldNameType["If"] = 5] = "If";
    FieldNameType[FieldNameType["IncludePicture"] = 6] = "IncludePicture";
    FieldNameType[FieldNameType["MergeField"] = 7] = "MergeField";
    FieldNameType[FieldNameType["NumPages"] = 8] = "NumPages";
    FieldNameType[FieldNameType["Page"] = 9] = "Page";
    FieldNameType[FieldNameType["Seq"] = 10] = "Seq";
    FieldNameType[FieldNameType["Symbol"] = 11] = "Symbol";
    FieldNameType[FieldNameType["TC"] = 12] = "TC";
    FieldNameType[FieldNameType["TOC"] = 13] = "TOC";
    FieldNameType[FieldNameType["Formula"] = 14] = "Formula";
    FieldNameType[FieldNameType["FillIn"] = 15] = "FillIn";
})(FieldNameType || (FieldNameType = {}));
export class HyperlinkInfo {
    constructor(uri, anchor, tip, visited) {
        this.uri = uri ? uri : "";
        this.anchor = anchor ? anchor : "";
        this.tip = tip ? tip : "";
        this.visited = visited ? visited : false;
    }
    clone() {
        return new HyperlinkInfo(this.uri, this.anchor, this.tip, this.visited);
    }
    getUriPlusAnchor() {
        return this.uri + (this.anchor == "" ? "" : "#" + this.anchor);
    }
    static getNewCodeText(hyperlinkInfo) {
        return [
            "HYPERLINK \"",
            hyperlinkInfo.uri,
            "\"",
            hyperlinkInfo.tip == "" ? "" : " \\o \"" + hyperlinkInfo.tip + "\"",
            hyperlinkInfo.anchor == "" ? "" : " \\l \"" + hyperlinkInfo.anchor + "\""
        ].join("");
    }
}
export class SequenceInfo {
    constructor(identifier, repeats, hidesResult, resets, resetsWith) {
        this.identifier = identifier;
        this.repeats = repeats;
        this.hidesResult = hidesResult;
        this.resets = resets;
        this.resetsWith = resetsWith ? resetsWith : 0;
    }
    clone() {
        return new SequenceInfo(this.identifier, this.repeats, this.hidesResult, this.resets, this.resetsWith);
    }
}
export class TcInfo {
    constructor(identifier, text, level) {
        this.identifier = identifier;
        this.text = text;
        this.level = level;
    }
    clone() {
        return new TcInfo(this.identifier, this.text, this.level);
    }
}
export class Field {
    constructor(positionManager, index, startFieldPosition, separatorPosition, endFieldPosition, showCode, hyperlinkInfo) {
        this.codeStartPosition = positionManager.registerPosition(startFieldPosition + 1);
        this.resultStartPosition = positionManager.registerPosition(separatorPosition + 1);
        this.fieldEndPosition = positionManager.registerPosition(endFieldPosition);
        this.index = index;
        this.showCode = showCode;
        this.parent = undefined;
        if (hyperlinkInfo !== undefined)
            this.hyperlinkInfo = hyperlinkInfo;
    }
    destructor(positionManager) {
        positionManager.unregisterPosition(this.codeStartPosition);
        positionManager.unregisterPosition(this.resultStartPosition);
        positionManager.unregisterPosition(this.fieldEndPosition);
    }
    static addField(fields, newField) {
        var field;
        var fieldIndex;
        fields.splice(newField.index, 0, newField);
        for (fieldIndex = newField.index + 1; field = fields[fieldIndex]; fieldIndex++)
            field.index++;
        for (fieldIndex = newField.index - 1; field = fields[fieldIndex]; fieldIndex--) {
            if (field.getFieldEndPosition() <= newField.getFieldStartPosition())
                break;
        }
        var resetParentFrom = Math.max(0, fieldIndex);
        for (fieldIndex = newField.index + 1; field = fields[fieldIndex]; fieldIndex++) {
            if (field.getFieldStartPosition() >= newField.getFieldEndPosition())
                break;
        }
        var resetParentToIndex = Math.min(fields.length - 1, fieldIndex);
        for (fieldIndex = resetParentFrom; fieldIndex <= resetParentToIndex; fieldIndex++)
            fields[fieldIndex].initParent(fields);
    }
    static deleteFieldByIndex(subDocument, delFieldIndex, modelManipulator) {
        var fields = subDocument.fields;
        var delField = fields[delFieldIndex];
        for (var fieldIndex = delFieldIndex + 1, field; field = fields[fieldIndex]; fieldIndex++)
            field.index--;
        var delFieldEndPos = delField.getFieldEndPosition();
        for (var i = delFieldIndex + 1, currField; currField = fields[i]; i++) {
            if (currField.parent == delField)
                currField.parent = delField.parent;
            if (currField.getFieldStartPosition() >= delFieldEndPos)
                break;
        }
        fields.splice(delField.index, 1);
        delField.destructor(subDocument.positionManager);
        modelManipulator.notifyModelChanged(new FieldDeletedSubDocumentChange(subDocument.id, delFieldEndPos));
    }
    isHyperlinkField() {
        return !!this.hyperlinkInfo;
    }
    setNewHyperlinkInfo(hyperlinkInfo) {
        this.hyperlinkInfo = hyperlinkInfo;
    }
    getHyperlinkInfo() {
        return this.hyperlinkInfo;
    }
    getSequenceInfo() {
        return this.sequenceInfo;
    }
    setNewSequenceInfo(info) {
        this.sequenceInfo = info;
    }
    isSequenceField() {
        return this.sequenceInfo !== undefined;
    }
    getTcInfo() {
        return this.tcInfo;
    }
    setNewTcInfo(info) {
        this.tcInfo = info;
    }
    isTcField() {
        return this.tcInfo !== undefined;
    }
    getFieldStartPosition() {
        return this.codeStartPosition.value - 1;
    }
    getCodeStartPosition() {
        return this.codeStartPosition.value;
    }
    getSeparatorPosition() {
        return this.resultStartPosition.value - 1;
    }
    getResultStartPosition() {
        return this.resultStartPosition.value;
    }
    getResultEndPosition() {
        return this.fieldEndPosition.value - 1;
    }
    getFieldEndPosition() {
        return this.fieldEndPosition.value;
    }
    setParent(parent) {
        if (parent !== null && (parent.getFieldStartPosition() >= this.getFieldStartPosition() || parent.getFieldEndPosition() <= this.getFieldEndPosition()))
            throw new Error("Incorrect field parent");
        this.parent = parent;
    }
    initParent(fieldList) {
        for (var i = this.index - 1, possibleParent; possibleParent = fieldList[i]; i--) {
            if (possibleParent.getFieldEndPosition() > this.getFieldEndPosition()) {
                this.parent = possibleParent;
                return;
            }
            if (possibleParent.parent == null)
                break;
        }
        this.parent = null;
    }
    static normedBinaryIndexOf(fields, position) {
        return SearchUtils.normedInterpolationIndexOf(fields, (f) => f.getCodeStartPosition(), position);
    }
    static binaryIndexOf(fields, position) {
        return SearchUtils.binaryIndexOf(fields, (f) => f.getCodeStartPosition() - position);
    }
    getAbsolutelyTopLevelField() {
        var field = this;
        for (; field.parent; field = field.parent)
            ;
        return field;
    }
    getCodeInterval() {
        return FixedInterval.fromPositions(this.getCodeStartPosition(), this.getSeparatorPosition());
    }
    getCodeIntervalWithBorders() {
        return FixedInterval.fromPositions(this.getFieldStartPosition(), this.getResultStartPosition());
    }
    getResultInterval() {
        return FixedInterval.fromPositions(this.getResultStartPosition(), this.getResultEndPosition());
    }
    getResultIntervalWithBorders() {
        return FixedInterval.fromPositions(this.getResultStartPosition(), this.getFieldEndPosition());
    }
    getAllFieldInterval() {
        return FixedInterval.fromPositions(this.getFieldStartPosition(), this.getFieldEndPosition());
    }
    getAllFieldIntervalWithoutBorders() {
        return FixedInterval.fromPositions(this.getCodeStartPosition(), this.getResultEndPosition());
    }
    isPlacedInCodeAreaTopLevelField(topLevelField) {
        return !!IntervalAlgorithms.getIntersection(this.getAllFieldInterval(), topLevelField.getCodeInterval());
    }
    getPositions(poss) {
        poss.push(this.codeStartPosition);
        poss.push(this.resultStartPosition);
        poss.push(this.fieldEndPosition);
    }
    static correctIntervalDueToFieldsWithoutUiChecks(subDocument, newInterval) {
        const fields = subDocument.fields;
        if (newInterval.length && fields.length) {
            let startFieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, newInterval.start));
            let field = fields[startFieldIndex];
            while (field.parent)
                field = field.parent;
            startFieldIndex = field.index;
            let endFieldIndex = startFieldIndex;
            for (; (field = fields[endFieldIndex]) && (field.getFieldStartPosition() < newInterval.end); endFieldIndex++) {
                if (IntervalAlgorithms.getIntersectionNonNullLength(newInterval, new FixedInterval(field.getFieldStartPosition(), 1)) ||
                    IntervalAlgorithms.getIntersectionNonNullLength(newInterval, new FixedInterval(field.getSeparatorPosition(), 1)) ||
                    IntervalAlgorithms.getIntersectionNonNullLength(newInterval, new FixedInterval(field.getResultEndPosition(), 1)))
                    newInterval.expand(field.getAllFieldInterval());
            }
            return FixedInterval.fromPositions(startFieldIndex, endFieldIndex);
        }
        else
            return new FixedInterval(0, 0);
    }
    static correctIntervalDueToFieldsCaseSelectionCollapsed(fields, position) {
        const visabilityInfo = FieldVisabilityInfo.getRelativeVisabilityInfo(position, fields);
        for (let i = visabilityInfo.length - 1, fieldInfo; fieldInfo = visabilityInfo[i]; i--) {
            const field = fieldInfo.field;
            if (field.getCodeInterval().containsWithIntervalEnd(position)) {
                if (fieldInfo.showCode)
                    break;
                else
                    position = field.getFieldStartPosition();
            }
            else {
                const fieldResultInterval = field.getResultInterval();
                if (fieldResultInterval.containsWithIntervalEnd(position)) {
                    if (fieldInfo.showResult) {
                        if (position == fieldResultInterval.start)
                            position = field.getFieldStartPosition();
                        else if (position == fieldResultInterval.end)
                            position = field.getFieldEndPosition();
                        break;
                    }
                    else
                        position = field.getFieldEndPosition();
                }
            }
        }
        return position;
    }
    static correctIntervalDueToFields(subDocument, newInterval) {
        const fields = subDocument.fields;
        if (!fields.length)
            return;
        if (!newInterval.length)
            return newInterval.start = Field.correctIntervalDueToFieldsCaseSelectionCollapsed(subDocument.fields, newInterval.start);
        const indexesInterval = Field.correctIntervalDueToFieldsWithoutUiChecks(subDocument, newInterval);
        ListUtils.forEach(fields, (field) => {
            if (field.getResultInterval().equals(newInterval) && !this.isFloatingObjectSelected(subDocument, newInterval))
                newInterval.expand(field.getAllFieldInterval());
        }, indexesInterval.start, indexesInterval.end);
    }
    static isFloatingObjectSelected(subDocument, interval) {
        if (interval.length !== 1)
            return false;
        const run = subDocument.getRunByPosition(interval.start);
        return run && (run.getType() == RunType.AnchoredPictureRun || run.getType() == RunType.AnchoredTextBoxRun);
    }
    static correctWhenPositionInStartCode(fields, position) {
        if (fields.length < 1)
            return position;
        var field = fields[Math.max(0, Field.normedBinaryIndexOf(fields, position))];
        if (field.getResultStartPosition() == position)
            return field.parent ? Field.correctWhenPositionInStartCode(fields, field.getFieldStartPosition()) : field.getFieldStartPosition();
        return position;
    }
    clone(subDocument) {
        const result = new Field(subDocument.positionManager, this.index, this.getFieldStartPosition(), this.getSeparatorPosition(), this.getFieldEndPosition(), this.showCode, this.hyperlinkInfo ? this.hyperlinkInfo.clone() : this.hyperlinkInfo);
        result.sequenceInfo = this.sequenceInfo ? this.sequenceInfo.clone() : this.sequenceInfo;
        result.tcInfo = this.tcInfo ? this.tcInfo.clone() : this.tcInfo;
        result.disableUpdate = this.disableUpdate;
        result.hideByParent = this.hideByParent;
        result.locked = this.locked;
        return result;
    }
}
export class FieldVisabilityInfo {
    constructor(showCode, showResult, field) {
        this.showCode = showCode;
        this.showResult = showResult;
        this.field = field;
    }
    static getRelativeVisabilityInfo(position, fields) {
        var visabilityInfo = [];
        var currFieldIndex = Field.normedBinaryIndexOf(fields, position + 1);
        if (currFieldIndex < 0)
            return [];
        var currField = fields[currFieldIndex];
        do {
            if (currField.getAllFieldIntervalWithoutBorders().containsWithIntervalEnd(position))
                visabilityInfo.unshift(new FieldVisabilityInfo(currField.showCode, !currField.showCode, currField));
        } while (currField = currField.parent);
        var topLevelFieldInfo = visabilityInfo[0];
        for (var i = 1, fieldInfo; fieldInfo = visabilityInfo[i]; i++) {
            FieldVisabilityInfo.applyTopLevelFieldInfoVisabilityToThisFieldInfo(topLevelFieldInfo, fieldInfo);
            topLevelFieldInfo = fieldInfo;
        }
        return visabilityInfo;
    }
    static applyTopLevelFieldInfoVisabilityToThisFieldInfo(topLevelFieldInfo, lowLevelFieldInfo) {
        var topLevelFieldAllowShowThisField = lowLevelFieldInfo.field.isPlacedInCodeAreaTopLevelField(topLevelFieldInfo.field) ? topLevelFieldInfo.showCode : topLevelFieldInfo.showResult;
        lowLevelFieldInfo.showCode = lowLevelFieldInfo.showCode && topLevelFieldAllowShowThisField;
        lowLevelFieldInfo.showResult = lowLevelFieldInfo.showResult && topLevelFieldAllowShowThisField;
    }
    clone() {
        return new FieldVisabilityInfo(this.showCode, this.showResult, this.field);
    }
    copyFrom(obj) {
        this.field = obj.field;
        this.showCode = obj.showCode;
        this.showResult = obj.showResult;
    }
}
