import { ControlOptions } from '../../../core/model/options/control';
import { RichUtils } from '../../../core/model/rich-utils';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeIndentCommandBase extends CommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = ControlOptions.isVisible(this.control.modelManager.richOptions.control.paragraphFormatting) && !this.selection.specialRunInfo.isPictureSelected();
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphFormatting);
    }
    executeCore(_state, options) {
        var paragraphIndices = options.subDocument.getParagraphIndicesByIntervals(options.intervalsInfo.intervals);
        const commandId = this.shouldProcessAsNumberingParagraphs(paragraphIndices, options.subDocument) ?
            this.processNumberingIndentsCommandId() :
            this.processParagraphIndentsCommandId();
        return this.control.commandManager.getCommand(commandId).execute(this.control.commandManager.isPublicApiCall, options);
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    shouldProcessAsNumberingParagraphs(paragraphIndices, subDocument) {
        var abstractNumberingListIndex = subDocument.paragraphs[paragraphIndices[0]].getAbstractNumberingListIndex();
        if (abstractNumberingListIndex < 0)
            return false;
        let paragraphIndicesLength = paragraphIndices.length;
        for (let i = 1; i < paragraphIndicesLength; i++) {
            let paragraphIndex = paragraphIndices[i];
            if (subDocument.paragraphs[paragraphIndex].getAbstractNumberingListIndex() !== abstractNumberingListIndex)
                return false;
        }
        return true;
    }
}
export class DecrementIndentCommand extends ChangeIndentCommandBase {
    processParagraphIndentsCommandId() {
        return RichEditClientCommand.DecrementParagraphLeftIndent;
    }
    processNumberingIndentsCommandId() {
        return RichEditClientCommand.DecrementNumberingIndent;
    }
}
export class IncrementIndentCommand extends ChangeIndentCommandBase {
    processParagraphIndentsCommandId() {
        return RichEditClientCommand.IncrementParagraphLeftIndent;
    }
    processNumberingIndentsCommandId() {
        return RichEditClientCommand.IncrementNumberingIndent;
    }
}
