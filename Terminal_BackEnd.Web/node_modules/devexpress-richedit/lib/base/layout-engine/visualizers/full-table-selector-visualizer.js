import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { LayoutChangeType } from '../../../core/layout-formatter/changes/changes/layout-change-base';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { DragCaretListener } from '../../canvas/listeners/drag-caret-listener';
import { BaseVisualizer } from './base-visualizer';
export class FullTableSelectorVisualizer extends BaseVisualizer {
    NotifyPagesReady(pageChanges) {
        for (let c of pageChanges) {
            if (c.changeType == LayoutChangeType.Deleted)
                continue;
            this.NotifySelectionChanged(this.control.selection);
            break;
        }
    }
    NotifyFullyFormatted(_pageCount) { }
    ;
    NotifySelectionChanged(selection) {
        const tableInfo = selection.tableInfo;
        if (tableInfo.extendedData.numRows) {
            const sd = selection.activeSubDocument;
            const tbl = sd.tables[tableInfo.table.index];
            if (tbl) {
                const tblPos = tbl.getStartPosition();
                const lp = (sd.isMain() ?
                    new LayoutPositionMainSubDocumentCreator(this.control.layout, sd, tblPos, DocumentLayoutDetailsLevel.Row) :
                    new LayoutPositionOtherSubDocumentCreator(this.control.layout, sd, tblPos, this.control.selection.pageIndex, DocumentLayoutDetailsLevel.Row))
                    .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
                if (lp && lp.row.tableCellInfo) {
                    this.pageIndex = lp.pageIndex;
                    const r = lp.row.tableCellInfo.parentRow.parentTable.createRectangle();
                    r.setPosition(new Point(lp.getLayoutX(null, DocumentLayoutDetailsLevel.Column) + r.x - FullTableSelectorVisualizer.OFFSET, lp.getLayoutY(DocumentLayoutDetailsLevel.Column) + r.y - FullTableSelectorVisualizer.OFFSET));
                    r.setSize(new Size(FullTableSelectorVisualizer.SIZE, FullTableSelectorVisualizer.SIZE));
                    this.bounds = r;
                    this.raiseShow();
                    return;
                }
            }
        }
        this.raiseHide();
    }
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
FullTableSelectorVisualizer.SIZE = 12;
FullTableSelectorVisualizer.OFFSET = FullTableSelectorVisualizer.SIZE;
