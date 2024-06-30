import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { FrameBaseListener } from './frame-base-listener';
export class AnchorListener extends FrameBaseListener {
    constructor(rendererCache, stringResources, readOnlyPropertyHolder, fieldOptions) {
        super(rendererCache, stringResources, fieldOptions);
        this.readOnlyPropertyHolder = readOnlyPropertyHolder;
    }
    baseFrameClassName() {
        return RendererClassNames.ANCHOR;
    }
    NotifyShow(pageIndex, bounds, tip, isTextBox, isAnchoredObject, rotation) {
        if (this.readOnlyPropertyHolder.isReadOnlyPersistent)
            super.NotifyHide();
        else
            super.NotifyShow(pageIndex, bounds, tip, isTextBox, isAnchoredObject, rotation);
    }
}
