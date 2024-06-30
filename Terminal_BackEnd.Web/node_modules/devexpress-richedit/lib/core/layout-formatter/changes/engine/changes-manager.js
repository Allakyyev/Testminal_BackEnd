import { Log } from '../../../rich-utils/debug/logger/base-logger/log';
import { LogListHelper } from '../../../rich-utils/debug/logger/base-logger/log-list-helper';
import { LogSource } from '../../../rich-utils/debug/logger/base-logger/log-source';
import { LogObjToStrLayout } from '../../../rich-utils/debug/logger/layout-logger/log-obj-to-str-layout';
import { LayoutPageChangesMerger } from './changes-merger';
export class ChangesManager {
    constructor() {
        this.reset();
    }
    reset() {
        this.pageChanges = [];
    }
    addPageChange(pageChange) {
        if (pageChange)
            this.pageChanges.push(pageChange);
    }
    getPageChanges() {
        return this.pageChanges;
    }
    getMergedPageChanges() {
        if (!this.pageChanges.length)
            return [];
        const mergedPageChanges = new LayoutPageChangesMerger().merge(this.pageChanges);
        Log.print(LogSource.LayoutFormatter, "mergedPageChanges - Changes\n", LogListHelper.level_1((change) => LogObjToStrLayout.pageChange(change, ""), mergedPageChanges, "", "\n"));
        return mergedPageChanges;
    }
}
