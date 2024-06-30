export var zIndexCssClassType;
(function (zIndexCssClassType) {
    zIndexCssClassType[zIndexCssClassType["TextBoxBg"] = 0] = "TextBoxBg";
    zIndexCssClassType[zIndexCssClassType["TblRowBg"] = 1] = "TblRowBg";
    zIndexCssClassType[zIndexCssClassType["TblCellBg"] = 2] = "TblCellBg";
    zIndexCssClassType[zIndexCssClassType["ParBg"] = 3] = "ParBg";
    zIndexCssClassType[zIndexCssClassType["BoxBg"] = 4] = "BoxBg";
    zIndexCssClassType[zIndexCssClassType["FieldBg"] = 5] = "FieldBg";
    zIndexCssClassType[zIndexCssClassType["SelRange"] = 6] = "SelRange";
    zIndexCssClassType[zIndexCssClassType["BoxSpace"] = 7] = "BoxSpace";
    zIndexCssClassType[zIndexCssClassType["SelSearch"] = 8] = "SelSearch";
    zIndexCssClassType[zIndexCssClassType["SelRow"] = 9] = "SelRow";
    zIndexCssClassType[zIndexCssClassType["Box"] = 10] = "Box";
    zIndexCssClassType[zIndexCssClassType["Bookmark"] = 11] = "Bookmark";
    zIndexCssClassType[zIndexCssClassType["TableBorder"] = 12] = "TableBorder";
    zIndexCssClassType[zIndexCssClassType["SelMissp"] = 13] = "SelMissp";
    zIndexCssClassType[zIndexCssClassType["SelCursor"] = 14] = "SelCursor";
    zIndexCssClassType[zIndexCssClassType["SelTouchBar"] = 15] = "SelTouchBar";
    zIndexCssClassType[zIndexCssClassType["TblCursor"] = 16] = "TblCursor";
    zIndexCssClassType[zIndexCssClassType["AnchoredPicture"] = 17] = "AnchoredPicture";
    zIndexCssClassType[zIndexCssClassType["TextBox"] = 18] = "TextBox";
})(zIndexCssClassType || (zIndexCssClassType = {}));
export class ZIndexHelper {
    static getClassName(level, zIndexCssNames) {
        return `dxre${ZIndexHelper.names[zIndexCssNames]}ZL${level}`;
    }
}
ZIndexHelper.names = {
    [zIndexCssClassType.TextBoxBg]: "TextBoxBg",
    [zIndexCssClassType.TblRowBg]: "TblRowBg",
    [zIndexCssClassType.TblCellBg]: "TblCellBg",
    [zIndexCssClassType.ParBg]: "ParBg",
    [zIndexCssClassType.BoxBg]: "BoxBg",
    [zIndexCssClassType.FieldBg]: "FieldBg",
    [zIndexCssClassType.SelRange]: "SelRange",
    [zIndexCssClassType.BoxSpace]: "BoxSpace",
    [zIndexCssClassType.SelSearch]: "SelSearch",
    [zIndexCssClassType.SelRow]: "SelRow",
    [zIndexCssClassType.Box]: "Box",
    [zIndexCssClassType.Bookmark]: "Bookmark",
    [zIndexCssClassType.TableBorder]: "TableBorder",
    [zIndexCssClassType.SelMissp]: "SelMissp",
    [zIndexCssClassType.SelCursor]: "SelCursor",
    [zIndexCssClassType.SelTouchBar]: "SelTouchBar",
    [zIndexCssClassType.TblCursor]: "TblCursor",
    [zIndexCssClassType.AnchoredPicture]: "AnchoredPicture",
    [zIndexCssClassType.TextBox]: "TextBox",
};
