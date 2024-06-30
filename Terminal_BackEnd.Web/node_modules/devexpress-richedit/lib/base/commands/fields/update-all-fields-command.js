import { UpdateFieldsOptions } from '../../../core/model/fields/tree-creator';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentIntervals } from '../../../core/model/sub-document';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SimpleCommandState } from '../command-states';
import { UpdateFieldCommandBase } from './update-field-command-base';
export class UpdateAllFieldsCommand extends UpdateFieldCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, options) {
        const subDocsInfo = NumberMapUtils.toListBy(this.modelManipulator.model.subDocuments, (sd) => new SubDocumentIntervals(sd, [sd.interval]));
        const floatingState = this.selection.getFloatingState();
        return UpdateFieldCommandBase.updateFields(this, subDocsInfo, () => {
            const selState = floatingState.finalize();
            this.selection.setState(selState);
            if (options.param)
                options.param();
        }, new UpdateFieldsOptions());
    }
}
