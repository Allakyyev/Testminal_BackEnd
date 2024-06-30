import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LinkedInterval } from '../../../core/model/position/linked-interval';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { BackspaceCommand } from './backspace-command';
export class DeleteCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        const intervals = ListUtils.map(options.intervalsInfo.intervals, (curr) => new LinkedInterval(subDocument.positionManager, curr));
        this.history.addTransaction(() => {
            for (let selectionInterval of intervals) {
                var removingInterval = selectionInterval.getFixedInterval();
                var isIntervalCollapsed = selectionInterval.length == 0;
                if (isIntervalCollapsed) {
                    const layoutPosition = subDocument.isMain()
                        ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, selectionInterval.start, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(this.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false))
                        : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, selectionInterval.start, this.selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                            .create(new LayoutPositionCreatorConflictFlags().setDefault(this.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
                    layoutPosition.switchToStartNextBoxInRow();
                    removingInterval.start = layoutPosition.getLogPosition();
                    removingInterval.length = 1;
                }
                if (selectionInterval.end === subDocument.getDocumentEndPosition() && removingInterval.length === 1)
                    continue;
                if (isIntervalCollapsed && BackspaceCommand.getIntervalAccordingFields(subDocument, this.selection, removingInterval, true))
                    break;
                if (subDocument.isEditable([removingInterval])) {
                    this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(removingInterval.start)));
                    this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, removingInterval), false, true, !this.control.commandManager.isPublicApiCall);
                }
            }
        });
        ListUtils.forEach(intervals, (curr) => curr.destructor(subDocument.positionManager));
        return true;
    }
}
