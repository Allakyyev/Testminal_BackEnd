import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleShowHorizontalRulerCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.horizontalRulerControl.getVisible());
    }
    executeCore(_state, options) {
        const visible = this.control.horizontalRulerControl.getVisible();
        if (options.param == visible)
            return false;
        this.control.horizontalRulerControl.setVisible(!visible);
        this.control.owner.adjustControl();
        return true;
    }
    isEnabled(_options) {
        return !this.control.innerClientProperties.viewsSettings.isSimpleView && super.isEnabled(_options);
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
