import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
export var LayoutBookmarkBoxType;
(function (LayoutBookmarkBoxType) {
    LayoutBookmarkBoxType[LayoutBookmarkBoxType["StartBox"] = 0] = "StartBox";
    LayoutBookmarkBoxType[LayoutBookmarkBoxType["EndBox"] = 1] = "EndBox";
})(LayoutBookmarkBoxType || (LayoutBookmarkBoxType = {}));
export class BookmarkBox extends Rectangle {
    constructor(boxType) {
        super(0, 0, 0, 0);
        this.boxType = LayoutBookmarkBoxType.StartBox;
        this.color = "";
        this.boxType = boxType;
    }
    equals(obj) {
        return super.equals(obj) &&
            this.color == obj.color &&
            this.boxType == obj.boxType;
    }
}
BookmarkBox.DEFAULT_WIDTH = 3;
BookmarkBox.DEFAULT_BORDER_WIDTH = 2;
