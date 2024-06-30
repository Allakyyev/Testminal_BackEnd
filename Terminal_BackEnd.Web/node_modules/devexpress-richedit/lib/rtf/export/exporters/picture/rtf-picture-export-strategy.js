import { RtfPictureExporterFactory } from './rtf-picture-exporter-factory';
export class RtfPictureExportStrategy {
    export(rtfBuilder, run, imageCache, nonVisualDrawingProperties) {
        this.exportShapePicturePrefix(rtfBuilder);
        const exporter = RtfPictureExporterFactory.createRtfPictureExporter(rtfBuilder, run, imageCache);
        exporter.exportPicture(nonVisualDrawingProperties);
        this.exportShapePicturePostfix(rtfBuilder);
    }
}
