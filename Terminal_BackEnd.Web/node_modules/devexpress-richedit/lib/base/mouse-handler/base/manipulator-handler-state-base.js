import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class ManipulatorHandlerStateBase {
    constructor(handler) {
        this.handler = handler;
    }
    start() { }
    finish() { }
    dispose() { }
    resizeRotationChecker(action) {
        const activeSubDocument = this.handler.control.selection.activeSubDocument;
        const specRunInfo = this.handler.control.selection.specialRunInfo;
        const subDoc = activeSubDocument.isTextBox() ?
            specRunInfo.getParentSubDocument() :
            activeSubDocument;
        const intervals = activeSubDocument.isTextBox() ?
            [new FixedInterval(specRunInfo.getTextBoxPosition(), 1)] :
            this.handler.control.selection.intervals;
        if (subDoc.isEditable(intervals)) {
            if (!this.handler.control.isReadOnlyPersistent)
                action();
            return true;
        }
        return false;
    }
}
