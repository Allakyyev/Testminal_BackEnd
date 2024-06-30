import { FieldContextMenuHelper } from '../../../core/model/fields/field-context-menu-helper';
import { UpdateFieldsOptions } from '../../../core/model/fields/tree-creator';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentIntervals } from '../../../core/model/sub-document';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { FieldCommandHelper } from './field-command-helper';
import { UpdateFieldCommandBase } from './update-field-command-base';
export class UpdateFieldCommandParameters {
    constructor(subDocument, intervals, callbackFunc) {
        this.options = new UpdateFieldsOptions();
        this.subDocument = subDocument;
        this.intervals = intervals;
        this.callbackFunc = callbackFunc;
    }
}
export class UpdateFieldCommand extends UpdateFieldCommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = FieldContextMenuHelper.showUpdateAndToogleCodeItems(this.selection.activeSubDocument.fields, this.selection.intervals);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, options) {
        let param = options.param;
        if (!param) {
            let intervalsForUpdate = this.selection.intervals;
            let callback = null;
            const tocField = FieldCommandHelper.findTocFieldBySelection(this.selection.activeSubDocument, this.selection);
            if (tocField) {
                intervalsForUpdate = IntervalAlgorithms.getMergedIntervals(intervalsForUpdate.concat(tocField.getAllFieldInterval()), true);
                callback = () => {
                    this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(tocField.getFieldStartPosition())));
                };
            }
            param = new UpdateFieldCommandParameters(this.selection.activeSubDocument, intervalsForUpdate, callback);
        }
        const floatingState = this.selection.getFloatingState();
        return UpdateFieldCommandBase.updateFields(this, [new SubDocumentIntervals(param.subDocument, param.intervals)], () => {
            const selState = floatingState.finalize();
            this.selection.setState(selState);
            if (param.callbackFunc)
                param.callbackFunc();
        }, param.options);
    }
}
