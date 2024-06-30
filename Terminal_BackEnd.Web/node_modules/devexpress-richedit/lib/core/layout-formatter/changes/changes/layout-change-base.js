export var LayoutChangeType;
(function (LayoutChangeType) {
    LayoutChangeType[LayoutChangeType["Deleted"] = 0] = "Deleted";
    LayoutChangeType[LayoutChangeType["Replaced"] = 1] = "Replaced";
    LayoutChangeType[LayoutChangeType["Updated"] = 2] = "Updated";
    LayoutChangeType[LayoutChangeType["Inserted"] = 3] = "Inserted";
})(LayoutChangeType || (LayoutChangeType = {}));
export class LayoutChangeBase {
    constructor(index, changeType = LayoutChangeType.Updated) {
        this.index = index;
        this.changeType = changeType;
    }
    get layoutIndex() { return this.index; }
    ;
    get canvasIndex() { return this.index; }
    ;
    summarizeChanges(_change) {
    }
}
export class AnchoredPictureChange extends LayoutChangeBase {
    reduceChanges() {
        return this.changeType == LayoutChangeType.Updated ? null : this;
    }
}
export class ParagraphFrameChange extends LayoutChangeBase {
    reduceChanges() {
        return this.changeType == LayoutChangeType.Updated ? null : this;
    }
}
export class RowChange extends LayoutChangeBase {
    reduceChanges() {
        return this.changeType == LayoutChangeType.Updated ? null : this;
    }
}
export class TableChange extends LayoutChangeBase {
    reduceChanges() {
        return this.changeType == LayoutChangeType.Updated ? null : this;
    }
}
export class RowChangeSV extends RowChange {
    constructor(layoutIndex, canvasIndex, changeType) {
        super(canvasIndex, changeType);
        this._layoutIndex = layoutIndex;
    }
    get layoutIndex() { return this._layoutIndex; }
    ;
    get canvasIndex() { return this.index; }
    ;
}
export class TableChangeSV extends TableChange {
    constructor(layoutIndex, canvasIndex, changeType) {
        super(canvasIndex, changeType);
        this._layoutIndex = layoutIndex;
    }
    get layoutIndex() { return this._layoutIndex; }
    ;
    get canvasIndex() { return this.index; }
    ;
}
export class ParagraphFrameChangeSV extends ParagraphFrameChange {
    constructor(layoutIndex, canvasIndex, changeType) {
        super(canvasIndex, changeType);
        this._layoutIndex = layoutIndex;
    }
    get layoutIndex() { return this._layoutIndex; }
    ;
    get canvasIndex() { return this.index; }
    ;
}
