export var RibbonItemType;
(function (RibbonItemType) {
    RibbonItemType[RibbonItemType["Button"] = 0] = "Button";
    RibbonItemType[RibbonItemType["SelectBox"] = 1] = "SelectBox";
    RibbonItemType[RibbonItemType["Menu"] = 2] = "Menu";
    RibbonItemType[RibbonItemType["NumberBox"] = 3] = "NumberBox";
    RibbonItemType[RibbonItemType["ColorBox"] = 4] = "ColorBox";
    RibbonItemType[RibbonItemType["SubMenu"] = 5] = "SubMenu";
})(RibbonItemType || (RibbonItemType = {}));
export class RibbonItemBase {
    constructor(id, beginGroup = false) {
        this.beginGroup = false;
        this.id = id;
        this.beginGroup = beginGroup;
    }
}
