import { RemoveParagraphFromListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ShiftTableStartPositionToTheRightHistoryItem } from '../../../core/model/history/items/tables/change-table-cell-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertParagraphCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphs);
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        const interval = options.intervalsInfo.interval;
        this.lock = interval.length == 0;
        if (this.tryInsertParagraphBeforeTable(interval, subDocument))
            return true;
        const paragraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, p => p.startLogPosition.value, interval.start);
        const paragraph = subDocument.paragraphs[paragraphIndex];
        if (interval.length === 0 || interval.start === 1) {
            if (paragraph.startLogPosition.value === interval.start && paragraph.isInList() && paragraph.length === 1 &&
                subDocument.isEditable([paragraph.interval])) {
                this.lock = false;
                this.history.addAndRedo(new RemoveParagraphFromListHistoryItem(this.modelManipulator, subDocument, paragraphIndex));
                return true;
            }
        }
        let inpPosCharProps = this.lock && interval.start == paragraph.getEndPosition() - 1 ?
            this.inputPosition.getAllCharacterProperties() :
            null;
        this.history.addTransaction(() => {
            this.addSelectionBefore();
            const resutInterval = CommandBase.replaceTextByParagraph(this.control.modelManager, this.inputPosition, options.intervalsInfo.subDocInterval);
            this.addSelectionAfter(resutInterval.end, (newState) => newState.setEndOfLine(false));
        });
        if (inpPosCharProps) {
            this.inputPosition.applyAllCharacterProperties(inpPosCharProps);
            this.control.selectionModelChangesListener.resetOccurredEvents();
        }
        if (this.lock)
            this.control.inputPositionModelChangesListener.resetOccurredEvents();
        return true;
    }
    lockBarHolderUpdate(prevModifiedState) {
        return this.lock && prevModifiedState === this.control.getModifiedState();
    }
    lockInputPositionUpdating() {
        return this.lock;
    }
    tryInsertParagraphBeforeTable(interval, subDocument) {
        if (interval.start > 0 || interval.length > 0)
            return false;
        let firstTable = subDocument.tables[0];
        if (firstTable && firstTable.getStartPosition() === 0) {
            this.history.addTransaction(() => {
                this.modelManipulator.table.insertParagraphToTheCellStartAndShiftContent(subDocument, firstTable.rows[0].cells[0], this.inputPosition);
                this.history.addAndRedo(new ShiftTableStartPositionToTheRightHistoryItem(this.modelManipulator, subDocument, firstTable.index));
            });
            return true;
        }
    }
}
