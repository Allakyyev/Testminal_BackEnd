import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { Log } from '../../../../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../../../core/rich-utils/debug/logger/base-logger/log-source';
import { DocumentRenderer } from '../common/document-renderer';
import { SelectionRendererBase } from './selection-renderer-base';
export class SearchSelectionRenderer extends SelectionRendererBase {
    constructor() {
        super(...arguments);
        this.layoutPageFlag = LayoutPageFlags.IsSearchSelectionRendered;
    }
    renderAllPageSelection(layout, pageIndex, force) {
        super.renderAllPageSelection(layout, pageIndex, force);
        Log.print(LogSource.SelectionRenderer, "renderAllPageSearchSelection", `pageIndex: ${pageIndex}`);
    }
    closeDocument() {
        this.getLayoutSelectionInfo().reset();
    }
    getLayoutSelectionInfo() {
        return this.layoutSelection.searchInfo;
    }
    getContainer(pageElement) {
        return DocumentRenderer.getSearchSelectionContainerCore(pageElement);
    }
}
