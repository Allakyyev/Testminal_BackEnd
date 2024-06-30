import { AnchorInfoPropertyHistoryItem } from '../../../core/model/history/items/floating-objects/anchor-info-property-history-item';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class FloatingObjectBringForwardBackwardCommandBase extends CommandBase {
    isBehindDoc() {
        throw new Error(Errors.NotImplemented);
    }
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() && specialRunInfo.isSelectedAnchorObject &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    executeCore(_state, _parameter) {
        const modelManipulator = this.modelManipulator;
        const parentSubDocument = this.selection.specialRunInfo.getParentSubDocument();
        const runPosition = this.selection.specialRunInfo.getPosition();
        const run = parentSubDocument.getRunByPosition(runPosition);
        if (run && run.anchorInfo.isBehindDoc != this.isBehindDoc())
            this.history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(parentSubDocument, new FixedInterval(runPosition, 1)), this.isBehindDoc(), modelManipulator.floatingObject.anchorInfo.isBehindDoc));
        return true;
    }
}
export class FloatingObjectBringForwardCommand extends FloatingObjectBringForwardBackwardCommandBase {
    executeCore(_state, _parameter) {
        return this.modelManipulator.floatingObject.zOrder.bringForward(this.control.modelManager, this.selection.specialRunInfo.getParentSubDocument(), this.selection.specialRunInfo.getPosition());
    }
}
export class FloatingObjectBringToFrontCommand extends FloatingObjectBringForwardBackwardCommandBase {
    executeCore(_state, _parameter) {
        return this.modelManipulator.floatingObject.zOrder.bringToFront(this.control.modelManager, this.selection.specialRunInfo.getParentSubDocument(), this.selection.specialRunInfo.getPosition());
    }
}
export class FloatingObjectSendBackwardCommand extends FloatingObjectBringForwardBackwardCommandBase {
    executeCore(_state, _parameter) {
        return this.modelManipulator.floatingObject.zOrder.sendBackward(this.control.modelManager, this.selection.specialRunInfo.getParentSubDocument(), this.selection.specialRunInfo.getPosition());
    }
}
export class FloatingObjectSendToBackCommand extends FloatingObjectBringForwardBackwardCommandBase {
    executeCore(_state, _parameter) {
        return this.modelManipulator.floatingObject.zOrder.sendToBack(this.control.modelManager, this.selection.specialRunInfo.getParentSubDocument(), this.selection.specialRunInfo.getPosition());
    }
}
export class FloatingObjectBringInFrontOfTextCommand extends FloatingObjectBringForwardBackwardCommandBase {
    isBehindDoc() {
        return false;
    }
}
export class FloatingObjectSendBehindTextCommand extends FloatingObjectBringForwardBackwardCommandBase {
    isBehindDoc() {
        return true;
    }
}
