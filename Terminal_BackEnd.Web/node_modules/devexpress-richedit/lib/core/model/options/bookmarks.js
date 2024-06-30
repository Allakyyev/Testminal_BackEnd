export class BookmarksSettings {
    constructor() {
        this.conflictNameResolution = ConflictNameAction.Rename;
        this.visibility = BookmarksVisibility.Auto;
        this.color = "rgb(127, 127, 127)";
    }
    copyFrom(obj) {
        this.conflictNameResolution = obj.conflictNameResolution;
        this.visibility = obj.visibility;
        this.color = obj.color;
    }
    clone() {
        const result = new BookmarksSettings();
        result.copyFrom(this);
        return result;
    }
}
export var ConflictNameAction;
(function (ConflictNameAction) {
    ConflictNameAction[ConflictNameAction["Keep"] = 0] = "Keep";
    ConflictNameAction[ConflictNameAction["Rename"] = 1] = "Rename";
    ConflictNameAction[ConflictNameAction["Skip"] = 2] = "Skip";
})(ConflictNameAction || (ConflictNameAction = {}));
export var BookmarksVisibility;
(function (BookmarksVisibility) {
    BookmarksVisibility[BookmarksVisibility["Auto"] = 0] = "Auto";
    BookmarksVisibility[BookmarksVisibility["Visible"] = 1] = "Visible";
    BookmarksVisibility[BookmarksVisibility["Hidden"] = 2] = "Hidden";
})(BookmarksVisibility || (BookmarksVisibility = {}));
