import { RtfExportSR } from '../../../translation-table/rtf-export-sr';
import { RtfPictureExportStrategy } from './rtf-picture-export-strategy';
export class RtfInlinePictureExportStrategy extends RtfPictureExportStrategy {
    exportShapePicturePrefix(rtfBuilder) {
        rtfBuilder.openGroup();
        rtfBuilder.writeCommand(RtfExportSR.ShapePicture);
    }
    exportShapePicturePostfix(rtfBuilder) {
        rtfBuilder.closeGroup();
    }
}
