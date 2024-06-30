import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleShowTableGridLinesCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.innerClientProperties.showTableGridLines);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return typeof parameter === 'boolean' ? parameter : !this.control.innerClientProperties.showTableGridLines;
    }
    executeCore(_state, options) {
        if (options.param !== this.control.innerClientProperties.showTableGridLines) {
            this.control.innerClientProperties.showTableGridLines = options.param;
            this.control.layoutFormatterManager.invalidator.onChangedAllLayout();
            return true;
        }
        return false;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
