import { Browser } from '@devexpress/utils/lib/browser';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MouseEventSource } from '../../mouse-handler/mouse-event-source';
import { DocumentRenderer } from '../renderes/common/document-renderer';
import { FrameBaseListener } from './frame-base-listener';
export class ResizeBoxListener extends FrameBaseListener {
    constructor(rendererCache, stringResources, readOnlyPropertyHolder, fieldOptions) {
        super(rendererCache, stringResources, fieldOptions);
        this.readOnlyPropertyHolder = readOnlyPropertyHolder;
        this.initElement(false);
    }
    baseFrameClassName() {
        return FrameBaseListener.CLASSNAMES.CONTAINER;
    }
    static getCornerPrefix() {
        return FrameBaseListener.CLASSNAMES.CORNER_ELEM_PREFIX +
            (Browser.TouchUI ? FrameBaseListener.CLASSNAMES.CORNER_TOUCH_POSTFIX : "");
    }
    initElement(reinit) {
        if (reinit)
            this.initFrameElement();
        this.isReadOnly = this.readOnlyPropertyHolder.isReadOnlyPersistent;
        const cornerPrefix = ResizeBoxListener.getCornerPrefix();
        ListUtils.forEach(ResizeBoxListener.cornerLinesInfo, (info) => {
            const lineElem = DocumentRenderer.renderContainer(FrameBaseListener.CLASSNAMES.CORNER_LINE_PREFIX + info[0]);
            this.baseFrame.appendChild(lineElem);
            if (!this.isReadOnly)
                ListUtils.forEach(info, (direction) => {
                    lineElem.appendChild(DocumentRenderer.renderContainer(cornerPrefix + direction));
                }, 1);
            else
                lineElem.style.cursor = 'auto';
        });
        if (!this.isReadOnly) {
            this.baseFrame.appendChild(DocumentRenderer.renderContainer(FrameBaseListener.CLASSNAMES.ROTATION_BOX));
            this.baseFrame.appendChild(DocumentRenderer.renderContainer(FrameBaseListener.CLASSNAMES.ROTATION_LINE));
        }
    }
    NotifyShow(pageIndex, bounds, tip, isTextBox, isAnchoredObject, rotation) {
        if (this.readOnlyPropertyHolder.isReadOnlyPersistent != this.isReadOnly)
            this.initElement(true);
        super.NotifyShow(pageIndex, bounds, tip, isTextBox, isAnchoredObject, rotation);
        this.setCursorsConsiderRotation(rotation);
    }
    setCursorsConsiderRotation(rotation) {
        const cornerPrefix = ResizeBoxListener.getCornerPrefix();
        const shift = Math.round(rotation * 180 / Math.PI / 45);
        const cornerElements = this.baseFrame.querySelectorAll(`[class^=${FrameBaseListener.CLASSNAMES.CORNER_ELEM_PREFIX}]`);
        cornerElements.forEach((node) => {
            const baseElementDirection = node.className.substr(cornerPrefix.length);
            const baseCursorNameIndex = ResizeBoxListener.directions.indexOf(baseElementDirection);
            const index = (baseCursorNameIndex + shift) % ResizeBoxListener.directions.length;
            node.style.cursor = ResizeBoxListener.cursorNames[index];
        });
    }
}
ResizeBoxListener.cornerLinesInfo = [
    ["W", "W"],
    ["E", "E"],
    ["N", "NW", "N", "NE"],
    ["S", "SW", "S", "SE"]
];
ResizeBoxListener.directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
ResizeBoxListener.cursorNames = ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"];
ResizeBoxListener.directionToSource = {
    "NW": MouseEventSource.ResizeBox_NW,
    "NE": MouseEventSource.ResizeBox_NE,
    "SE": MouseEventSource.ResizeBox_SE,
    "SW": MouseEventSource.ResizeBox_SW,
    "N": MouseEventSource.ResizeBox_N,
    "E": MouseEventSource.ResizeBox_E,
    "S": MouseEventSource.ResizeBox_S,
    "W": MouseEventSource.ResizeBox_W
};
