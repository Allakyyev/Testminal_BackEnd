import { ScrollState } from '../../scroll/model-states';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleShowHiddenSymbolsCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.innerClientProperties.showHiddenSymbols);
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return typeof parameter === 'boolean' ? parameter : !this.control.innerClientProperties.showHiddenSymbols;
    }
    executeCore(_state, options) {
        let newValue = options.param;
        if (newValue !== this.control.innerClientProperties.showHiddenSymbols) {
            this.control.innerClientProperties.showHiddenSymbols = newValue;
            const topInfo = this.control.viewManager.canvasManager.getScrollTopInfo();
            this.control.layoutFormatterManager.invalidator.onChangedAllLayout();
            this.selection.scrollManager.setScroll(new ScrollState().byScrollInfo.setPageInfo(topInfo));
            return true;
        }
        return false;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
