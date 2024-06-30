import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ContextItemFloatingObjects extends CommandBase {
    getState() {
        const specialRunInfo = this.selection.specialRunInfo;
        const state = new SimpleCommandState(!this.selection.activeSubDocument.isTextBox(), false);
        state.visible = specialRunInfo.isSelected() && state.enabled &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
        return state;
    }
    canModify() {
        return true;
    }
    executeCore(_state, _parameter) {
        return false;
    }
}
export class ChangeFloatingObjectTextWrapTypeMenu extends ContextItemFloatingObjects {
}
export class FloatingObjectBringForwardMenu extends ContextItemFloatingObjects {
}
export class FloatingObjectSendBackwardMenu extends ContextItemFloatingObjects {
}
