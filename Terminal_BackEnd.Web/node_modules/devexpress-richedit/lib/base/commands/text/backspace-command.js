import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Field } from '../../../core/model/fields/field';
import { RemoveParagraphFromListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ParagraphAlignmentHistoryItem, ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ParagraphAlignment, ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class BackspaceCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        const selection = this.selection;
        let interval = selection.lastSelectedInterval.clone();
        const rawData = this.selection.tableInfo.rawData;
        if (rawData.areCellsSelectedInSeries && rawData.atLeastOneCellFullySelected(selection.intervals)) {
            const command = this.control.commandManager.getCommand(RichEditClientCommand.DeleteTableCellsByBackspace);
            if (command.getState().enabled)
                return command.execute(this.control.commandManager.isPublicApiCall);
        }
        const isIntervalCollapsed = interval.length == 0;
        const subDocument = this.selection.activeSubDocument;
        if (isIntervalCollapsed) {
            if (this.tryChangeParagraphAlignOrIndent(interval))
                return true;
            const layoutPosition = subDocument.isMain()
                ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, interval.start, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true))
                : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, interval.start, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                    .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true));
            interval.start = layoutPosition.getLogPosition() - 1;
            const firstPagePosition = subDocument.isMain() ?
                this.control.layout.pages[0].getPosition() :
                layoutPosition.pageArea.pageOffset;
            if (interval.start < firstPagePosition)
                return false;
            if (interval.start === firstPagePosition &&
                EnumUtils.isAnyOf(subDocument.getRunByPosition(interval.start).getType(), RunType.AnchoredPictureRun, RunType.AnchoredTextBoxRun))
                return false;
            interval.length = 1;
        }
        if (interval.end == this.selection.activeSubDocument.getDocumentEndPosition() && interval.length === 1)
            return false;
        if (isIntervalCollapsed &&
            BackspaceCommand.getIntervalAccordingFields(this.selection.activeSubDocument, this.selection, interval, true))
            return true;
        if (this.selection.activeSubDocument.isEditable([interval])) {
            this.history.beginTransaction();
            this.addSelectionBefore();
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, interval), false, true, !this.control.commandManager.isPublicApiCall);
            this.addSelectionAfter(interval.start);
            this.history.endTransaction();
            return true;
        }
        else
            return false;
    }
    beforeExecute() {
        var _a;
        (_a = this.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.beginUpdate();
        this.control.inputPosition.reset();
        this._inputPositionCharProps = this.control.inputPosition.getAllCharacterProperties();
        this._inputPositionParagraphProps = this.control.inputPosition.getAllParagraphProperties();
    }
    afterExecute() {
        var _a;
        this.control.inputPosition.applyAllCharacterProperties(this._inputPositionCharProps, true);
        this.control.inputPosition.applyAllParagraphProperties(this._inputPositionParagraphProps);
        (_a = this.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.endUpdate();
    }
    tryChangeParagraphAlignOrIndent(interval) {
        const pars = this.selection.activeSubDocument.paragraphs;
        const parIndex = SearchUtils.normedInterpolationIndexOf(pars, p => p.startLogPosition.value, interval.start);
        const par = pars[parIndex];
        return interval.start === par.startLogPosition.value && this.selection.activeSubDocument.isEditable([par.interval]) &&
            (this.tryChangeParagraphAlign(par) || this.tryDeleteList(par, parIndex) || this.tryChangeParagraphIndent(par));
    }
    tryChangeParagraphAlign(par) {
        const parProps = par.getParagraphMergedProperties();
        const alignIsRight = parProps.alignment == ParagraphAlignment.Right;
        if (!alignIsRight && parProps.alignment != ParagraphAlignment.Center)
            return false;
        this.history.addAndRedo(new ParagraphAlignmentHistoryItem(this.modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, par.interval), alignIsRight ? ParagraphAlignment.Center : ParagraphAlignment.Left, true));
        return true;
    }
    tryDeleteList(par, parIndex) {
        if (!par.isInList())
            return false;
        const oldLeftIndent = par.getParagraphMergedProperties().leftIndent;
        this.history.beginTransaction();
        this.history.addAndRedo(new RemoveParagraphFromListHistoryItem(this.modelManipulator, this.selection.activeSubDocument, parIndex));
        if (oldLeftIndent != par.getParagraphMergedProperties().leftIndent) {
            this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, par.interval), oldLeftIndent, true));
        }
        this.history.endTransaction();
        return true;
    }
    tryChangeParagraphIndent(par) {
        const history = this.history;
        const parInterval = par.interval;
        const parProps = par.getParagraphMergedProperties();
        const subDocument = this.selection.activeSubDocument;
        let indentsChanged = false;
        history.beginTransaction();
        if (parProps.leftIndent > 0) {
            history.addAndRedo(new ParagraphLeftIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, parInterval), 0, true));
            indentsChanged = true;
        }
        if (parProps.firstLineIndent > 0) {
            history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, parInterval), 0, true));
            indentsChanged = true;
        }
        if (parProps.firstLineIndentType !== ParagraphFirstLineIndent.None) {
            history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, parInterval), ParagraphFirstLineIndent.None, true));
            indentsChanged = true;
        }
        history.endTransaction();
        return indentsChanged;
    }
    static getIntervalAccordingFields(subDocument, selection, removingInterval, selectInterval) {
        const newRemovingInterval = removingInterval.clone();
        Field.correctIntervalDueToFields(subDocument, newRemovingInterval);
        if (removingInterval.equals(newRemovingInterval))
            return null;
        if (selectInterval)
            selection.deprecatedSetSelection(newRemovingInterval.start, newRemovingInterval.end, selection.endOfLine, selection.keepX, true);
        return newRemovingInterval;
    }
}
