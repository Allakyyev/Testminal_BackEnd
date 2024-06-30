export class TableConditionalStyle {
    constructor(tableProperties, tableRowProperties, tableCellProperties, maskedParagraphProperties, maskedCharacterProperties, tabs) {
        this.tableProperties = tableProperties;
        this.tableRowProperties = tableRowProperties;
        this.tableCellProperties = tableCellProperties;
        this.maskedParagraphProperties = maskedParagraphProperties;
        this.maskedCharacterProperties = maskedCharacterProperties;
        this.tabs = tabs;
    }
    clone() {
        var _a;
        return new TableConditionalStyle(this.tableProperties, this.tableRowProperties, this.tableCellProperties, this.maskedParagraphProperties, this.maskedCharacterProperties, (_a = this.tabs) === null || _a === void 0 ? void 0 : _a.clone());
    }
}
