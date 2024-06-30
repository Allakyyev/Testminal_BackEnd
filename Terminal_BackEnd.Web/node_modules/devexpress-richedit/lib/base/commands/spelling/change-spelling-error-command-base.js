import { Field } from '../../../core/model/fields/field';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../../core/model/runs/run-type';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SpellingCommandBase } from './spelling-command-base';
export class ChangeSpellingErrorCommandBase extends SpellingCommandBase {
    changeSpellingError(options, firstPosition, length) {
        const expandedInterval = new FixedInterval(firstPosition, length);
        Field.correctIntervalDueToFieldsWithoutUiChecks(options.intervalsInfo.subDocInterval.subDocument, expandedInterval);
        options.intervalsInfo.interval = expandedInterval;
        this.history.beginTransaction();
        this.modelManipulator.range.removeInterval(options.intervalsInfo.subDocInterval, true, false);
        const insertResult = this.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(options.intervalsInfo.subDocPosition, this.inputPosition.charPropsBundle, RunType.TextRun, options.param));
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(insertResult.insertedInterval.end).setEndOfLine(true)));
        this.history.endTransaction();
    }
}
