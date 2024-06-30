import { SearchSettings } from '../../../core/model/document-model';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class FindAllCommandOptions extends CommandOptions {
    constructor(control, text, matchCase, highlightResults, results) {
        super(control);
        this.text = text;
        this.matchCase = matchCase;
        this.highlightResults = highlightResults;
        this.results = results;
    }
}
export class FindAllCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const searchSettings = new SearchSettings(this.control.modelManager, this.control.layoutFormatterManager, this.control.layout, options.subDocument, options.text, options.matchCase, options.highlightResults, this.selection.pageIndex, (interval) => {
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals([interval])));
        });
        const foundIntervals = this.modelManipulator.model.findAll(searchSettings);
        if (searchSettings.highlightResults)
            this.selection.setSearchSelectionIntervals(foundIntervals);
        if (options.results) {
            options.results.splice(0, options.results.length);
            foundIntervals.forEach(function (interval) {
                options.results.push(interval);
            });
        }
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
