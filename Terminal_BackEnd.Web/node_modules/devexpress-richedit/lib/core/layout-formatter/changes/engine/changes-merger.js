import { ColumnChange } from '../changes/column-change';
import { LayoutChangeType, ParagraphFrameChange, RowChange, TableChange } from '../changes/layout-change-base';
import { PageAreaChange } from '../changes/page-area-change';
import { PageChange } from '../changes/page-change';
export class ChangesMerger {
    merge(changes) {
        this.resultChanges = [];
        this.infos = [];
        this.fillTo(0);
        for (var change of changes)
            switch (change.changeType) {
                case LayoutChangeType.Inserted:
                    this.handleInsertedChange(change);
                    break;
                case LayoutChangeType.Deleted:
                    this.handleDeletedChange(change);
                    break;
                case LayoutChangeType.Replaced:
                    this.handleReplacedChange(change, ChangesMergerInfoType.Replaced);
                    break;
                case LayoutChangeType.Updated:
                    this.handleReplacedChange(change, ChangesMergerInfoType.Updated);
                    break;
            }
        this.collectFinalChanges();
        return this.resultChanges;
    }
    fillTo(lastIndex) {
        while (this.infos.length <= lastIndex)
            this.infos.push(new ChangesMergerInfo(ChangesMergerInfoType.None, null, 0));
    }
    handleDeletedChange(change) {
        this.fillTo(change.index);
        const delPageInfo = this.infos.splice(change.index + 1, 1)[0];
        this.infos[change.index].numElemsDeletedAfterThis += 1 + (delPageInfo ? delPageInfo.numElemsDeletedAfterThis : 0);
    }
    handleInsertedChange(change) {
        this.fillTo(change.index);
        const prevPageInfo = this.infos[change.index];
        this.infos.splice(change.index + 1, 0, prevPageInfo.numElemsDeletedAfterThis ?
            new ChangesMergerInfo(ChangesMergerInfoType.Replaced, this.changeConstructor(change.index, LayoutChangeType.Replaced), prevPageInfo.numElemsDeletedAfterThis - 1) :
            new ChangesMergerInfo(ChangesMergerInfoType.Inserted, change, 0));
        prevPageInfo.numElemsDeletedAfterThis = 0;
    }
    handleReplacedChange(change, infoType) {
        this.fillTo(change.index + 1);
        const info = this.infos[change.index + 1];
        switch (info.type) {
            case ChangesMergerInfoType.Inserted:
            case ChangesMergerInfoType.Replaced:
                break;
            case ChangesMergerInfoType.None:
            case ChangesMergerInfoType.Updated:
                if (infoType == ChangesMergerInfoType.Updated && info.type == ChangesMergerInfoType.Updated) {
                    info.change.summarizeChanges(change);
                }
                else {
                    info.type = infoType;
                    info.change = change;
                }
                break;
        }
    }
    collectFinalChanges() {
        for (let infoIndex = 0, info; info = this.infos[infoIndex]; infoIndex++) {
            switch (info.type) {
                case ChangesMergerInfoType.Inserted:
                case ChangesMergerInfoType.Replaced:
                case ChangesMergerInfoType.Updated:
                    info.change.index = infoIndex - 1;
                    this.resultChanges.push(info.change);
                    break;
                case ChangesMergerInfoType.None:
                    break;
            }
            for (; info.numElemsDeletedAfterThis; info.numElemsDeletedAfterThis--)
                this.resultChanges.push(this.changeConstructor(infoIndex, LayoutChangeType.Deleted));
        }
    }
}
export class LayoutPageChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new PageChange(index, changeType, [], []);
    }
}
export class LayoutPageAreaChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new PageAreaChange(index, changeType, []);
    }
}
export class LayoutColumnChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new ColumnChange(index, changeType, [], [], []);
    }
}
export class LayoutRowChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new RowChange(index, changeType);
    }
}
export class LayoutTableChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new TableChange(index, changeType);
    }
}
export class LayoutParagraphFrameChangesMerger extends ChangesMerger {
    changeConstructor(index, changeType) {
        return new ParagraphFrameChange(index, changeType);
    }
}
class ChangesMergerInfo {
    constructor(type, change, numElemsDeletedAfterThis) {
        this.type = type;
        this.change = change;
        this.numElemsDeletedAfterThis = numElemsDeletedAfterThis;
    }
}
var ChangesMergerInfoType;
(function (ChangesMergerInfoType) {
    ChangesMergerInfoType[ChangesMergerInfoType["Replaced"] = 0] = "Replaced";
    ChangesMergerInfoType[ChangesMergerInfoType["Inserted"] = 1] = "Inserted";
    ChangesMergerInfoType[ChangesMergerInfoType["Updated"] = 2] = "Updated";
    ChangesMergerInfoType[ChangesMergerInfoType["None"] = 3] = "None";
})(ChangesMergerInfoType || (ChangesMergerInfoType = {}));
