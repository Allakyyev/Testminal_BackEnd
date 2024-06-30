export class ParagraphFrameFormattingInfo {
    static createDefaultInfo() {
        return new ParagraphFrameFormattingInfo();
    }
    clone() {
        return new ParagraphFrameFormattingInfo();
    }
}
export var ParagraphFrameHorizontalRule;
(function (ParagraphFrameHorizontalRule) {
    ParagraphFrameHorizontalRule[ParagraphFrameHorizontalRule["Auto"] = 0] = "Auto";
    ParagraphFrameHorizontalRule[ParagraphFrameHorizontalRule["AtLeast"] = 1] = "AtLeast";
    ParagraphFrameHorizontalRule[ParagraphFrameHorizontalRule["Exact"] = 2] = "Exact";
})(ParagraphFrameHorizontalRule || (ParagraphFrameHorizontalRule = {}));
export var ParagraphFrameVerticalPositionAlignment;
(function (ParagraphFrameVerticalPositionAlignment) {
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Inline"] = 0] = "Inline";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Center"] = 1] = "Center";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Bottom"] = 2] = "Bottom";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Top"] = 3] = "Top";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Inside"] = 4] = "Inside";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["Outside"] = 5] = "Outside";
    ParagraphFrameVerticalPositionAlignment[ParagraphFrameVerticalPositionAlignment["None"] = 6] = "None";
})(ParagraphFrameVerticalPositionAlignment || (ParagraphFrameVerticalPositionAlignment = {}));
export var ParagraphFrameHorizontalPositionAlignment;
(function (ParagraphFrameHorizontalPositionAlignment) {
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["Left"] = 0] = "Left";
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["Center"] = 1] = "Center";
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["Right"] = 2] = "Right";
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["Inside"] = 3] = "Inside";
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["Outside"] = 4] = "Outside";
    ParagraphFrameHorizontalPositionAlignment[ParagraphFrameHorizontalPositionAlignment["None"] = 5] = "None";
})(ParagraphFrameHorizontalPositionAlignment || (ParagraphFrameHorizontalPositionAlignment = {}));
export var ParagraphFrameHorizontalPositionType;
(function (ParagraphFrameHorizontalPositionType) {
    ParagraphFrameHorizontalPositionType[ParagraphFrameHorizontalPositionType["Page"] = 0] = "Page";
    ParagraphFrameHorizontalPositionType[ParagraphFrameHorizontalPositionType["Column"] = 1] = "Column";
    ParagraphFrameHorizontalPositionType[ParagraphFrameHorizontalPositionType["Margin"] = 2] = "Margin";
})(ParagraphFrameHorizontalPositionType || (ParagraphFrameHorizontalPositionType = {}));
