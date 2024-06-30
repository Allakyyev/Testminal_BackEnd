import { ExtensionHelper } from '../../../../core/formats/utils/extension-helper';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { base64ToHex } from '../../../../base-utils/hexadecimal-converter';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RtfDrawingKeywords } from '../../../translation-table/rtf-drawing-keywords';
import { InlinePictureInfo } from '../../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
export class RtfPictureExporter {
    constructor(rtfBuilder, run, base64Uri) {
        this.rtfBuilder = rtfBuilder;
        this.base64Uri = base64Uri;
        this.run = run;
    }
    getPictureSize() {
        const width = UnitConverter.twipsToHundredthsOfMillimeter(this.run.size.originalSize.width);
        const height = UnitConverter.twipsToHundredthsOfMillimeter(this.run.size.originalSize.height);
        return new Size(width, height);
    }
    getImageBytesAsString() {
        const base64UriWithoutPrefix = ExtensionHelper.getBase64DataWithoutPrefix(this.base64Uri);
        return base64ToHex(base64UriWithoutPrefix);
    }
    exportPicture(nonVisualDrawingProperties) {
        this.rtfBuilder.openGroup();
        this.writePictureHeader(nonVisualDrawingProperties);
        try {
            this.rtfBuilder.writePictureBytes(this.getImageBytesAsString());
        }
        finally {
            this.rtfBuilder.closeGroup();
        }
    }
    writePictureShapeProperties(rtfBuilder, nonVisualDrawingProperties) {
        if (this.run instanceof InlinePictureInfo) {
            rtfBuilder.openGroup();
            try {
                rtfBuilder.writeCommand(RtfExportSR.PictureProperties);
                if (!StringUtils.isNullOrEmpty(nonVisualDrawingProperties.name))
                    rtfBuilder.writeShapeProperty(RtfDrawingKeywords.Name, nonVisualDrawingProperties.name);
                rtfBuilder.writeDescription(nonVisualDrawingProperties);
            }
            finally {
                rtfBuilder.closeGroup();
            }
        }
    }
    writePictureHeader(nonVisualDrawingProperties) {
        const pirctureSize = this.getPictureSize();
        const originalSize = this.run.size.originalSize.clone();
        const pictureScale = this.run.size.scale.clone();
        while (originalSize.width > 0x7FFF || originalSize.height > 0x7FFF) {
            originalSize.width /= 2;
            originalSize.height /= 2;
            pictureScale.width *= 2;
            pictureScale.height *= 2;
            pirctureSize.width /= 2;
            pirctureSize.height /= 2;
        }
        this.rtfBuilder.writeCommand(RtfExportSR.Picture);
        this.writePictureShapeProperties(this.rtfBuilder, nonVisualDrawingProperties);
        this.rtfBuilder.writeCommand(this.getRtfPictureType());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureWidth, Math.max(pirctureSize.width, 1));
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureHeight, Math.max(pirctureSize.height, 1));
        const roundedScaleWidth = Math.max(Math.round(pictureScale.width), 1);
        const roundedScaleHeight = Math.max(Math.round(pictureScale.height), 1);
        const desiredPictureWidth = originalSize.width / roundedScaleWidth * pictureScale.width - 0.5;
        const desiredPictureHeight = originalSize.height / roundedScaleHeight * pictureScale.height - 0.5;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureDesiredWidth, Math.max(desiredPictureWidth, 1));
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureDesiredHeight, Math.max(desiredPictureHeight, 1));
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureScaleX, roundedScaleWidth);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PictureScaleY, roundedScaleHeight);
    }
}
