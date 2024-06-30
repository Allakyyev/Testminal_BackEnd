import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DocumentFormat } from '../document-format';
export class FileNameHelper {
    constructor(fullPath, isPDF, documentFormat) {
        const pattern = StringUtils.trim(fullPath).replace(/\//g, "\\").match(/(.*?\\?)([^\\]*)(\..+?)$/i);
        this.isPDF = isPDF;
        this.folderPath = pattern ? FileNameHelper.normalizeVirtualFolderPath(pattern[1], false) : "";
        this.name = pattern ? pattern[2] : fullPath;
        this.extension = this.isPDF ? ".pdf" : (pattern ? pattern[3] : "");
        this.documentFormat = documentFormat ? documentFormat : FileNameHelper.convertToDocumentFormat(`.${this.extension}`);
    }
    getFullPath() {
        return this.folderPath + this.name + this.extension;
    }
    checkFileName() {
        if (this.name.length === 0)
            throw new Error("File name is not defined");
    }
    checkExtension() {
        if (this.extension.length === 0)
            throw new Error("File extension is not defined");
    }
    static normalizeVirtualFolderPath(folderPath, isNormalizePath) {
        if (isNormalizePath)
            folderPath = StringUtils.trim(folderPath).replace(/\//g, "\\");
        if (folderPath.length == 0 || folderPath == "\\")
            return "";
        return StringUtils.getSymbolFromEnd(folderPath, 1) == "\\" ? folderPath : folderPath + "\\";
    }
    static convertToDocumentFormat(fileName) {
        const fName = StringUtils.trim(fileName);
        if (FileNameHelper.testFormat(fName, "doc"))
            return DocumentFormat.Doc;
        if (FileNameHelper.testFormat(fName, "epub"))
            return DocumentFormat.ePub;
        if (FileNameHelper.testFormat(fName, "html") || FileNameHelper.testFormat(fName, "htm"))
            return DocumentFormat.Html;
        if (FileNameHelper.testFormat(fName, "mht"))
            return DocumentFormat.Mht;
        if (FileNameHelper.testFormat(fName, "odt"))
            return DocumentFormat.OpenDocument;
        if (FileNameHelper.testFormat(fName, "docx"))
            return DocumentFormat.OpenXml;
        if (FileNameHelper.testFormat(fName, "txt"))
            return DocumentFormat.PlainText;
        if (FileNameHelper.testFormat(fName, "rtf"))
            return DocumentFormat.Rtf;
        if (FileNameHelper.testFormat(fName, "xml"))
            return DocumentFormat.WordML;
        return DocumentFormat.Undefined;
    }
    static convertExtensionToDocumentFormat(extension) {
        switch (extension.toLowerCase()) {
            case "doc":
            case ".doc": return DocumentFormat.Doc;
            case "epub":
            case ".epub": return DocumentFormat.ePub;
            case "html":
            case ".html":
            case "htm":
            case "htm": return DocumentFormat.Html;
            case "mht":
            case ".mht": return DocumentFormat.Mht;
            case "odt":
            case ".odt": return DocumentFormat.OpenDocument;
            case "docx":
            case ".docx": return DocumentFormat.OpenXml;
            case "txt":
            case ".txt": return DocumentFormat.PlainText;
            case "rtf":
            case ".rtf": return DocumentFormat.Rtf;
            case "xml":
            case ".xml": return DocumentFormat.WordML;
            default: return DocumentFormat.Undefined;
        }
    }
    static convertToString(docFormat) {
        switch (docFormat) {
            case DocumentFormat.Doc: return ".doc";
            case DocumentFormat.ePub: return ".epub";
            case DocumentFormat.Html: return ".html";
            case DocumentFormat.Mht: return ".mht";
            case DocumentFormat.OpenDocument: return ".odt";
            case DocumentFormat.PlainText: return ".txt";
            case DocumentFormat.Rtf: return ".rtf";
            case DocumentFormat.WordML: return ".xml";
            case DocumentFormat.OpenXml: return ".docx";
            default: return "";
        }
    }
    static testFormat(fileName, extension) {
        return new RegExp(`.*\\.${extension}$`, "i").test(fileName);
    }
}
