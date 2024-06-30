import { Field } from '../../../core/model/fields/field';
import { RemoveHyperlinkHistoryItem } from '../../../core/model/history/items/remove-hyperlink-history-item';
import { ControlOptions } from '../../../core/model/options/control';
import { LinkedInterval } from '../../../core/model/position/linked-interval';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class RemoveHyperlinksCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.hyperlinks);
    }
    executeCore(_state, options) {
        var subDocument = options.subDocument;
        var fields = subDocument.fields;
        if (fields.length < 1)
            return false;
        var history = this.history;
        var interval = options.intervalsInfo.interval;
        var fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, interval.start));
        var field = fields[fieldIndex].getAbsolutelyTopLevelField();
        var linkedInterval = new LinkedInterval(subDocument.positionManager, interval);
        history.addTransaction(() => {
            for (fieldIndex = field.index; (field = fields[fieldIndex]) && field.getFieldStartPosition() < linkedInterval.end;) {
                if (field.getHyperlinkInfo() && IntervalAlgorithms.getIntersection(FixedInterval.fromPositions(field.getCodeStartPosition(), field.getResultEndPosition()), interval))
                    history.addAndRedo(new RemoveHyperlinkHistoryItem(this.modelManipulator, subDocument, field));
                else
                    fieldIndex++;
            }
        });
        this.selection.correctAfterTextBufferChanged();
        linkedInterval.destructor(subDocument.positionManager);
        return true;
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.interval = this.selection.lastSelectedInterval;
    }
}
