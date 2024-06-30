import { RendererClassNames } from '../../../../core/canvas/renderer-class-names';
import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { LayoutSelectionFloatingObjectItem } from '../../../../core/layout/selection/layout-selection-items';
import { Log } from '../../../../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../../../core/rich-utils/debug/logger/base-logger/log-source';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../common/document-renderer';
import { SelectionRendererBase } from './selection-renderer-base';
import { TouchSelectionCircleElementsManager } from './touch-selection-circle-elements-manager';
const CHANGE_BLINK_CURSOR_DELAY = 350;
export class SelectionRenderer extends SelectionRendererBase {
    constructor(cache, layoutSelection) {
        super(cache, layoutSelection);
        this.layoutPageFlag = LayoutPageFlags.IsSelectionRendered;
        this.processIdChangeCursorToBlink = null;
        this.touchSelectionCircleElementsManager = new TouchSelectionCircleElementsManager(cache, layoutSelection);
    }
    dispose() {
        clearTimeout(this.processIdChangeCursorToBlink);
    }
    applySelectionChanges(layout) {
        this.switchCursorToBlinkState();
        super.applySelectionChanges(layout);
        this.touchSelectionCircleElementsManager.update();
    }
    renderAllPageSelection(layout, pageIndex, force) {
        this.switchCursorToBlinkState();
        super.renderAllPageSelection(layout, pageIndex, force);
        Log.print(LogSource.SelectionRenderer, "renderAllPageSelection", `pageIndex: ${pageIndex}`);
        this.touchSelectionCircleElementsManager.update();
    }
    closeDocument() {
        this.switchCursorToBlinkState();
        this.getLayoutSelectionInfo().reset();
        this.layoutSelection.pageIndex = -1;
        this.layoutSelection.subDocumentInfo = null;
    }
    renderItem(item, layoutPage) {
        if (item instanceof LayoutSelectionFloatingObjectItem) {
            const selectionElement = DocumentRenderer.renderContainer(item.baseClassName);
            DomUtils.setStyleSizeAndPosition(selectionElement.style, item);
            return selectionElement;
        }
        const selectionElement = super.renderItem(item, layoutPage);
        if (item.isCursor()) {
            this.processIdChangeCursorToBlink = setTimeout(() => {
                DomUtils.removeClassName(selectionElement, RendererClassNames.CURSOR_NO_BLINK_CLASS_NAME);
                this.processIdChangeCursorToBlink = null;
            }, CHANGE_BLINK_CURSOR_DELAY);
        }
        return selectionElement;
    }
    getLayoutSelectionInfo() {
        return this.layoutSelection.selectionInfo;
    }
    getContainer(pageElement) {
        return DocumentRenderer.getSelectionContainerCore(pageElement);
    }
    switchCursorToBlinkState() {
        if (this.processIdChangeCursorToBlink === null) {
            clearTimeout(this.processIdChangeCursorToBlink);
            this.processIdChangeCursorToBlink = null;
        }
    }
}
