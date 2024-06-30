import { DxMimeType } from '@devexpress/utils/lib/utils/mime-type';
export var DocumentFormat;
(function (DocumentFormat) {
    DocumentFormat[DocumentFormat["Undefined"] = 0] = "Undefined";
    DocumentFormat[DocumentFormat["PlainText"] = 1] = "PlainText";
    DocumentFormat[DocumentFormat["Rtf"] = 2] = "Rtf";
    DocumentFormat[DocumentFormat["Html"] = 3] = "Html";
    DocumentFormat[DocumentFormat["OpenXml"] = 4] = "OpenXml";
    DocumentFormat[DocumentFormat["Mht"] = 5] = "Mht";
    DocumentFormat[DocumentFormat["WordML"] = 6] = "WordML";
    DocumentFormat[DocumentFormat["OpenDocument"] = 7] = "OpenDocument";
    DocumentFormat[DocumentFormat["ePub"] = 9] = "ePub";
    DocumentFormat[DocumentFormat["Doc"] = 10] = "Doc";
})(DocumentFormat || (DocumentFormat = {}));
export const mimeTypeIntoDocumentFormat = {
    [DxMimeType.OpenXml]: DocumentFormat.OpenXml,
    [DxMimeType.Docm]: DocumentFormat.OpenXml,
    [DxMimeType.Rtf]: DocumentFormat.Rtf,
    [DxMimeType.PlainText]: DocumentFormat.PlainText,
};
export const documentFormatIntoMimeType = {
    [DocumentFormat.OpenXml]: DxMimeType.OpenXml,
    [DocumentFormat.Rtf]: DxMimeType.Rtf,
    [DocumentFormat.PlainText]: DxMimeType.PlainText,
};
