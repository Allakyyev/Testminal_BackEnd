import { EventDispatcher } from '../../base-utils/event-dispatcher';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../commands/client-command';
import { FindAllCommandOptions } from '../commands/find-replace/find-all-command';
import { ReplaceAllCommandOptions } from '../commands/find-replace/replace-all-command';
import { ReplaceNextCommandOptions } from '../commands/find-replace/replace-next-command';
import { ScrollState } from '../scroll/model-states';
export class SearchManager {
    constructor(control) {
        this.onChanged = new EventDispatcher();
        this.control = control;
        this.foundIntervals = [];
        this.whatFind = null;
    }
    dispose() {
        if (this.control) {
            this.control = null;
            this.onChanged.dispose();
        }
    }
    raiseSearchReset() {
        this.resetSearch();
        this.onChanged.listeners.forEach(listener => listener.NotifySearchReset());
    }
    NotifySelectionChanged(selection) {
        if (selection.prevState.intervalsInfo.subDocument != selection.currState.intervalsInfo.subDocument)
            this.raiseSearchReset();
    }
    findAll(text, matchCase) {
        this.whatFind = text;
        let command = this.control.commandManager.getCommand(RichEditClientCommand.FindAll);
        command.execute(this.control.commandManager.isPublicApiCall, new FindAllCommandOptions(this.control, text, matchCase, true, this.foundIntervals));
    }
    replaceAll(text, replaceText, matchCase) {
        this.control.commandManager.getCommand(RichEditClientCommand.ReplaceAll)
            .execute(this.control.commandManager.isPublicApiCall, new ReplaceAllCommandOptions(this.control, text, replaceText, matchCase));
    }
    replace(text, replaceText, matchCase) {
        if (this.findIntervalIndex(this.control.selection.intervals[0]) >= 0) {
            this.control.commandManager.getCommand(RichEditClientCommand.ReplaceNext)
                .execute(this.control.commandManager.isPublicApiCall, new ReplaceNextCommandOptions(this.control, text, replaceText, matchCase));
            return true;
        }
        return false;
    }
    resetSearch() {
        this.foundIntervals = [];
        if (this.control.selection.searchIntervals.length)
            this.control.selection.resetSearchSelection();
    }
    findNextIntervalIndex() {
        for (let i = 0, interval; interval = this.foundIntervals[i]; i++)
            if (interval.start >= this.control.selection.intervals[0].end)
                return i;
        return this.foundIntervals.length ? 0 : null;
    }
    findPrevIntervalIndex() {
        for (let i = this.foundIntervals.length - 1, interval; interval = this.foundIntervals[i]; i--)
            if (interval.start < this.control.selection.intervals[0].start)
                return i;
        return this.foundIntervals.length ? this.foundIntervals.length - 1 : null;
    }
    findIntervalIndex(desiredInterval) {
        return ListUtils.indexBy(this.foundIntervals, (interval) => interval.start == desiredInterval.start && interval.end == desiredInterval.end);
    }
    selectIntervalByIndex(intervalIndex) {
        let interval = this.foundIntervals[intervalIndex];
        this.control.selection.deprecatedSetSelection(interval.start, interval.end, false, -1, true);
    }
    scrollToIntervalByIndex(intervalIndex) {
        this.control.beginUpdate();
        let interval = this.foundIntervals[intervalIndex];
        this.control.selection.scrollManager.setScroll(new ScrollState().byModelPosition(this.control.selection).setModelPosition(interval.start).useStdRelativePosition().useStdOffset());
        this.control.endUpdate();
    }
}
