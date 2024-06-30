import { Log } from '../../rich-utils/debug/logger/base-logger/log';
import { LogObjToStr } from '../../rich-utils/debug/logger/base-logger/log-obj-to-str';
import { LogSource } from '../../rich-utils/debug/logger/base-logger/log-source';
import { LogObjToStrLayout } from '../../rich-utils/debug/logger/layout-logger/log-obj-to-str-layout';
import { RestartPreparer } from '../formatter/utils/restart-preparer';
export class RestartFromPositionSaver_Base {
    constructor(manager) {
        this.manager = manager;
    }
    get restartPreparer() {
        return new RestartPreparer(this.manager);
    }
    restartOtherSubDocument(subDocument, pageIndex) {
        return new RestartFromPositionSaver_OherSubDocument(this.manager, subDocument, pageIndex);
    }
    restartMainSubDocumentFromPage(pageIndex) {
        return new RestartFromPositionSaver_MainSubDocumentFromPage(this.manager, pageIndex);
    }
    restartMainSubDocumentFromRow(lp, modelPosition) {
        return RestartFromPositionSaver_Base.isNeedRestartFromPage(lp) ?
            new RestartFromPositionSaver_MainSubDocumentFromPage(this.manager, lp.pageIndex) :
            new RestartFromPositionSaver_MainSubDocumentFromRow(this.manager, lp, modelPosition);
    }
    restart() {
        Log.print(LogSource.PositionSaver, "restart(from Base)", "");
    }
    static isNeedRestartFromPage(lp) {
        return lp.pageAreaIndex == 0 && lp.columnIndex == 0 && lp.rowIndex == 0;
    }
}
export class RestartFromPositionSaver_OherSubDocument extends RestartFromPositionSaver_Base {
    constructor(manager, subDocument, pageIndex) {
        super(manager);
        this.subDocument = subDocument;
        this.pageIndex = pageIndex;
    }
    restartOtherSubDocument(_subDocument, pageIndex) {
        return this.getNextState(pageIndex);
    }
    restartMainSubDocumentFromPage(pageIndex) {
        return this.getNextState(pageIndex);
    }
    restartMainSubDocumentFromRow(layoutPosition, _modelPosition) {
        return this.getNextState(layoutPosition.pageIndex);
    }
    restart() {
        Log.print(LogSource.PositionSaver, "restart(from OherSubDocument)", `pageIndex: ${this.pageIndex}, subDocInfo:${LogObjToStr.subDocumentInfoBase(this.subDocument.info)}`);
        this.restartPreparer.restartHeaderFooterInternal(this.subDocument, this.pageIndex);
    }
    getNextState(pageIndex) {
        return new RestartFromPositionSaver_MainSubDocumentFromPage(this.manager, Math.min(pageIndex, this.pageIndex));
    }
}
export class RestartFromPositionSaver_MainSubDocumentFromPage extends RestartFromPositionSaver_Base {
    constructor(manager, pageIndex) {
        super(manager);
        this.pageIndex = pageIndex;
    }
    restartOtherSubDocument(_subDocument, pageIndex) {
        return this.getNextState(pageIndex);
    }
    restartMainSubDocumentFromPage(pageIndex) {
        return this.getNextState(pageIndex);
    }
    restartMainSubDocumentFromRow(layoutPosition, modelPosition) {
        return layoutPosition.pageIndex < this.pageIndex ?
            new RestartFromPositionSaver_MainSubDocumentFromRow(this.manager, layoutPosition, modelPosition) :
            this.getNextState(layoutPosition.pageIndex);
    }
    restart() {
        Log.print(LogSource.PositionSaver, "restart(from page)", `pageIndex: ${this.pageIndex}`);
        this.restartPreparer.restartFromPage(this.pageIndex, true, true);
    }
    getNextState(pageIndex) {
        this.pageIndex = Math.min(pageIndex, this.pageIndex);
        return this;
    }
}
export class RestartFromPositionSaver_AllLayout extends RestartFromPositionSaver_Base {
    restartOtherSubDocument(_subDocument, _pageIndex) {
        return this;
    }
    restartMainSubDocumentFromPage(_pageIndex) {
        return this;
    }
    restartMainSubDocumentFromRow(_layoutPosition, _modelPosition) {
        return this;
    }
    restart() {
        Log.print(LogSource.PositionSaver, "restart(all layout)", "");
        this.restartPreparer.restartFormatingAllLayout();
    }
}
class RestartFromPositionSaver_MainSubDocumentFromRow extends RestartFromPositionSaver_Base {
    constructor(manager, layoutPosition, modelPosition) {
        super(manager);
        this.layoutPosition = layoutPosition;
        this.modelPosition = modelPosition;
    }
    restartOtherSubDocument(_subDocument, pageIndex) {
        return this.getNextState(pageIndex);
    }
    restartMainSubDocumentFromRow(layoutPosition, modelPosition) {
        if (layoutPosition.pageIndex <= this.layoutPosition.pageIndex && RestartFromPositionSaver_Base.isNeedRestartFromPage(layoutPosition))
            return new RestartFromPositionSaver_MainSubDocumentFromPage(this.manager, layoutPosition.pageIndex);
        if (modelPosition <= this.modelPosition) {
            this.modelPosition = modelPosition;
            this.layoutPosition = layoutPosition;
        }
        return this;
    }
    restartMainSubDocumentFromPage(pageIndex) {
        return this.getNextState(pageIndex);
    }
    restart() {
        Log.print(LogSource.PositionSaver, "restart(from row)", `modelPosition: ${this.modelPosition}, LP:${LogObjToStrLayout.layoutPositionShort(this.layoutPosition)}`);
        this.restartPreparer.restartFromRow(this.layoutPosition, this.modelPosition, false);
    }
    getNextState(pageIndex) {
        if (pageIndex <= this.layoutPosition.pageIndex)
            return new RestartFromPositionSaver_MainSubDocumentFromPage(this.manager, pageIndex);
        return this;
    }
}
