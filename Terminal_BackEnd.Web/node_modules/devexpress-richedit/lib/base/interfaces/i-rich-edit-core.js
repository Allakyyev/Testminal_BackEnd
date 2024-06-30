export var ReadOnlyMode;
(function (ReadOnlyMode) {
    ReadOnlyMode[ReadOnlyMode["None"] = 0] = "None";
    ReadOnlyMode[ReadOnlyMode["Persistent"] = 1] = "Persistent";
    ReadOnlyMode[ReadOnlyMode["Temporary"] = 2] = "Temporary";
})(ReadOnlyMode || (ReadOnlyMode = {}));
