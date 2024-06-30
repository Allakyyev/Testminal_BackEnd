import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SelectionCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
