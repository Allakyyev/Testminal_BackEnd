import { AnchorListener } from '../../canvas/listeners/anchor-listener';
import { AutoScrollListener } from '../../canvas/listeners/auto-scroll-listener';
import { DragCaretListener } from '../../canvas/listeners/drag-caret-listener';
import { FullTableSelectorListener } from '../../canvas/listeners/full-table-selector-listener';
import { ResizeBoxListener } from '../../canvas/listeners/resize-box-listener';
import { ResizeTableListener } from '../../canvas/listeners/resize-table-listener';
import { AnchorVisualizer } from './anchor-visualizer';
import { AutoScrollVisualizer } from './auto-scroll-visualizer';
import { DragCaretVisualizer } from './drag-caret-visualizer';
import { FullTableSelectorVisualizer } from './full-table-selector-visualizer';
import { ResizeBoxVisualizer } from './resize-box-visualizer';
import { ResizeTableVisualizer } from './resize-table-visualizer';
export class BoxVisualizerManager {
    constructor(control) {
        this.dragCaretVisualizer = new DragCaretVisualizer(control);
        this.resizeBoxVisualizer = new ResizeBoxVisualizer(control);
        this.resizeTableVisualizer = new ResizeTableVisualizer(control);
        this.anchorVisualizer = new AnchorVisualizer(control);
        this.autoScrollVisualizer = new AutoScrollVisualizer(control);
        this.fullTableSelectorVisualizer = new FullTableSelectorVisualizer(control);
    }
    initListeners(viewManager) {
        const rendererCache = viewManager.cache;
        this.dragCaretVisualizer.onChanged.add(new DragCaretListener(rendererCache, viewManager.stringResources, viewManager.fieldOptions));
        this.resizeBoxVisualizer.onChanged.add(new ResizeBoxListener(rendererCache, viewManager.stringResources, viewManager.readOnlyPropertyHolder, viewManager.fieldOptions));
        this.resizeTableVisualizer.onChanged.add(new ResizeTableListener(rendererCache, viewManager.stringResources, viewManager.fieldOptions));
        this.anchorVisualizer.onChanged.add(new AnchorListener(rendererCache, viewManager.stringResources, viewManager.readOnlyPropertyHolder, viewManager.fieldOptions));
        this.autoScrollVisualizer.onChanged.add(new AutoScrollListener(viewManager.serviceContainer));
        this.fullTableSelectorVisualizer.onChanged.add(new FullTableSelectorListener(rendererCache, viewManager.stringResources, viewManager.fieldOptions));
    }
    closeDocument() {
        this.resizeBoxVisualizer.closeDocument();
        this.dragCaretVisualizer.closeDocument();
        this.resizeTableVisualizer.closeDocument();
        this.anchorVisualizer.closeDocument();
        this.autoScrollVisualizer.closeDocument();
        this.fullTableSelectorVisualizer.closeDocument();
    }
}
