import { InsertTextHistoryItem } from '../../../core/model/history/items/insert-text-history-item';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../../core/model/runs/run-type';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { ScrollState } from '../../scroll/model-states';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertTextCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.intervals = [this.selection.lastSelectedInterval.clone()];
    }
    executeCore(_state, options) {
        if (options.param.length === 0)
            return false;
        const interval = options.intervalsInfo.interval;
        if (interval.length > 0 &&
            options.intervalsInfo.subDocInterval.subDocument.getParagraphByPosition(interval.end - 1).getEndPosition() == interval.end)
            options.intervalsInfo.interval.length -= 1;
        this.removedInterval = !!interval.length;
        const canMergeWithPreviousCommand = this.control.commandManager.assertLastExecutedCommandsChain(true, InsertTextCommand);
        if (canMergeWithPreviousCommand && options.intervalsInfo.isCollapsed &&
            this.correctPrevHistoryRun(new InsertTextManipulatorParams(options.intervalsInfo.subDocPosition, this.control.inputPosition.charPropsBundle, RunType.TextRun, options.param))) {
        }
        else
            this.insertTextWithSelection(options.intervalsInfo.subDocInterval, options.param);
        this.control.commandManager.lastTextInsertDate = new Date();
        if (!interval.length)
            this.control.inputPositionModelChangesListener.resetOccurredEvents();
        return true;
    }
    correctPrevHistoryRun(params) {
        const currDate = new Date();
        if (currDate.getTime() - this.control.commandManager.lastTextInsertDate.getTime() < 2.7 * 1000) {
            const insertTextHistoryInfo = this.modelManipulator.text.getLastModifiableHistoryItemNode((hi) => hi instanceof InsertTextHistoryItem);
            const selectionHistoryItem = this.modelManipulator.text.getLastModifiableHistoryItemNode((hi) => hi instanceof SelectionHistoryItem);
            if (insertTextHistoryInfo && selectionHistoryItem) {
                const oldParams = insertTextHistoryInfo.item.params;
                if (oldParams.subDocPos.subDocument.id == params.subDocPos.subDocument.id &&
                    oldParams.subDocPos.position + oldParams.text.length == params.subDocPos.position &&
                    oldParams.charPropsBundle.style.equalsByName(params.charPropsBundle.style) &&
                    oldParams.charPropsBundle.props.equals(params.charPropsBundle.props) &&
                    !selectionHistoryItem.item.newState.intervalsInfo.multiselection &&
                    selectionHistoryItem.item.newState.intervalsInfo.intervals[0].length == 0 &&
                    selectionHistoryItem.item.newState.intervalsInfo.interval.start == params.subDocPos.position) {
                    this.modelManipulator.text.insertTextInner(params);
                    selectionHistoryItem.item.newState.intervalsInfo.interval.start += params.text.length;
                    oldParams.text += params.text;
                    insertTextHistoryInfo.root.item.uniqueId = -1;
                    const newPos = selectionHistoryItem.item.newState.intervalsInfo.interval.start;
                    this.selection.changeState((newState) => newState.setPosition(newPos));
                    this.selection.scrollManager.setScroll(new ScrollState()
                        .byModelPosition(this.selection).setModelPosition(newPos).useStdRelativePosition().useStdOffset());
                    return true;
                }
            }
        }
        return false;
    }
    lockBarHolderUpdate(prevModifiedState) {
        return !this.removedInterval && prevModifiedState === this.control.getModifiedState();
    }
    lockInputPositionUpdating(prevModifiedState) {
        return !this.removedInterval && prevModifiedState === this.control.getModifiedState();
    }
}
