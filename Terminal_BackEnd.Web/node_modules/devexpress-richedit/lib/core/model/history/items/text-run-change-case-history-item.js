import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class ChangeCaseHistoryItemBase extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, selection, layoutFormatterManager) {
        super(modelManipulator, subDocInterval);
        this.layoutFormatterManager = layoutFormatterManager;
        this.selection = selection;
    }
    undo() {
        this.modelManipulator.textCase.applyBufferState(this.boundSubDocument, this.oldState);
    }
}
export class UpperCaseHistoryItem extends ChangeCaseHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.textCase.applyUpperCase(this.layoutFormatterManager, this.selection, this.boundSubDocument, this.interval);
    }
}
export class LowerCaseHistoryItem extends ChangeCaseHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.textCase.applyLowerCase(this.layoutFormatterManager, this.selection, this.boundSubDocument, this.interval);
    }
}
export class CapitalizeEachWordCaseHistoryItem extends ChangeCaseHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.textCase.applyCapitalizeEachWordCase(this.layoutFormatterManager, this.selection, this.boundSubDocument, this.interval);
    }
}
export class ToggleCaseHistoryItem extends ChangeCaseHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.textCase.applyToggleCase(this.layoutFormatterManager, this.selection, this.boundSubDocument, this.interval);
    }
}
export class SentenceCaseHistoryItem extends ChangeCaseHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.textCase.applySentenceCase(this.layoutFormatterManager, this.selection, this.boundSubDocument, this.interval);
    }
}
