import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { FrameBaseListener } from './frame-base-listener';
export class DragCaretListener extends FrameBaseListener {
    baseFrameClassName() {
        return RendererClassNames.DRAG_CARET;
    }
}
DragCaretListener.CARET_WIDTH = 1;
