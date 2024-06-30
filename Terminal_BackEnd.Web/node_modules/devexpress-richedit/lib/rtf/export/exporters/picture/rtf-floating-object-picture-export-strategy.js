import { RtfDrawingKeywords } from '../../../translation-table/rtf-drawing-keywords';
import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfPictureExportStrategy } from './rtf-picture-export-strategy';
export class RtfFloatingObjectPictureExportStrategy extends RtfPictureExportStrategy {
    exportShapePicturePrefix(rtfBuilder) {
        rtfBuilder.openGroup();
        rtfBuilder.writeCommand(RtfExportSR.ShapeProperty);
        rtfBuilder.writeShapePropertyName(RtfDrawingKeywords.PictureBinaryData);
        rtfBuilder.openGroup();
        rtfBuilder.writeCommand(RtfExportSR.ShapePropertyValue);
    }
    exportShapePicturePostfix(rtfBuilder) {
        rtfBuilder.closeGroup();
        rtfBuilder.closeGroup();
    }
}
