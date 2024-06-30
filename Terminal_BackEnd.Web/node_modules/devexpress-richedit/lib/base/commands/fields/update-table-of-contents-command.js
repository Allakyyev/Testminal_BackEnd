import { ControlOptions } from '../../../core/model/options/control';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { IntervalCommandState } from '../command-states';
import { FieldCommandHelper } from './field-command-helper';
import { UpdateFieldCommandParameters } from './update-field-command';
export class UpdateTableOfContentsCommand extends CommandBase {
    getState() {
        return new IntervalCommandState(this.isEnabled(), this.selection.lastSelectedInterval);
    }
    isEnabled() {
        const tocField = FieldCommandHelper.findTocFieldBySelection(this.selection.activeSubDocument, this.selection);
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) && tocField != null;
    }
    executeCore(_state, _options) {
        const subDocument = this.selection.activeSubDocument;
        const tocField = FieldCommandHelper.findTocFieldBySelection(subDocument, this.selection);
        if (!tocField)
            return false;
        this.history.beginTransaction();
        const updateParams = new UpdateFieldCommandParameters(subDocument, [tocField.getAllFieldInterval()], () => {
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(tocField.getFieldStartPosition()).setEndOfLine(false)));
        });
        updateParams.options.updateFillIn = false;
        const result = this.control.commandManager.getCommand(RichEditClientCommand.UpdateField)
            .execute(this.control.commandManager.isPublicApiCall, updateParams);
        this.history.endTransaction();
        return result;
    }
}
