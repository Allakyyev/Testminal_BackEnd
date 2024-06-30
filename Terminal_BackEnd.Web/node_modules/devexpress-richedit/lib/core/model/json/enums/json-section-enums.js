export var JSONSection;
(function (JSONSection) {
    JSONSection[JSONSection["StartPos"] = 0] = "StartPos";
    JSONSection[JSONSection["Length"] = 1] = "Length";
    JSONSection[JSONSection["Properties"] = 2] = "Properties";
    JSONSection[JSONSection["Headers"] = 3] = "Headers";
    JSONSection[JSONSection["Footers"] = 4] = "Footers";
})(JSONSection || (JSONSection = {}));
export var JSONColumnInfoProperty;
(function (JSONColumnInfoProperty) {
    JSONColumnInfoProperty[JSONColumnInfoProperty["Width"] = 0] = "Width";
    JSONColumnInfoProperty[JSONColumnInfoProperty["Space"] = 1] = "Space";
})(JSONColumnInfoProperty || (JSONColumnInfoProperty = {}));
export var JSONMergeSectionsCommandProperty;
(function (JSONMergeSectionsCommandProperty) {
    JSONMergeSectionsCommandProperty[JSONMergeSectionsCommandProperty["SectionIndex"] = 0] = "SectionIndex";
    JSONMergeSectionsCommandProperty[JSONMergeSectionsCommandProperty["GetPropertiesFromNext"] = 1] = "GetPropertiesFromNext";
})(JSONMergeSectionsCommandProperty || (JSONMergeSectionsCommandProperty = {}));
export var JSONInsertSectionCommandProperty;
(function (JSONInsertSectionCommandProperty) {
    JSONInsertSectionCommandProperty[JSONInsertSectionCommandProperty["Position"] = 0] = "Position";
    JSONInsertSectionCommandProperty[JSONInsertSectionCommandProperty["SectionProperties"] = 1] = "SectionProperties";
})(JSONInsertSectionCommandProperty || (JSONInsertSectionCommandProperty = {}));
export var JSONSectionProperty;
(function (JSONSectionProperty) {
    JSONSectionProperty[JSONSectionProperty["MarginLeft"] = 0] = "MarginLeft";
    JSONSectionProperty[JSONSectionProperty["MarginTop"] = 1] = "MarginTop";
    JSONSectionProperty[JSONSectionProperty["MarginRight"] = 2] = "MarginRight";
    JSONSectionProperty[JSONSectionProperty["MarginBottom"] = 3] = "MarginBottom";
    JSONSectionProperty[JSONSectionProperty["ColumnCount"] = 4] = "ColumnCount";
    JSONSectionProperty[JSONSectionProperty["Space"] = 5] = "Space";
    JSONSectionProperty[JSONSectionProperty["ColumnsInfo"] = 6] = "ColumnsInfo";
    JSONSectionProperty[JSONSectionProperty["PageWidth"] = 7] = "PageWidth";
    JSONSectionProperty[JSONSectionProperty["PageHeight"] = 8] = "PageHeight";
    JSONSectionProperty[JSONSectionProperty["StartType"] = 9] = "StartType";
    JSONSectionProperty[JSONSectionProperty["Landscape"] = 10] = "Landscape";
    JSONSectionProperty[JSONSectionProperty["EqualWidthColumns"] = 11] = "EqualWidthColumns";
    JSONSectionProperty[JSONSectionProperty["DifferentFirstPage"] = 12] = "DifferentFirstPage";
    JSONSectionProperty[JSONSectionProperty["HeaderOffset"] = 13] = "HeaderOffset";
    JSONSectionProperty[JSONSectionProperty["FooterOffset"] = 14] = "FooterOffset";
    JSONSectionProperty[JSONSectionProperty["PaperKind"] = 15] = "PaperKind";
    JSONSectionProperty[JSONSectionProperty["FirstPageNumber"] = 16] = "FirstPageNumber";
    JSONSectionProperty[JSONSectionProperty["ContinueNumbering"] = 17] = "ContinueNumbering";
})(JSONSectionProperty || (JSONSectionProperty = {}));
