export class AnchorObjectPositionCalculatorBase {
    constructor(manager) {
        this.manager = manager;
    }
    get anchorInfo() {
        return this.obj.anchorInfo;
    }
    init(obj) {
        this.lp = this.manager.activeFormatter.layoutPosition;
        this.obj = obj;
        this.isRelativeCell = !!this.manager.activeFormatter.tableFormatter &&
            (obj.anchorInfo.layoutTableCell || this.manager.model.compatibilitySettings.layoutInTableCell);
    }
}
