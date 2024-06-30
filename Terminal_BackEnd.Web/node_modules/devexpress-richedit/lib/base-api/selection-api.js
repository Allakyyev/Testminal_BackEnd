import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { RichEditClientCommand } from '../base/commands/client-command';
import { ScrollState } from '../base/scroll/model-states';
import { SetSelectionStateOptions } from '../base/selection/selection';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { getRestrictedInterval } from '../model-api/api-utils/api-utils';
import { ModelParametersChecker } from '../model-api/api-utils/model-parameter-checker';
import { IntervalApi } from '../model-api/interval';
import { SubDocumentBaseApi } from './sub-document';
export class RichEditSelectionApi {
    constructor(core) {
        this._core = core;
    }
    get activeSubDocument() {
        return new SubDocumentBaseApi(this._core, this._core.selection.activeSubDocument);
    }
    get anchor() {
        return this._core.selection.getState().anchorPostion;
    }
    get active() {
        return this._core.selection.getState().activePostion;
    }
    get start() {
        return this._core.selection.getState().interval.start;
    }
    get end() {
        return this._core.selection.getState().interval.end;
    }
    get intervals() {
        const result = [];
        for (let i = 0, int; int = this._core.selection.intervals[i]; i++) {
            let interval = new IntervalApi(int.start, int.length);
            result.push(interval);
        }
        return result;
    }
    get showCursorAtEndOfLine() { return this._core.selection.endOfLine; }
    set showCursorAtEndOfLine(value) {
        if (value != this._core.selection.endOfLine)
            this._core.selection.changeState(state => state.setEndOfLine(value));
    }
    setSelection(position) {
        const sd = this._core.selection.activeSubDocument;
        const subDocEndPos = sd.getDocumentEndPosition();
        const coreIntervals = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => [getRestrictedInterval(new FixedInterval(n, 0), 0, subDocEndPos)]),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => [getRestrictedInterval(interval, 0, subDocEndPos)]),
            ModelParametersChecker.intervalsDescriptor("intervals", (apiIntervals) => ListUtils.map(apiIntervals, (interval) => getRestrictedInterval(interval, 0, subDocEndPos)))
        ]);
        const isPublicApiCallPrevValue = this._core.commandManager.isPublicApiCall;
        this._core.commandManager.isPublicApiCall = true;
        this._core.selection.changeState((newState) => {
            if (FixedInterval.isCollapsed(coreIntervals)) {
                const pos = coreIntervals[0].start;
                const par = sd.getParagraphByPosition(pos);
                if (par.startLogPosition.value == pos)
                    newState.setEndOfLine(false);
            }
            newState.setIntervals(coreIntervals);
        }, new SetSelectionStateOptions().noFieldUiChecks());
        this._core.selection.scrollManager.setScroll(new ScrollState().byModelPosition(this._core.selection).setModelPosition(this._core.selection.anchorPosition).useStdRelativePosition().useStdOffset());
        this._core.commandManager.isPublicApiCall = isPublicApiCallPrevValue;
    }
    selectAll() {
        this._core.commandManager.getCommand(RichEditClientCommand.SelectAll).execute(true);
    }
    goToSubDocumentEnd(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendDocumentEnd).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.DocumentEnd).execute(true);
    }
    goToNextLine(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendLineDown).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.LineDown).execute(true);
    }
    goToLineEnd(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendLineEnd).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.LineEnd).execute(true);
    }
    goToLineStart(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendLineStart).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.LineStart).execute(true);
    }
    goToPreviousLine(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendLineUp).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.LineUp).execute(true);
    }
    goToNextCharacter(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendNextCharacter).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.NextCharacter).execute(true);
    }
    goToPreviousCharacter(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendPreviousCharacter).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.PreviousCharacter).execute(true);
    }
    selectLine(extendSelection) {
        const linePosition = this._core.selection.lastSelectedInterval.end;
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.AddSelectedLineCommandNoUpdateControlState).execute(true, linePosition);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.SelectLine).execute(true, linePosition);
    }
    goToNextPage(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendNextPage).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.NextPage).execute(true);
    }
    goToPreviousPage(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendPreviousPage).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.PreviousPage).execute(true);
    }
    goToDocumentStart(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendDocumentStart).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.DocumentStart).execute(true);
    }
    goToDocumentEnd(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendDocumentEnd).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.DocumentEnd).execute(true);
    }
    goToNextWord(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToNextWord).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToNextWord).execute(true);
    }
    goToPreviousWord(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToPrevWord).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToPrevWord).execute(true);
    }
    goToParagraphStart(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToStartParagraph).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToStartParagraph).execute(true);
    }
    goToParagraphEnd(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToEndParagraph).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToEndParagraph).execute(true);
    }
    selectParagraph() {
        const linePosition = this._core.selection.lastSelectedInterval.start;
        this._core.commandManager.getCommand(RichEditClientCommand.SelectParagraph).execute(true, linePosition);
    }
    goToNextPageStart(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToStartNextPage).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToStartNextPage).execute(true);
    }
    goToPreviousPageStart(extendSelection) {
        if (extendSelection)
            this._core.commandManager.getCommand(RichEditClientCommand.ExtendGoToStartPrevPage).execute(true);
        else
            this._core.commandManager.getCommand(RichEditClientCommand.GoToStartPrevPage).execute(true);
    }
    selectTableCell() {
        this._core.commandManager.getCommand(RichEditClientCommand.SelectTableCell).execute(true);
    }
    selectTableRow() {
        this._core.commandManager.getCommand(RichEditClientCommand.SelectTableRow).execute(true);
    }
    selectTable() {
        this._core.commandManager.getCommand(RichEditClientCommand.SelectTable).execute(true);
    }
}
