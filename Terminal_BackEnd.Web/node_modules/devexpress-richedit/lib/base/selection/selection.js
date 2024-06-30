import { EventDispatcher } from '../../base-utils/event-dispatcher';
import { Field } from '../../core/model/fields/field';
import { SubDocumentInterval, SubDocumentIntervals } from '../../core/model/sub-document';
import { TableSelectionExtender } from '../../core/selection/selected-cells-engine';
import { BatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ModelScrollManager } from '../scroll/model-scroll-manager';
import { ScrollState } from '../scroll/model-states';
import { SelectionFloatingState, SelectionState } from './selection-state';
export class SetSelectionStateOptions {
    constructor() {
        this.correctIntervalDueToFields = true;
        this.correctIntervalDueToTables = true;
        this.useFieldUiChecks = true;
        this.isForceUpdate = false;
    }
    noFieldCorrect() {
        this.correctIntervalDueToFields = false;
        return this;
    }
    noTablesCorrect() {
        this.correctIntervalDueToTables = false;
        return this;
    }
    noFieldUiChecks() {
        this.useFieldUiChecks = false;
        return this;
    }
    forceUpdate() {
        this.isForceUpdate = true;
        return this;
    }
}
export class Selection extends BatchUpdatableObject {
    constructor(model, layout, activeSubDocument) {
        super();
        this.searchIntervals = [];
        this.misspelledIntervals = [];
        this.onChanged = new EventDispatcher();
        this.onSearchChanged = new EventDispatcher();
        this.onMisspelledSelectionChanged = new EventDispatcher();
        this.model = model;
        this.layout = layout;
        this.scrollManager = new ModelScrollManager();
        this._prevState = SelectionState.getDefault(activeSubDocument);
        this._state = SelectionState.getDefault(activeSubDocument);
    }
    get currState() { return this._state; }
    get keepX() { return this._state.keepX; }
    set keepX(val) { this._state.keepX = val; }
    get forwardDirection() { return this._state.forwardDirection; }
    set forwardDirection(val) { this._state.forwardDirection = val; }
    get endOfLine() { return this._state.endOfLine; }
    set endOfLine(val) { this._state.endOfLine = val; }
    get pageIndex() { return this._state.pageIndex; }
    set pageIndex(val) { this._state.pageIndex = val; }
    get intervals() { return this._state.intervalsInfo.intervals; }
    get activeSubDocument() { return this._state.intervalsInfo.subDocument; }
    get lastSelectedInterval() { return this._state.interval; }
    get intervalsInfo() { return this._state.intervalsInfo; }
    get prevState() { return this._prevState; }
    get multiselection() { return this._state.intervalsInfo.multiselection; }
    get anchorPosition() { return this._state.anchorPostion; }
    get reversedAnchorPostion() { return this._state.reversedAnchorPostion; }
    isCollapsed() { return this._state.intervalsInfo.isCollapsed; }
    get subDocumentIntervals() {
        return new SubDocumentIntervals(this.activeSubDocument, ListUtils.deepCopy(this._state.intervalsInfo.intervals));
    }
    get subDocumentInterval() { return this._state.intervalsInfo.subDocInterval; }
    get specialRunInfo() { return this._state.intervalsInfo.specialRunInfo; }
    ;
    get tableInfo() { return this._state.intervalsInfo.tableInfo; }
    dispose() {
        this.onChanged.dispose();
    }
    setSelection(params) {
        const options = new SetSelectionStateOptions();
        options.correctIntervalDueToFields = params.correctIntervalDueToFields;
        options.correctIntervalDueToTables = params.correctIntervalDueToTables;
        options.useFieldUiChecks = params.useFieldUiChecks;
        this.changeState((newState) => {
            newState.intervalsInfo.intervals = [params.interval];
            newState.intervalsInfo.lastIntervalIndex = 0;
            newState.endOfLine = params.endOfLine;
            newState.keepX = params.keepX;
        }, options);
        this.resetInputPositionIfNeeded();
    }
    getState() {
        return this._state.clone();
    }
    changeState(changeState, options = new SetSelectionStateOptions()) {
        const newState = this.getState();
        changeState(newState);
        return this.setState(newState, options);
    }
    setState(newState, options = new SetSelectionStateOptions()) {
        const posOfLastInterval = newState.interval.start;
        if (options.correctIntervalDueToTables) {
            for (let interval of newState.intervalsInfo.intervals)
                TableSelectionExtender.correctIntervalDueToTables(newState.intervalsInfo.subDocument, interval);
        }
        if (options.correctIntervalDueToFields) {
            for (let interval of newState.intervalsInfo.intervals)
                if (options.useFieldUiChecks)
                    Field.correctIntervalDueToFields(newState.intervalsInfo.subDocument, interval);
                else
                    Field.correctIntervalDueToFieldsWithoutUiChecks(newState.intervalsInfo.subDocument, interval);
        }
        for (let interval of newState.intervalsInfo.intervals)
            new SubDocumentInterval(newState.intervalsInfo.subDocument, interval).validateInterval();
        newState.intervalsInfo.intervals = IntervalAlgorithms.getMergedIntervals(newState.intervalsInfo.intervals, true);
        newState.intervalsInfo.lastIntervalIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(newState.intervalsInfo.intervals, (curr) => curr.start, posOfLastInterval));
        const isSelectionChanged = options.isForceUpdate ||
            !ListUtils.equals(this._state.intervalsInfo.intervals, newState.intervalsInfo.intervals) ||
            !this._state.partiallyEquals(newState) ||
            this._state.intervalsInfo.subDocument != newState.intervalsInfo.subDocument;
        if (isSelectionChanged) {
            this._prevState = this._state;
            this._state = newState;
            newState.intervalsInfo.resetTableInfo();
            newState.intervalsInfo.specialRunInfo.init(newState.intervalsInfo, this.model);
            this.raiseSelectionChanged();
        }
        return isSelectionChanged;
    }
    correctAfterTextBufferChanged() {
        const intersection = IntervalAlgorithms.getIntersectionsTwoArraysOfInterval([FixedInterval.fromPositions(0, this.activeSubDocument.getDocumentEndPosition())], this.intervals);
        this.changeState((newState) => {
            const posOfLastInterval = newState.intervalsInfo.interval.start;
            newState.intervalsInfo.intervals = intersection;
            newState.intervalsInfo.lastIntervalIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(newState.intervalsInfo.intervals, (curr) => curr.start, posOfLastInterval));
        });
    }
    getFloatingState() {
        return new SelectionFloatingState(this.getState());
    }
    restoreFloatingState(state) {
        this.setState(state.finalize());
    }
    setSearchSelectionIntervals(intervals) {
        this.searchIntervals = IntervalAlgorithms.getMergedIntervals(intervals, false);
        this.raiseSearchSelectionChanged();
    }
    resetSearchSelection() {
        if (this.searchIntervals.length) {
            this.searchIntervals = [];
            this.raiseSearchSelectionChanged();
        }
    }
    onUpdateUnlocked(occurredEvents) {
        if (occurredEvents & SelectionBatchUpdateEvents.SelectionChanged)
            this.raiseSelectionChanged();
        if (occurredEvents & SelectionBatchUpdateEvents.SearchSelectionChanged)
            this.raiseSearchSelectionChanged();
        if (occurredEvents & SelectionBatchUpdateEvents.MisspelledSelectionChanged)
            this.raiseMisspelledSelectionChanged();
    }
    setMisspelledSelectionIntervals(intervals) {
        this.misspelledIntervals = IntervalAlgorithms.getMergedIntervals(intervals, false);
        this.raiseMisspelledSelectionChanged();
    }
    raiseSelectionChanged() {
        if (this.isUpdateLocked())
            this.registerOccurredEvent(SelectionBatchUpdateEvents.SelectionChanged);
        else
            this.onChanged.listeners.forEach(listener => listener.NotifySelectionChanged(this));
    }
    raiseSearchSelectionChanged() {
        if (this.isUpdateLocked())
            this.registerOccurredEvent(SelectionBatchUpdateEvents.SearchSelectionChanged);
        else
            this.onSearchChanged.listeners.forEach(listener => listener.NotifySearchSelectionChanged());
    }
    raiseMisspelledSelectionChanged() {
        if (this.isUpdateLocked())
            this.registerOccurredEvent(SelectionBatchUpdateEvents.MisspelledSelectionChanged);
        else
            this.onMisspelledSelectionChanged.listeners.forEach(listener => listener.NotifyMisspelledSelectionChanged());
    }
    deprecatedSetSelection(firstPosition, secondPosition, endOfLine, keepX, _upd, correctIntervalDueToFields = true, correctIntervalDueToTables = true, visibleModelPosition = ModelScrollManager.StandartScrollPosition, useFieldUiChecks = true) {
        const options = new SetSelectionStateOptions();
        options.useFieldUiChecks = useFieldUiChecks;
        options.correctIntervalDueToTables = correctIntervalDueToTables;
        options.correctIntervalDueToFields = correctIntervalDueToFields;
        this.changeState((newState) => {
            newState.setInterval(new FixedInterval(Math.min(firstPosition, secondPosition), Math.abs(firstPosition - secondPosition)))
                .setKeepX(keepX)
                .setEndOfLine(endOfLine)
                .setForwardDirection(secondPosition >= firstPosition);
        }, options);
        if (visibleModelPosition != ModelScrollManager.DontChangeScrollPosition)
            this.scrollManager.setScroll(ModelScrollManager.StandartScrollPosition ?
                new ScrollState().byModelPosition(this)
                    .useCurrentPosition(this)
                    .useStdRelativePosition()
                    .useStdOffset() :
                new ScrollState().byModelPosition(this)
                    .setModelPosition(visibleModelPosition)
                    .useStdRelativePosition()
                    .useStdOffset());
        this.resetInputPositionIfNeeded();
    }
    shouldResetInputPosition() {
        const currentState = this.getState();
        return currentState.intervalsInfo.subDocument.id != this.prevState.intervalsInfo.subDocument.id ||
            !ListUtils.equals(currentState.intervalsInfo.intervals, this.prevState.intervalsInfo.intervals);
    }
    resetInputPositionIfNeeded() {
        if (this.shouldResetInputPosition())
            this.inputPosition.reset();
    }
}
var SelectionBatchUpdateEvents;
(function (SelectionBatchUpdateEvents) {
    SelectionBatchUpdateEvents[SelectionBatchUpdateEvents["None"] = 0] = "None";
    SelectionBatchUpdateEvents[SelectionBatchUpdateEvents["SelectionChanged"] = 1] = "SelectionChanged";
    SelectionBatchUpdateEvents[SelectionBatchUpdateEvents["SearchSelectionChanged"] = 4] = "SearchSelectionChanged";
    SelectionBatchUpdateEvents[SelectionBatchUpdateEvents["MisspelledSelectionChanged"] = 8] = "MisspelledSelectionChanged";
})(SelectionBatchUpdateEvents || (SelectionBatchUpdateEvents = {}));
