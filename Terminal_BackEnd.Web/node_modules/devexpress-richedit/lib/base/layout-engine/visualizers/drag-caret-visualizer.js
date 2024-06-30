import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { DragCaretListener } from '../../canvas/listeners/drag-caret-listener';
import { BaseVisualizer } from './base-visualizer';
export class DragCaretVisualizer extends BaseVisualizer {
    show(htr) {
        const pageIndex = htr.pageIndex;
        const bounds = new Rectangle(htr.getLayoutX(this.control.measurer, DocumentLayoutDetailsLevel.Character), htr.getLayoutY(DocumentLayoutDetailsLevel.Row), DragCaretListener.CARET_WIDTH, htr.row.height - htr.row.getSpacingBefore());
        if (!this.bounds || this.pageIndex != pageIndex || !bounds.equals(this.bounds)) {
            this.pageIndex = pageIndex;
            this.bounds = bounds;
            this.raiseShow();
        }
    }
}
