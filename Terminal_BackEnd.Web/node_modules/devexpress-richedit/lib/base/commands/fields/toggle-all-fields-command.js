import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { IntervalCommandState } from '../command-states';
export class ToggleAllFieldsCommand extends CommandBase {
    getState() {
        return new IntervalCommandState(this.isEnabled(), this.selection.lastSelectedInterval);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        var subDocumentsList = [subDocument];
        var atLeastExistOneField = false;
        for (var subDocumentIndex = 0, currSubDoc; currSubDoc = subDocumentsList[subDocumentIndex]; subDocumentIndex++) {
            var fields = currSubDoc.fields;
            if (fields.length > 0)
                atLeastExistOneField = true;
            for (var fieldIndex = 0, field; field = fields[fieldIndex]; fieldIndex++)
                if (field.showCode) {
                    this.control.commandManager.getCommand(RichEditClientCommand.ShowAllFieldResults)
                        .execute(this.control.commandManager.isPublicApiCall, options);
                    return true;
                }
        }
        if (atLeastExistOneField) {
            this.control.commandManager.getCommand(RichEditClientCommand.ShowAllFieldCodes)
                .execute(this.control.commandManager.isPublicApiCall, options);
            return true;
        }
        return false;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
