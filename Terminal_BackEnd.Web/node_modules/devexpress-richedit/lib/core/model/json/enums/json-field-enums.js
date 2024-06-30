export var JSONFieldProperty;
(function (JSONFieldProperty) {
    JSONFieldProperty[JSONFieldProperty["StartPos"] = 0] = "StartPos";
    JSONFieldProperty[JSONFieldProperty["SeparatorPos"] = 1] = "SeparatorPos";
    JSONFieldProperty[JSONFieldProperty["EndPos"] = 2] = "EndPos";
    JSONFieldProperty[JSONFieldProperty["Uri"] = 3] = "Uri";
    JSONFieldProperty[JSONFieldProperty["Anchor"] = 4] = "Anchor";
    JSONFieldProperty[JSONFieldProperty["Tip"] = 5] = "Tip";
    JSONFieldProperty[JSONFieldProperty["Visited"] = 6] = "Visited";
    JSONFieldProperty[JSONFieldProperty["NoInfo"] = 7] = "NoInfo";
})(JSONFieldProperty || (JSONFieldProperty = {}));
export var JSONUpdateFieldCommand;
(function (JSONUpdateFieldCommand) {
    JSONUpdateFieldCommand[JSONUpdateFieldCommand["ActiveRecord"] = 0] = "ActiveRecord";
    JSONUpdateFieldCommand[JSONUpdateFieldCommand["Info"] = 1] = "Info";
    JSONUpdateFieldCommand[JSONUpdateFieldCommand["SubDocumentId"] = 2] = "SubDocumentId";
})(JSONUpdateFieldCommand || (JSONUpdateFieldCommand = {}));
export var JSONUpdateFieldCommandInfo;
(function (JSONUpdateFieldCommandInfo) {
    JSONUpdateFieldCommandInfo[JSONUpdateFieldCommandInfo["ServerUpdateFieldType"] = 0] = "ServerUpdateFieldType";
    JSONUpdateFieldCommandInfo[JSONUpdateFieldCommandInfo["Data"] = 1] = "Data";
})(JSONUpdateFieldCommandInfo || (JSONUpdateFieldCommandInfo = {}));
export var JSONUpdateFieldCommandDocVariableInfo;
(function (JSONUpdateFieldCommandDocVariableInfo) {
    JSONUpdateFieldCommandDocVariableInfo[JSONUpdateFieldCommandDocVariableInfo["Parameters"] = 0] = "Parameters";
    JSONUpdateFieldCommandDocVariableInfo[JSONUpdateFieldCommandDocVariableInfo["FieldName"] = 1] = "FieldName";
})(JSONUpdateFieldCommandDocVariableInfo || (JSONUpdateFieldCommandDocVariableInfo = {}));
export var JSONUpdateFieldCommandDocVariableParameters;
(function (JSONUpdateFieldCommandDocVariableParameters) {
    JSONUpdateFieldCommandDocVariableParameters[JSONUpdateFieldCommandDocVariableParameters["PureText"] = 0] = "PureText";
    JSONUpdateFieldCommandDocVariableParameters[JSONUpdateFieldCommandDocVariableParameters["IntervalStart"] = 1] = "IntervalStart";
    JSONUpdateFieldCommandDocVariableParameters[JSONUpdateFieldCommandDocVariableParameters["IntervalEnd"] = 2] = "IntervalEnd";
})(JSONUpdateFieldCommandDocVariableParameters || (JSONUpdateFieldCommandDocVariableParameters = {}));
export var JSONUpdateFieldCommandResult;
(function (JSONUpdateFieldCommandResult) {
    JSONUpdateFieldCommandResult[JSONUpdateFieldCommandResult["SimpleText"] = 0] = "SimpleText";
    JSONUpdateFieldCommandResult[JSONUpdateFieldCommandResult["DocumentLength"] = 1] = "DocumentLength";
    JSONUpdateFieldCommandResult[JSONUpdateFieldCommandResult["DocumentModel"] = 2] = "DocumentModel";
    JSONUpdateFieldCommandResult[JSONUpdateFieldCommandResult["ImageCorrespondence"] = 3] = "ImageCorrespondence";
    JSONUpdateFieldCommandResult[JSONUpdateFieldCommandResult["Caches"] = 4] = "Caches";
})(JSONUpdateFieldCommandResult || (JSONUpdateFieldCommandResult = {}));
export var JSONServerUpdateFieldType;
(function (JSONServerUpdateFieldType) {
    JSONServerUpdateFieldType[JSONServerUpdateFieldType["DocVariable"] = 1] = "DocVariable";
    JSONServerUpdateFieldType[JSONServerUpdateFieldType["MergeField"] = 2] = "MergeField";
})(JSONServerUpdateFieldType || (JSONServerUpdateFieldType = {}));
