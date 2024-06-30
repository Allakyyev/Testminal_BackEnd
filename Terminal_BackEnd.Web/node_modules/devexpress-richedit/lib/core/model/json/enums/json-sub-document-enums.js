export var JSONEnumLoadPieceTableCommandParameters;
(function (JSONEnumLoadPieceTableCommandParameters) {
    JSONEnumLoadPieceTableCommandParameters[JSONEnumLoadPieceTableCommandParameters["LoadOnOneRequest"] = 0] = "LoadOnOneRequest";
    JSONEnumLoadPieceTableCommandParameters[JSONEnumLoadPieceTableCommandParameters["StartPosition"] = 1] = "StartPosition";
    JSONEnumLoadPieceTableCommandParameters[JSONEnumLoadPieceTableCommandParameters["MaxChunkLength"] = 2] = "MaxChunkLength";
    JSONEnumLoadPieceTableCommandParameters[JSONEnumLoadPieceTableCommandParameters["Length"] = 3] = "Length";
})(JSONEnumLoadPieceTableCommandParameters || (JSONEnumLoadPieceTableCommandParameters = {}));
export var JSONCreateHeaderFooterCommandBaseProperty;
(function (JSONCreateHeaderFooterCommandBaseProperty) {
    JSONCreateHeaderFooterCommandBaseProperty[JSONCreateHeaderFooterCommandBaseProperty["Type"] = 0] = "Type";
})(JSONCreateHeaderFooterCommandBaseProperty || (JSONCreateHeaderFooterCommandBaseProperty = {}));
export var JSONChangeHeaderFooterIndexCommandBase;
(function (JSONChangeHeaderFooterIndexCommandBase) {
    JSONChangeHeaderFooterIndexCommandBase[JSONChangeHeaderFooterIndexCommandBase["SectionIndex"] = 0] = "SectionIndex";
    JSONChangeHeaderFooterIndexCommandBase[JSONChangeHeaderFooterIndexCommandBase["NewObjectIndex"] = 1] = "NewObjectIndex";
    JSONChangeHeaderFooterIndexCommandBase[JSONChangeHeaderFooterIndexCommandBase["Type"] = 2] = "Type";
})(JSONChangeHeaderFooterIndexCommandBase || (JSONChangeHeaderFooterIndexCommandBase = {}));
export var JSONEnumLoadPieceTable;
(function (JSONEnumLoadPieceTable) {
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["Bookmarks"] = 0] = "Bookmarks";
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["Fields"] = 1] = "Fields";
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["Tables"] = 2] = "Tables";
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["Chunks"] = 3] = "Chunks";
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["Paragraphs"] = 4] = "Paragraphs";
    JSONEnumLoadPieceTable[JSONEnumLoadPieceTable["RangePermissions"] = 5] = "RangePermissions";
})(JSONEnumLoadPieceTable || (JSONEnumLoadPieceTable = {}));
export var JSONHeaderFooterInfoProperty;
(function (JSONHeaderFooterInfoProperty) {
    JSONHeaderFooterInfoProperty[JSONHeaderFooterInfoProperty["SubDocumentId"] = 0] = "SubDocumentId";
    JSONHeaderFooterInfoProperty[JSONHeaderFooterInfoProperty["Type"] = 1] = "Type";
})(JSONHeaderFooterInfoProperty || (JSONHeaderFooterInfoProperty = {}));
export var JSONBookmarkProperty;
(function (JSONBookmarkProperty) {
    JSONBookmarkProperty[JSONBookmarkProperty["StartPos"] = 0] = "StartPos";
    JSONBookmarkProperty[JSONBookmarkProperty["Length"] = 1] = "Length";
    JSONBookmarkProperty[JSONBookmarkProperty["Name"] = 2] = "Name";
})(JSONBookmarkProperty || (JSONBookmarkProperty = {}));
export var JSONRangePermissionProperty;
(function (JSONRangePermissionProperty) {
    JSONRangePermissionProperty[JSONRangePermissionProperty["Start"] = 0] = "Start";
    JSONRangePermissionProperty[JSONRangePermissionProperty["Length"] = 1] = "Length";
    JSONRangePermissionProperty[JSONRangePermissionProperty["UserName"] = 2] = "UserName";
    JSONRangePermissionProperty[JSONRangePermissionProperty["Group"] = 3] = "Group";
})(JSONRangePermissionProperty || (JSONRangePermissionProperty = {}));
export var JSONChunkProperty;
(function (JSONChunkProperty) {
    JSONChunkProperty[JSONChunkProperty["StartPos"] = 0] = "StartPos";
    JSONChunkProperty[JSONChunkProperty["TextBuffer"] = 1] = "TextBuffer";
    JSONChunkProperty[JSONChunkProperty["Runs"] = 2] = "Runs";
    JSONChunkProperty[JSONChunkProperty["IsLast"] = 3] = "IsLast";
})(JSONChunkProperty || (JSONChunkProperty = {}));
export var JSONPieceTableInfo;
(function (JSONPieceTableInfo) {
    JSONPieceTableInfo[JSONPieceTableInfo["Type"] = 0] = "Type";
    JSONPieceTableInfo[JSONPieceTableInfo["Info"] = 1] = "Info";
    JSONPieceTableInfo[JSONPieceTableInfo["ParentPieceTableId"] = 2] = "ParentPieceTableId";
})(JSONPieceTableInfo || (JSONPieceTableInfo = {}));
export var JSONTabInfoProperty;
(function (JSONTabInfoProperty) {
    JSONTabInfoProperty[JSONTabInfoProperty["Alignment"] = 0] = "Alignment";
    JSONTabInfoProperty[JSONTabInfoProperty["LeaderType"] = 1] = "LeaderType";
    JSONTabInfoProperty[JSONTabInfoProperty["Position"] = 2] = "Position";
    JSONTabInfoProperty[JSONTabInfoProperty["IsDefault"] = 3] = "IsDefault";
    JSONTabInfoProperty[JSONTabInfoProperty["IsDeleted"] = 4] = "IsDeleted";
})(JSONTabInfoProperty || (JSONTabInfoProperty = {}));
