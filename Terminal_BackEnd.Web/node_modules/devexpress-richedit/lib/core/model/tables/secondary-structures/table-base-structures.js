export class TableCellMargins {
    equals(obj) {
        if (!obj)
            return false;
        return this.top.equals(obj.top) &&
            this.right.equals(obj.right) &&
            this.left.equals(obj.left) &&
            this.bottom.equals(obj.bottom);
    }
    copyFrom(obj) {
        this.top = obj.top.clone();
        this.right = obj.right.clone();
        this.left = obj.left.clone();
        this.bottom = obj.bottom.clone();
    }
    clone() {
        var result = new TableCellMargins();
        result.copyFrom(this);
        return result;
    }
    static create(top, right, bottom, left) {
        let result = new TableCellMargins();
        result.top = top;
        result.right = right;
        result.bottom = bottom;
        result.left = left;
        return result;
    }
}
export var TableLayoutType;
(function (TableLayoutType) {
    TableLayoutType[TableLayoutType["Fixed"] = 0] = "Fixed";
    TableLayoutType[TableLayoutType["Autofit"] = 1] = "Autofit";
})(TableLayoutType || (TableLayoutType = {}));
export var TableLookTypes;
(function (TableLookTypes) {
    TableLookTypes[TableLookTypes["None"] = 0] = "None";
    TableLookTypes[TableLookTypes["ApplyFirstRow"] = 32] = "ApplyFirstRow";
    TableLookTypes[TableLookTypes["ApplyLastRow"] = 64] = "ApplyLastRow";
    TableLookTypes[TableLookTypes["ApplyFirstColumn"] = 128] = "ApplyFirstColumn";
    TableLookTypes[TableLookTypes["ApplyLastColumn"] = 256] = "ApplyLastColumn";
    TableLookTypes[TableLookTypes["DoNotApplyRowBanding"] = 512] = "DoNotApplyRowBanding";
    TableLookTypes[TableLookTypes["DoNotApplyColumnBanding"] = 1024] = "DoNotApplyColumnBanding";
})(TableLookTypes || (TableLookTypes = {}));
export var HorizontalAlignMode;
(function (HorizontalAlignMode) {
    HorizontalAlignMode[HorizontalAlignMode["None"] = 0] = "None";
    HorizontalAlignMode[HorizontalAlignMode["Center"] = 1] = "Center";
    HorizontalAlignMode[HorizontalAlignMode["Inside"] = 2] = "Inside";
    HorizontalAlignMode[HorizontalAlignMode["Left"] = 3] = "Left";
    HorizontalAlignMode[HorizontalAlignMode["Outside"] = 4] = "Outside";
    HorizontalAlignMode[HorizontalAlignMode["Right"] = 5] = "Right";
})(HorizontalAlignMode || (HorizontalAlignMode = {}));
export var VerticalAlignMode;
(function (VerticalAlignMode) {
    VerticalAlignMode[VerticalAlignMode["None"] = 0] = "None";
    VerticalAlignMode[VerticalAlignMode["Bottom"] = 1] = "Bottom";
    VerticalAlignMode[VerticalAlignMode["Center"] = 2] = "Center";
    VerticalAlignMode[VerticalAlignMode["Inline"] = 3] = "Inline";
    VerticalAlignMode[VerticalAlignMode["Inside"] = 4] = "Inside";
    VerticalAlignMode[VerticalAlignMode["Outside"] = 5] = "Outside";
    VerticalAlignMode[VerticalAlignMode["Top"] = 6] = "Top";
})(VerticalAlignMode || (VerticalAlignMode = {}));
export var HorizontalAnchorTypes;
(function (HorizontalAnchorTypes) {
    HorizontalAnchorTypes[HorizontalAnchorTypes["Margin"] = 0] = "Margin";
    HorizontalAnchorTypes[HorizontalAnchorTypes["Page"] = 1] = "Page";
    HorizontalAnchorTypes[HorizontalAnchorTypes["Column"] = 2] = "Column";
})(HorizontalAnchorTypes || (HorizontalAnchorTypes = {}));
export var VerticalAnchorTypes;
(function (VerticalAnchorTypes) {
    VerticalAnchorTypes[VerticalAnchorTypes["Margin"] = 0] = "Margin";
    VerticalAnchorTypes[VerticalAnchorTypes["Page"] = 1] = "Page";
    VerticalAnchorTypes[VerticalAnchorTypes["Paragraph"] = 2] = "Paragraph";
})(VerticalAnchorTypes || (VerticalAnchorTypes = {}));
export var TextWrapping;
(function (TextWrapping) {
    TextWrapping[TextWrapping["Never"] = 0] = "Never";
    TextWrapping[TextWrapping["Around"] = 1] = "Around";
})(TextWrapping || (TextWrapping = {}));
export var TableRowAlignment;
(function (TableRowAlignment) {
    TableRowAlignment[TableRowAlignment["Both"] = 0] = "Both";
    TableRowAlignment[TableRowAlignment["Center"] = 1] = "Center";
    TableRowAlignment[TableRowAlignment["Distribute"] = 2] = "Distribute";
    TableRowAlignment[TableRowAlignment["Left"] = 3] = "Left";
    TableRowAlignment[TableRowAlignment["NumTab"] = 4] = "NumTab";
    TableRowAlignment[TableRowAlignment["Right"] = 5] = "Right";
})(TableRowAlignment || (TableRowAlignment = {}));
export var TableCellMergingState;
(function (TableCellMergingState) {
    TableCellMergingState[TableCellMergingState["None"] = 0] = "None";
    TableCellMergingState[TableCellMergingState["Continue"] = 1] = "Continue";
    TableCellMergingState[TableCellMergingState["Restart"] = 2] = "Restart";
})(TableCellMergingState || (TableCellMergingState = {}));
export var TextDirection;
(function (TextDirection) {
    TextDirection[TextDirection["LeftToRightTopToBottom"] = 0] = "LeftToRightTopToBottom";
    TextDirection[TextDirection["TopToBottomRightToLeft"] = 1] = "TopToBottomRightToLeft";
    TextDirection[TextDirection["TopToBottomLeftToRightRotated"] = 2] = "TopToBottomLeftToRightRotated";
    TextDirection[TextDirection["BottomToTopLeftToRight"] = 3] = "BottomToTopLeftToRight";
    TextDirection[TextDirection["LeftToRightTopToBottomRotated"] = 4] = "LeftToRightTopToBottomRotated";
    TextDirection[TextDirection["TopToBottomRightToLeftRotated"] = 5] = "TopToBottomRightToLeftRotated";
})(TextDirection || (TextDirection = {}));
export var TableCellVerticalAlignment;
(function (TableCellVerticalAlignment) {
    TableCellVerticalAlignment[TableCellVerticalAlignment["Top"] = 0] = "Top";
    TableCellVerticalAlignment[TableCellVerticalAlignment["Both"] = 1] = "Both";
    TableCellVerticalAlignment[TableCellVerticalAlignment["Center"] = 2] = "Center";
    TableCellVerticalAlignment[TableCellVerticalAlignment["Bottom"] = 3] = "Bottom";
})(TableCellVerticalAlignment || (TableCellVerticalAlignment = {}));
export var ConditionalTableStyleFormatting;
(function (ConditionalTableStyleFormatting) {
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["WholeTable"] = 4096] = "WholeTable";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["FirstRow"] = 2048] = "FirstRow";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["LastRow"] = 1024] = "LastRow";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["FirstColumn"] = 512] = "FirstColumn";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["LastColumn"] = 256] = "LastColumn";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["OddColumnBanding"] = 128] = "OddColumnBanding";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["EvenColumnBanding"] = 64] = "EvenColumnBanding";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["OddRowBanding"] = 32] = "OddRowBanding";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["EvenRowBanding"] = 16] = "EvenRowBanding";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["TopRightCell"] = 8] = "TopRightCell";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["TopLeftCell"] = 4] = "TopLeftCell";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["BottomRightCell"] = 2] = "BottomRightCell";
    ConditionalTableStyleFormatting[ConditionalTableStyleFormatting["BottomLeftCell"] = 1] = "BottomLeftCell";
})(ConditionalTableStyleFormatting || (ConditionalTableStyleFormatting = {}));
