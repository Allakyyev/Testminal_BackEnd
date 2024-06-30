export var RtfNumberingListType;
(function (RtfNumberingListType) {
    RtfNumberingListType[RtfNumberingListType["Unknown"] = 0] = "Unknown";
    RtfNumberingListType[RtfNumberingListType["Hybrid"] = 1] = "Hybrid";
    RtfNumberingListType[RtfNumberingListType["Simple"] = 2] = "Simple";
})(RtfNumberingListType || (RtfNumberingListType = {}));
export class RtfNumberingList {
    constructor() {
        this.levels = [];
        this.numberingListType = RtfNumberingListType.Unknown;
    }
}
