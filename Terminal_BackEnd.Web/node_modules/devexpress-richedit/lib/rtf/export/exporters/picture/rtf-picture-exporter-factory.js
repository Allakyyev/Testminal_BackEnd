import { ExtensionHelper } from '../../../../core/formats/utils/extension-helper';
import { RtfJpegPictureExporter } from './rtf-jpeg-picture-exporter';
import { RtfPngPictureExporter } from './rtf-png-picture-exporter';
export class RtfPictureExporterFactory {
    static createRtfPictureExporter(rtfBuilder, run, _imageCache) {
        const base64Uri = run.size.cacheInfo.base64;
        const contentType = ExtensionHelper.getMimeTypeFromBase64Uri(base64Uri);
        const extension = ExtensionHelper.convertMimeTypeToExtension(contentType);
        if (extension == 'jpeg')
            return new RtfJpegPictureExporter(rtfBuilder, run, base64Uri);
        else
            return new RtfPngPictureExporter(rtfBuilder, run, base64Uri);
    }
}
