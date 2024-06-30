import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentLayoutDetailsLevel } from '../../layout/document-layout-details-level';
import { Log } from '../../rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../rich-utils/debug/logger/base-logger/log-source';
import { LogObjToStrLayout } from '../../rich-utils/debug/logger/layout-logger/log-obj-to-str-layout';
import { RestartFromPositionSaver_AllLayout, RestartFromPositionSaver_Base } from '../invalidator/position-savers';
export class RestartManager {
    constructor(manager) {
        this.manager = manager;
        this.reset();
    }
    reset() {
        this.layoutFormatterPositionSaver = new RestartFromPositionSaver_Base(this.manager);
    }
    startFormatting() {
        this.layoutFormatterPositionSaver.restart();
        this.reset();
    }
    restartFromPage(pageIndex, minPosition, forceRestartFullPage) {
        Log.print(LogSource.RestartManager, "restartFromPage", `pageIndex:${pageIndex}, minPosition:${minPosition}, forceRestartFullPage:${forceRestartFullPage}`);
        const pos = this.manager.invalidator.extendByMultipageTables(pageIndex, minPosition, forceRestartFullPage);
        if (pos == -1) {
            this.restartTemplate(pageIndex, () => this.layoutFormatterPositionSaver.restartMainSubDocumentFromPage(pageIndex));
        }
        else {
            const lp = this.manager.invalidator.findLayoutPositionInAllLayout(this.manager.model.mainSubDocument, pos, DocumentLayoutDetailsLevel.Row, false, true);
            if (lp.posIsStartPage() && lp.pageIndex != 0) {
                lp.advanceToPrevRow(this.manager.layout);
                lp.rowIndex++;
                lp.row = null;
            }
            ListUtils.forEach(this.manager.layout.pages, (page) => page.invalidate(), lp.pageIndex, pageIndex);
            this.restartFromRow(lp, this.manager.invalidator.getStartModelPositionOfRow(lp));
        }
    }
    restartFromRow(lp, modelPosition) {
        Log.print(LogSource.RestartManager, "restartFromRow", `modelPosition:${modelPosition}, lp:${LogObjToStrLayout.layoutPositionShort(lp)}`);
        this.restartTemplate(lp.pageIndex, () => this.layoutFormatterPositionSaver.restartMainSubDocumentFromRow(lp, modelPosition));
    }
    restartHeaderFooter(subDocument, pageIndex) {
        this.restartTemplate(pageIndex, () => this.layoutFormatterPositionSaver.restartOtherSubDocument(subDocument, pageIndex));
    }
    restartAllLayout() {
        this.restartTemplate(0, () => new RestartFromPositionSaver_AllLayout(this.manager));
    }
    restartTemplate(pageIndex, getNewRestartSaver) {
        if (this.manager.layout) {
            this.manager.layout.isFullyFormatted = false;
            this.manager.layout.validPageCount = Math.min(this.manager.layout.validPageCount, pageIndex);
        }
        this.layoutFormatterPositionSaver = getNewRestartSaver();
        if (!this.manager.isUpdateLocked())
            this.manager.onUpdateUnlocked(0);
    }
}
