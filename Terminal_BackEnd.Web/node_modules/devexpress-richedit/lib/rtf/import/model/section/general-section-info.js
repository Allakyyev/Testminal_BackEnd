export var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment[VerticalAlignment["Top"] = 0] = "Top";
    VerticalAlignment[VerticalAlignment["Both"] = 1] = "Both";
    VerticalAlignment[VerticalAlignment["Center"] = 2] = "Center";
    VerticalAlignment[VerticalAlignment["Bottom"] = 3] = "Bottom";
})(VerticalAlignment || (VerticalAlignment = {}));
export class RtfGeneralSectionInfo {
    copyFrom(obj) {
        this.onlyAllowEditingOfFormFields = obj.onlyAllowEditingOfFormFields;
        this.firstPagePaperSource = obj.firstPagePaperSource;
        this.otherPagePaperSource = obj.otherPagePaperSource;
        this.textDirection = obj.textDirection;
        this.verticalTextAlignment = obj.verticalTextAlignment;
        this.rightToLeft = obj.rightToLeft;
    }
}
