import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfPictureExporter } from './rtf-picture-exporter';
export class RtfPngPictureExporter extends RtfPictureExporter {
    getRtfPictureType() {
        return RtfExportSR.PNGPictureKeyword;
    }
    constructor(rtfBuilder, run, base64Uri) {
        super(rtfBuilder, run, base64Uri);
    }
}
