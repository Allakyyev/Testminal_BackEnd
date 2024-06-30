import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { Log } from '../../../../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../../../../core/rich-utils/debug/logger/base-logger/log-source';
import { DocumentRenderer } from '../common/document-renderer';
import { SelectionRendererBase } from './selection-renderer-base';
export class MisspelledSelectionRenderer extends SelectionRendererBase {
    constructor() {
        super(...arguments);
        this.layoutPageFlag = LayoutPageFlags.IsMisspelledSelectionRendered;
    }
    renderAllPageSelection(layout, pageIndex, force) {
        super.renderAllPageSelection(layout, pageIndex, force);
        Log.print(LogSource.SelectionRenderer, "renderAllPageMisspelledSelection", `pageIndex: ${pageIndex}`);
    }
    closeDocument() {
        this.getLayoutSelectionInfo().reset();
    }
    getLayoutSelectionInfo() {
        return this.layoutSelection.misspelledInfo;
    }
    getContainer(pageElement) {
        return DocumentRenderer.getMisspelledSelectionContainerCore(pageElement);
    }
}
