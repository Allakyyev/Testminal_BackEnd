import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export var LayoutBoxType;
(function (LayoutBoxType) {
    LayoutBoxType[LayoutBoxType["Text"] = 0] = "Text";
    LayoutBoxType[LayoutBoxType["Space"] = 1] = "Space";
    LayoutBoxType[LayoutBoxType["Dash"] = 2] = "Dash";
    LayoutBoxType[LayoutBoxType["TabSpace"] = 3] = "TabSpace";
    LayoutBoxType[LayoutBoxType["LineBreak"] = 4] = "LineBreak";
    LayoutBoxType[LayoutBoxType["PageBreak"] = 5] = "PageBreak";
    LayoutBoxType[LayoutBoxType["ColumnBreak"] = 6] = "ColumnBreak";
    LayoutBoxType[LayoutBoxType["SectionMark"] = 7] = "SectionMark";
    LayoutBoxType[LayoutBoxType["ParagraphMark"] = 8] = "ParagraphMark";
    LayoutBoxType[LayoutBoxType["Picture"] = 9] = "Picture";
    LayoutBoxType[LayoutBoxType["NumberingList"] = 10] = "NumberingList";
    LayoutBoxType[LayoutBoxType["FieldCodeStart"] = 11] = "FieldCodeStart";
    LayoutBoxType[LayoutBoxType["FieldCodeEnd"] = 12] = "FieldCodeEnd";
    LayoutBoxType[LayoutBoxType["FieldResultEnd"] = 13] = "FieldResultEnd";
    LayoutBoxType[LayoutBoxType["LayoutDependent"] = 14] = "LayoutDependent";
    LayoutBoxType[LayoutBoxType["NonBreakingSpace"] = 15] = "NonBreakingSpace";
    LayoutBoxType[LayoutBoxType["AnchorPicture"] = 16] = "AnchorPicture";
    LayoutBoxType[LayoutBoxType["AnchorTextBox"] = 17] = "AnchorTextBox";
})(LayoutBoxType || (LayoutBoxType = {}));
export class LayoutRenderCharacterProperties {
    constructor(initProps, colorInfo) {
        this.initProps = initProps;
        this.colorInfo = colorInfo;
    }
}
export class LayoutBox extends Rectangle {
    constructor(characterProperties, colorInfo) {
        super(0, 0, 0, 0);
        this.characterProperties = characterProperties;
        this.colorInfo = colorInfo;
    }
    get isDashBox() { return false; }
    get isSectionBreakBox() { return false; }
    equals(obj) {
        return super.equals(obj) &&
            this.getType() == obj.getType() &&
            this.characterProperties == obj.characterProperties &&
            this.colorInfo.equals(obj.colorInfo) &&
            this.rowOffset == obj.rowOffset &&
            this.hyperlinkTip == obj.hyperlinkTip &&
            this.fieldLevel == this.fieldLevel;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.rowOffset = obj.rowOffset;
        if (obj.hyperlinkTip)
            this.hyperlinkTip = obj.hyperlinkTip;
        if (obj.fieldLevel)
            this.fieldLevel = obj.fieldLevel;
    }
    static initializeWithMeasurer(wrappers, measurer, showHiddenSymbols) {
        var widthHeightInfo = [];
        for (let w of wrappers)
            w.box.pushInfoForMeasure(widthHeightInfo, showHiddenSymbols);
        measurer.measure(widthHeightInfo);
        ListUtils.reverseForEach(wrappers, (w) => w.box.popInfoForMeasure(widthHeightInfo, showHiddenSymbols));
        if (widthHeightInfo.length != 0)
            throw new Error("In initializeWithMeasurer widthHeightInfo.length != 0" + widthHeightInfo.length);
    }
    getEndPosition() {
        return this.rowOffset + this.getLength();
    }
    getTop(row) {
        return row.baseLine - this.getAscent() - row.getSpacingBefore();
    }
    getAscent() {
        return this.characterProperties.fontInfo.getAscent(this.height);
    }
    getDescent() {
        return this.characterProperties.fontInfo.getDescent(this.height);
    }
    isVisibleForRowAlign() {
        return false;
    }
    isVisible() {
        return false;
    }
    getCharOffsetXInPixels(_measurer, charOffset) {
        return charOffset <= 0 ? 0 : this.width;
    }
    getLength() {
        return 1;
    }
    calculateCharOffsetByPointX(_measurer, pointX) {
        return pointX / this.width > 0.6 ? 1 : 0;
    }
    splitByWidth(_measurer, maxWidth, leaveAtLeastOneChar) {
        if (this.width <= maxWidth || leaveAtLeastOneChar)
            return this;
        return null;
    }
    getCharIndex(_char) {
        return -1;
    }
    splitBoxByPosition(_measurer, _offsetAtStartBox) {
        return null;
    }
    renderNoStrikeoutAndNoUnderlineIfBoxInEndRow() {
        return false;
    }
    renderIsWordBox() {
        return false;
    }
    renderGetCharacterProperties() {
        return new LayoutRenderCharacterProperties(this.characterProperties, this.colorInfo);
    }
}
