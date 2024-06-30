import { Field, FieldVisabilityInfo } from '../../../core/model/fields/field';
import { FieldContextMenuHelper } from '../../../core/model/fields/field-context-menu-helper';
import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleFieldCodesCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = FieldContextMenuHelper.showUpdateAndToogleCodeItems(this.selection.activeSubDocument.fields, this.selection.intervals);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, options) {
        const parameter = options.param;
        var selection = this.selection;
        var subDocument = options.subDocument;
        var fields = subDocument.fields;
        var intervals = options.intervalsInfo.intervals;
        let toggleMode = typeof options.param !== 'boolean';
        var commandExecuted = false;
        for (var intervalIndex = 0, interval; interval = intervals[intervalIndex]; intervalIndex++) {
            if (interval.length == 0) {
                var fieldVisabilityInfo = FieldVisabilityInfo.getRelativeVisabilityInfo(interval.start, fields);
                for (var infoIndex = fieldVisabilityInfo.length - 1, info; info = fieldVisabilityInfo[infoIndex]; infoIndex--) {
                    var field = info.field;
                    var newSelectionStartPos = -1;
                    if (info.showResult && (parameter === true || toggleMode)) {
                        field.showCode = true;
                        newSelectionStartPos = field.getCodeStartPosition();
                    }
                    else if (info.showCode && (parameter === false || toggleMode)) {
                        field.showCode = false;
                        newSelectionStartPos = field.getFieldStartPosition();
                    }
                    if (newSelectionStartPos >= 0) {
                        this.control.layoutFormatterManager.invalidator.onIntervalChanged(subDocument.id, field.getAllFieldInterval());
                        if (subDocument == this.selection.activeSubDocument)
                            selection.deprecatedSetSelection(newSelectionStartPos, newSelectionStartPos, selection.endOfLine, -1, true);
                        commandExecuted = true;
                        break;
                    }
                }
                if (fieldVisabilityInfo.length == 0) {
                    var fieldIndex = Field.normedBinaryIndexOf(fields, interval.start + 1);
                    if (fieldIndex >= 0) {
                        var field = fields[fieldIndex];
                        if (!field.parent && field.getFieldStartPosition() == interval.start && (toggleMode || field.showCode !== parameter)) {
                            field.showCode = !field.showCode;
                            this.control.layoutFormatterManager.invalidator.onIntervalChanged(subDocument.id, field.getAllFieldInterval());
                            if (subDocument == this.selection.activeSubDocument)
                                selection.deprecatedSetSelection(field.getFieldStartPosition(), field.getFieldStartPosition(), selection.endOfLine, -1, true);
                            commandExecuted = true;
                        }
                    }
                }
            }
            else {
                var intervalEnd = interval.end;
                var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, interval.start + 1));
                var field = fields[fieldIndex];
                while (field.parent) {
                    if (interval.start < field.getFieldStartPosition() || field.getFieldEndPosition() <= interval.start)
                        field = field.parent;
                    else
                        break;
                }
                fieldIndex = field.index;
                var needSetState = toggleMode ? !field.showCode : parameter;
                if (field.showCode !== needSetState) {
                    field.showCode = needSetState;
                    this.control.layoutFormatterManager.invalidator.onIntervalChanged(subDocument.id, field.getAllFieldInterval());
                    commandExecuted = true;
                    if (field.getFieldStartPosition() != interval.start && field.getAllFieldInterval().containsWithIntervalEnd(interval.start)) {
                        var newSelectionPos = needSetState ? field.getCodeStartPosition() : field.getFieldStartPosition();
                        if (subDocument == this.selection.activeSubDocument)
                            selection.deprecatedSetSelection(newSelectionPos, newSelectionPos, selection.endOfLine, -1, true);
                    }
                }
                for (fieldIndex++; field = fields[fieldIndex]; fieldIndex++) {
                    if (field.getFieldStartPosition() >= intervalEnd)
                        break;
                    if (field.getFieldEndPosition() <= interval.start)
                        continue;
                    if (field.showCode !== needSetState) {
                        field.showCode = needSetState;
                        this.control.layoutFormatterManager.invalidator.onIntervalChanged(subDocument.id, field.getAllFieldInterval());
                        commandExecuted = true;
                    }
                }
            }
        }
        return commandExecuted;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
