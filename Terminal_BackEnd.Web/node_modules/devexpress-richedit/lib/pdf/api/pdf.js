import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { PdfExporter } from '../exporter';
export function pdfExport(docProcessor, callback, options) {
    new PdfExporter(docProcessor).export(callback, options);
}
export function downloadPdf(docProcessor, fileName, options) {
    pdfExport(docProcessor, (blob, _stream) => {
        FileUtils.startDownloadFileLocal(blob, fileName + '.pdf');
    }, options);
}
