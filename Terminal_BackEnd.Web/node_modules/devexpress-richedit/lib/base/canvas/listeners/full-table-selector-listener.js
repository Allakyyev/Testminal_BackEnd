import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { FrameBaseListener } from './frame-base-listener';
export class FullTableSelectorListener extends FrameBaseListener {
    baseFrameClassName() {
        return RendererClassNames.FULL_TABLE_SELECTOR;
    }
}
