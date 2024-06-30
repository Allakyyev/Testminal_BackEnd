import { RangeCopy } from '../../../core/model/manipulators/range/create-range-copy-operation';
import { ControlOptions, DocumentCapability } from '../../../core/model/options/control';
import { LinkedInterval } from '../../../core/model/position/linked-interval';
import { SubDocumentInterval, SubDocumentPosition } from '../../../core/model/sub-document';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class DragCopyContentCommand extends CommandBase {
    executeCore(_state, options) {
        if (!options.intervalsInfo.intervals.length)
            return false;
        let positionTo = options.param;
        const subDocument = options.subDocument;
        if (!subDocument.isEditable([new FixedInterval(positionTo, 0)]))
            return false;
        if (this.tryCopyIntervalInsideTable(options.intervalsInfo, positionTo))
            return true;
        const intervals = ListUtils.map(options.intervalsInfo.intervals, (curr) => new LinkedInterval(subDocument.positionManager, curr));
        let selectionIntervals = [];
        this.history.addTransaction(() => {
            for (let interval of intervals) {
                const fixedInterval = interval.getFixedInterval();
                this.modelManipulator.range.copyIntervalTo(subDocument, fixedInterval, positionTo);
                selectionIntervals.push(new FixedInterval(positionTo, fixedInterval.length));
                positionTo += fixedInterval.length;
            }
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals(selectionIntervals)));
        });
        ListUtils.forEach(intervals, (curr) => curr.destructor(subDocument.positionManager));
        return true;
    }
    canModify() {
        return true;
    }
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.drag !== DocumentCapability.Hidden && this.control.modelManager.richOptions.control.drop !== DocumentCapability.Hidden;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.drag) && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.drop) &&
            !this.selection.isCollapsed();
    }
    tryCopyIntervalInsideTable(intervalsInfo, positionTo) {
        if (!intervalsInfo.tableInfo.extendedData.numRows)
            return false;
        this.history.addTransaction(() => {
            const newInterval = RangeCopy.create(intervalsInfo.subDocIntervals)
                .insertTo(this.modelManipulator, new SubDocumentPosition(intervalsInfo.subDocument, positionTo));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(newInterval)));
        });
        return true;
    }
}
export class DragMoveContentCommand extends CommandBase {
    executeCore(_state, options) {
        if (!options.intervalsInfo.intervals.length)
            return false;
        let positionTo = options.param;
        if (!this.selection.activeSubDocument.isEditable([new FixedInterval(positionTo, 0)]))
            return false;
        if (this.selection.intervals.length == 1 &&
            this.selection.activeSubDocument.getDocumentEndPosition() - 1 == this.selection.intervals[0].start ||
            !this.selection.activeSubDocument.isEditable(this.selection.intervals))
            return this.control.commandManager.getCommand(RichEditClientCommand.DragCopyContent)
                .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, positionTo));
        let subDocument = this.selection.activeSubDocument;
        const tableInfo = this.selection.tableInfo;
        if (tableInfo.isSelected &&
            tableInfo.extendedData.atLeastOneCellFullySelected(this.selection.intervals) &&
            ListUtils.unsafeAnyOf(tableInfo.extendedData.rows, (rowInfo) => ListUtils.unsafeAnyOf(rowInfo.cells, (cellInfo) => cellInfo.cell.interval.containsWithIntervalEnd(positionTo))))
            return false;
        if (this.tryMoveIntervalInsideTable(options.intervalsInfo, positionTo))
            return true;
        const intervals = ListUtils.map(options.intervalsInfo.intervals, (curr) => new LinkedInterval(subDocument.positionManager, curr));
        let skipIntervalIndex;
        this.history.addTransaction(() => {
            const selectionLinkedIntervals = [];
            skipIntervalIndex = ListUtils.indexBy(intervals, (interval) => interval.start <= positionTo && interval.end >= positionTo);
            if (skipIntervalIndex >= 0)
                positionTo = intervals[skipIntervalIndex].start;
            const skipInterval = intervals[skipIntervalIndex];
            const skipIntervalLength = skipInterval ? skipInterval.length : 0;
            for (let i = 0, interval; interval = intervals[i]; i++) {
                if (i === skipIntervalIndex) {
                    if (intervals.length > 1)
                        selectionLinkedIntervals.push(new LinkedInterval(subDocument.positionManager, new FixedInterval(positionTo, skipIntervalLength)));
                    positionTo += skipIntervalLength;
                    continue;
                }
                const fixedInterval = interval.getFixedInterval();
                this.modelManipulator.range.moveIntervalTo(new SubDocumentInterval(subDocument, fixedInterval), positionTo);
                const selectionStartPosition = fixedInterval.start < positionTo ? positionTo - fixedInterval.length : positionTo;
                const selectionEndPosition = selectionStartPosition + fixedInterval.length;
                selectionLinkedIntervals.push(new LinkedInterval(subDocument.positionManager, new BoundaryInterval(selectionStartPosition, selectionEndPosition)));
                if (positionTo <= fixedInterval.start)
                    positionTo += fixedInterval.length;
            }
            if (selectionLinkedIntervals.length) {
                this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals(ListUtils.map(selectionLinkedIntervals, (curr) => curr.getFixedInterval()))));
                ListUtils.forEach(selectionLinkedIntervals, (curr) => curr.destructor(subDocument.positionManager));
            }
        });
        ListUtils.forEach(intervals, (curr) => curr.destructor(subDocument.positionManager));
        return intervals.length > 1 || skipIntervalIndex === -1;
    }
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.drag !== DocumentCapability.Hidden && this.control.modelManager.richOptions.control.drop !== DocumentCapability.Hidden;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.drag) && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.drop) && !this.selection.isCollapsed();
    }
    tryMoveIntervalInsideTable(intervalsInfo, positionTo) {
        if (!intervalsInfo.tableInfo.extendedData.numRows)
            return false;
        const subDocument = intervalsInfo.subDocument;
        const linkedIntervals = ListUtils.map(intervalsInfo.intervals, (curr) => new LinkedInterval(intervalsInfo.subDocument.positionManager, curr));
        this.history.addTransaction(() => {
            const newInterval = new LinkedInterval(subDocument.positionManager, RangeCopy.create(intervalsInfo.subDocIntervals)
                .insertTo(this.modelManipulator, new SubDocumentPosition(subDocument, positionTo)));
            ListUtils.forEach(linkedIntervals, (curr) => {
                this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, curr.getFixedInterval()), true, false);
                curr.destructor(subDocument.positionManager);
            });
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(newInterval.getFixedInterval()).setEndOfLine(true)));
            newInterval.destructor(subDocument.positionManager);
        });
        return true;
    }
    canModify() {
        return true;
    }
}
