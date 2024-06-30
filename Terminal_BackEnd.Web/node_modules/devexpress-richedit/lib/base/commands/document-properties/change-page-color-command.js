import { ColorHelper } from '../../../core/model/color/color';
import { PageColorHistoryItem } from '../../../core/model/history/items/document-properties-history-items';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangePageColorCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.value = this.control.modelManager.model.pageBackColor;
        state.denyUpdateValue = true;
        return state;
    }
    executeCore(_state, parameter) {
        var newColor = parameter.param;
        if (newColor != this.control.modelManager.model.pageBackColor) {
            this.history.addAndRedo(new PageColorHistoryItem(this.modelManipulator, newColor));
            return true;
        }
        return false;
    }
    isEnabled() {
        return super.isEnabled() && !this.control.modelManager.model.isDocumentProtectionEnabled;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR);
    }
}
