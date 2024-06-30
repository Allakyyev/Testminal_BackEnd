import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { Log } from '../../../../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../../../core/rich-utils/debug/logger/base-logger/log-source';
import { DocumentRenderer } from '../common/document-renderer';
import { SelectionRendererBase } from './selection-renderer-base';
export class RangePermissionRenderer extends SelectionRendererBase {
    constructor() {
        super(...arguments);
        this.layoutPageFlag = LayoutPageFlags.IsRangePermissionsRendered;
    }
    renderAllPageSelection(layout, pageIndex, force) {
        super.renderAllPageSelection(layout, pageIndex, force);
        Log.print(LogSource.SelectionRenderer, "renderAllPageRangePermissions", `pageIndex: ${pageIndex}`);
    }
    renderItem(item, layoutPage) {
        const selectionElement = super.renderItem(item, layoutPage);
        selectionElement.style.backgroundColor = item.color;
        return selectionElement;
    }
    closeDocument() {
        this.getLayoutSelectionInfo().reset();
    }
    getLayoutSelectionInfo() {
        return this.layoutSelection.rangePermissionInfo;
    }
    getContainer(pageElement) {
        return DocumentRenderer.getRangePermissionsContainerCore(pageElement);
    }
}
