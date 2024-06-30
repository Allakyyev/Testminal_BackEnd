export var JSONBorderBaseProperty;
(function (JSONBorderBaseProperty) {
    JSONBorderBaseProperty[JSONBorderBaseProperty["Style"] = 0] = "Style";
    JSONBorderBaseProperty[JSONBorderBaseProperty["Color"] = 1] = "Color";
    JSONBorderBaseProperty[JSONBorderBaseProperty["ColorIndex"] = 2] = "ColorIndex";
    JSONBorderBaseProperty[JSONBorderBaseProperty["Width"] = 3] = "Width";
    JSONBorderBaseProperty[JSONBorderBaseProperty["Offset"] = 4] = "Offset";
    JSONBorderBaseProperty[JSONBorderBaseProperty["Frame"] = 5] = "Frame";
    JSONBorderBaseProperty[JSONBorderBaseProperty["Shadow"] = 6] = "Shadow";
})(JSONBorderBaseProperty || (JSONBorderBaseProperty = {}));
export var JSONShadingInfoProperty;
(function (JSONShadingInfoProperty) {
    JSONShadingInfoProperty[JSONShadingInfoProperty["ShadingPattern"] = 0] = "ShadingPattern";
    JSONShadingInfoProperty[JSONShadingInfoProperty["BackColor"] = 1] = "BackColor";
    JSONShadingInfoProperty[JSONShadingInfoProperty["ForeColor"] = 2] = "ForeColor";
    JSONShadingInfoProperty[JSONShadingInfoProperty["ForeColorIndex"] = 3] = "ForeColorIndex";
    JSONShadingInfoProperty[JSONShadingInfoProperty["BackColorIndex"] = 4] = "BackColorIndex";
})(JSONShadingInfoProperty || (JSONShadingInfoProperty = {}));
export var JSONSDrawingColorProperty;
(function (JSONSDrawingColorProperty) {
    JSONSDrawingColorProperty[JSONSDrawingColorProperty["Color"] = 0] = "Color";
})(JSONSDrawingColorProperty || (JSONSDrawingColorProperty = {}));
export var JSONSDrawingColorModelInfoProperty;
(function (JSONSDrawingColorModelInfoProperty) {
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["ColorType"] = 0] = "ColorType";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["Rgb"] = 1] = "Rgb";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["System"] = 2] = "System";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["Scheme"] = 3] = "Scheme";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["Preset"] = 4] = "Preset";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["Hsl"] = 5] = "Hsl";
    JSONSDrawingColorModelInfoProperty[JSONSDrawingColorModelInfoProperty["ScRgb"] = 6] = "ScRgb";
})(JSONSDrawingColorModelInfoProperty || (JSONSDrawingColorModelInfoProperty = {}));
export var JSONSColorHSLProperty;
(function (JSONSColorHSLProperty) {
    JSONSColorHSLProperty[JSONSColorHSLProperty["Hue"] = 0] = "Hue";
    JSONSColorHSLProperty[JSONSColorHSLProperty["Saturation"] = 1] = "Saturation";
    JSONSColorHSLProperty[JSONSColorHSLProperty["Luminance"] = 2] = "Luminance";
})(JSONSColorHSLProperty || (JSONSColorHSLProperty = {}));
export var JSONSScRGBColorProperty;
(function (JSONSScRGBColorProperty) {
    JSONSScRGBColorProperty[JSONSScRGBColorProperty["ScR"] = 0] = "ScR";
    JSONSScRGBColorProperty[JSONSScRGBColorProperty["ScG"] = 1] = "ScG";
    JSONSScRGBColorProperty[JSONSScRGBColorProperty["ScB"] = 2] = "ScB";
})(JSONSScRGBColorProperty || (JSONSScRGBColorProperty = {}));
export var JSONSelectionState;
(function (JSONSelectionState) {
    JSONSelectionState[JSONSelectionState["ForwardDirection"] = 0] = "ForwardDirection";
    JSONSelectionState[JSONSelectionState["KeepX"] = 1] = "KeepX";
    JSONSelectionState[JSONSelectionState["EndOfLine"] = 2] = "EndOfLine";
    JSONSelectionState[JSONSelectionState["Intervals"] = 3] = "Intervals";
})(JSONSelectionState || (JSONSelectionState = {}));
export var JSONFixedInterval;
(function (JSONFixedInterval) {
    JSONFixedInterval[JSONFixedInterval["Start"] = 0] = "Start";
    JSONFixedInterval[JSONFixedInterval["Length"] = 1] = "Length";
})(JSONFixedInterval || (JSONFixedInterval = {}));
export var JSONCheckSpellingCommand;
(function (JSONCheckSpellingCommand) {
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["StartPosition"] = 0] = "StartPosition";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["EndPosition"] = 1] = "EndPosition";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["TextToCheck"] = 2] = "TextToCheck";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["SpellingErrors"] = 3] = "SpellingErrors";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["IntervalsToCheck"] = 4] = "IntervalsToCheck";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["CheckedIntervals"] = 5] = "CheckedIntervals";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["SubDocumentId"] = 6] = "SubDocumentId";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["AddedWord"] = 7] = "AddedWord";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["CustomDictionaryGuid"] = 8] = "CustomDictionaryGuid";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["ErrorType"] = 9] = "ErrorType";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["Suggestions"] = 10] = "Suggestions";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["ErrorWord"] = 11] = "ErrorWord";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["ErrorStart"] = 12] = "ErrorStart";
    JSONCheckSpellingCommand[JSONCheckSpellingCommand["ErrorLength"] = 13] = "ErrorLength";
})(JSONCheckSpellingCommand || (JSONCheckSpellingCommand = {}));
export var JSONSize;
(function (JSONSize) {
    JSONSize[JSONSize["Width"] = 0] = "Width";
    JSONSize[JSONSize["Height"] = 1] = "Height";
})(JSONSize || (JSONSize = {}));
export var JSONForceSyncWithServerCommand;
(function (JSONForceSyncWithServerCommand) {
    JSONForceSyncWithServerCommand[JSONForceSyncWithServerCommand["Id"] = 0] = "Id";
})(JSONForceSyncWithServerCommand || (JSONForceSyncWithServerCommand = {}));
export var JSONInsertContentFromServerCommand;
(function (JSONInsertContentFromServerCommand) {
    JSONInsertContentFromServerCommand[JSONInsertContentFromServerCommand["UserRequestId"] = 0] = "UserRequestId";
    JSONInsertContentFromServerCommand[JSONInsertContentFromServerCommand["Id"] = 1] = "Id";
    JSONInsertContentFromServerCommand[JSONInsertContentFromServerCommand["Model"] = 2] = "Model";
    JSONInsertContentFromServerCommand[JSONInsertContentFromServerCommand["SimpleText"] = 3] = "SimpleText";
})(JSONInsertContentFromServerCommand || (JSONInsertContentFromServerCommand = {}));
