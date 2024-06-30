export class PdfSettings {
    constructor() {
        this._pdfDocument = window.PDFDocument;
        this._blobStream = window.BlobStream;
    }
    get pdfDocument() { return this._pdfDocument ? this._pdfDocument : window.PDFDocument; }
    ;
    set pdfDocument(val) { this._pdfDocument = val; }
    ;
    get blobStream() { return this._blobStream ? this._blobStream : window.BlobStream; }
    ;
    set blobStream(val) { this._blobStream = val; }
    ;
    copyFrom(obj) {
        this._pdfDocument = obj.pdfDocument;
        this._blobStream = obj.blobStream;
        this.exportUrl = obj.exportUrl;
        this.pdfKitScriptUrl = obj.pdfKitScriptUrl;
        this.convertImageToCompatibleFormat = obj.convertImageToCompatibleFormat;
    }
    clone() {
        const result = new PdfSettings();
        result.copyFrom(this);
        return result;
    }
}
