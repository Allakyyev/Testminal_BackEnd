import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { FrameBaseListener } from './frame-base-listener';
export class ResizeTableListener extends FrameBaseListener {
    baseFrameClassName() {
        return RendererClassNames.TABLE_BORDER_LINE;
    }
}
