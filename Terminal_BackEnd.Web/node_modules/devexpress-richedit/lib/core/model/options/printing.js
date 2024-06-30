export class PrintingSettings {
    constructor() {
        this.mode = PrintMode.ServerPdf;
        this.closePrintDialogWithHtmlPreview = true;
    }
    copyFrom(obj) {
        this.mode = obj.mode;
        this.closePrintDialogWithHtmlPreview = obj.closePrintDialogWithHtmlPreview;
    }
    clone() {
        const result = new PrintingSettings();
        result.copyFrom(this);
        return result;
    }
}
export var PrintMode;
(function (PrintMode) {
    PrintMode[PrintMode["ServerPdf"] = 0] = "ServerPdf";
    PrintMode[PrintMode["ClientHtml"] = 1] = "ClientHtml";
    PrintMode[PrintMode["ClientPdf"] = 2] = "ClientPdf";
})(PrintMode || (PrintMode = {}));
