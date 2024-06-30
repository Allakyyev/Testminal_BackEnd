import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfPictureExporter } from './rtf-picture-exporter';
export class RtfJpegPictureExporter extends RtfPictureExporter {
    getRtfPictureType() {
        return RtfExportSR.JpegPictureKeyword;
    }
    constructor(rtfBuilder, run, base64Uri) {
        super(rtfBuilder, run, base64Uri);
    }
}
