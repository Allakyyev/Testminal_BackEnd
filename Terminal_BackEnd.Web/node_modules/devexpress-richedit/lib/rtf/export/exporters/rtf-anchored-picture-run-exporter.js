import { RtfFloatingObjectPictureExportStrategy } from './picture/rtf-floating-object-picture-export-strategy';
import { RtfAnchoredRunExporter } from './rtf-anchored-run-exporter';
export class RtfAnchoredPictureRunExporter extends RtfAnchoredRunExporter {
    constructor(rtfBuilder, pictureRun, imageCache) {
        super(rtfBuilder, pictureRun.anchorInfo, pictureRun.shape, pictureRun.size, pictureRun.info.containerProperties);
        this.pictureRun = pictureRun;
        this.imageCache = imageCache;
    }
    getWidth() {
        return this.size.actualSize.width;
    }
    getHeight() {
        return this.size.actualSize.height;
    }
    exportContent() {
        const exportStrategy = new RtfFloatingObjectPictureExportStrategy();
        exportStrategy.export(this.rtfBuilder, this.pictureRun.info, this.imageCache, this.pictureRun.info.containerProperties);
    }
}
