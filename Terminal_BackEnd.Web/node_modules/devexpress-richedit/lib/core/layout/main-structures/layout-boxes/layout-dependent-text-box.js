import { LayoutBoxType } from './layout-box';
import { LayoutTextBox } from './layout-text-box';
export var LayoutDependentBoxType;
(function (LayoutDependentBoxType) {
    LayoutDependentBoxType[LayoutDependentBoxType["Page"] = 0] = "Page";
    LayoutDependentBoxType[LayoutDependentBoxType["Numpages"] = 1] = "Numpages";
})(LayoutDependentBoxType || (LayoutDependentBoxType = {}));
export class LayoutDependentTextBox extends LayoutTextBox {
    clone() {
        const newObj = new LayoutDependentTextBox(this.characterProperties, this.colorInfo, this.text);
        newObj.copyFrom(this);
        return newObj;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.type = obj.type;
    }
    getType() {
        return LayoutBoxType.LayoutDependent;
    }
    setType(type) {
        this.type = type;
    }
    calculateText(manager) {
        switch (this.type) {
            case LayoutDependentBoxType.Numpages:
                this.text = (manager.layout.lastMaxNumPages).toString();
                if (!manager.activeFormatter.subDocument.isMain())
                    manager.layoutDependentRunCache.add(manager.activeFormatter.layoutPosition.pageIndex, manager.activeFormatter.subDocument.id);
                break;
            case LayoutDependentBoxType.Page:
                this.text = (manager.activeFormatter.layoutPosition.page.pageOrdinal).toString();
                break;
        }
    }
    isLineBreak() {
        return false;
    }
}
