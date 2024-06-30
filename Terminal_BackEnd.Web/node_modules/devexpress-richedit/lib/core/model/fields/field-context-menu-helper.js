import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { ModelIterator } from '../model-iterator';
import { RunType } from '../runs/run-type';
import { Field } from './field';
export class FieldContextMenuHelper {
    static getHyperlinkResultText(subDocument, field) {
        var result = "";
        var iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(field.getResultStartPosition());
        var currFieldIndex = field.index;
        var fields = subDocument.fields;
        do {
            if (iterator.getAbsolutePosition() >= field.getResultEndPosition())
                break;
            switch (iterator.run.getType()) {
                case RunType.FieldCodeStartRun:
                    currFieldIndex++;
                    iterator.setPosition(fields[currFieldIndex].getResultStartPosition());
                    continue;
                case RunType.FieldResultEndRun:
                    iterator.setPosition(fields[currFieldIndex].getFieldEndPosition());
                    continue;
                case RunType.TextRun:
                    result += iterator.chunk.getRunText(iterator.run);
            }
        } while (iterator.moveToNextRun());
        return result;
    }
    static canChangeHyperlinkDisplayText(subDocInterval) {
        var iterator = new ModelIterator(subDocInterval.subDocument, false);
        iterator.setPosition(subDocInterval.interval.start);
        do {
            if (iterator.getAbsolutePosition() >= subDocInterval.interval.end)
                break;
            const runType = iterator.run.getType();
            if (runType == RunType.InlinePictureRun ||
                runType == RunType.AnchoredPictureRun ||
                runType == RunType.AnchoredTextBoxRun ||
                runType == RunType.InlineTextBoxRun)
                return false;
        } while (iterator.moveToNextRun());
        return true;
    }
    static showUpdateAndToogleCodeItems(fields, intervals) {
        if (fields.length == 0)
            return false;
        for (var intervalIndex = 0, interval; interval = intervals[intervalIndex]; intervalIndex++) {
            var intervalEnd = interval.end;
            var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, interval.start + 1));
            var field = fields[fieldIndex].getAbsolutelyTopLevelField();
            var topLevelField = field;
            for (fieldIndex = field.index; field = fields[fieldIndex]; fieldIndex++) {
                if (field.showCode ? field.getSeparatorPosition() < interval.start : field.getResultEndPosition() < interval.start)
                    continue;
                if (field.showCode ? field.getFieldStartPosition() >= intervalEnd : field.getResultStartPosition() > intervalEnd)
                    break;
                return true;
            }
            if (topLevelField.getFieldStartPosition() == interval.start)
                return true;
        }
        return false;
    }
    static showCreateHyperlinkItem(fields, interval) {
        if (fields.length == 0)
            return true;
        var intervalEnd = interval.end;
        var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, interval.start + 1));
        var field = fields[fieldIndex].getAbsolutelyTopLevelField();
        for (fieldIndex = field.index; field = fields[fieldIndex]; fieldIndex++) {
            if (field.getFieldStartPosition() >= intervalEnd)
                break;
            if (field.getFieldEndPosition() <= interval.start)
                continue;
            return false;
        }
        return true;
    }
    static showHyperlinkItems(fields, interval) {
        return this.getHyperlinkFieldCore(fields, interval, (field) => field.getAllFieldInterval());
    }
    static getHyperlinkField(fields, interval) {
        return this.getHyperlinkFieldCore(fields, interval, (field) => field.getAllFieldIntervalWithoutBorders());
    }
    static getHyperlinkFieldCore(fields, interval, fieldIntervalGetter) {
        if (fields.length == 0)
            return null;
        var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, interval.start + 1));
        var field = fields[fieldIndex];
        if (interval.length == 0) {
            do {
                if (fieldIntervalGetter(field).containsWithIntervalEnd(interval.start))
                    return field.isHyperlinkField() ? field : null;
                field = field.parent;
            } while (field);
            return null;
        }
        if (IntervalAlgorithms.getIntersection(fieldIntervalGetter(field), interval))
            return FieldContextMenuHelper.getFinalResult(fields, interval, field);
        var parent = field.parent;
        if (parent) {
            if (IntervalAlgorithms.getIntersection(fieldIntervalGetter(parent), interval))
                return FieldContextMenuHelper.getFinalResult(fields, interval, parent);
            else {
                field = FieldContextMenuHelper.getNextTopLevelField(fields, field.index);
                if (!field)
                    return null;
                return IntervalAlgorithms.getIntersection(fieldIntervalGetter(field), interval) ? FieldContextMenuHelper.getFinalResult(fields, interval, field) : null;
            }
        }
        if (interval.start <= field.getFieldStartPosition())
            return null;
        field = FieldContextMenuHelper.getNextTopLevelField(fields, field.index);
        if (!field)
            return null;
        return IntervalAlgorithms.getIntersection(fieldIntervalGetter(field), interval) ? FieldContextMenuHelper.getFinalResult(fields, interval, field) : null;
    }
    static getNextTopLevelField(fields, fieldIndex) {
        var field;
        for (fieldIndex++; field = fields[fieldIndex]; fieldIndex++)
            if (!field.parent)
                break;
        return field;
    }
    static getFinalResult(fields, interval, field) {
        if (!field)
            return null;
        if (!field.isHyperlinkField())
            return null;
        var nextTopLevelField = FieldContextMenuHelper.getNextTopLevelField(fields, field.index);
        if (nextTopLevelField && nextTopLevelField.getCodeStartPosition() <= interval.end)
            return null;
        return field;
    }
}
