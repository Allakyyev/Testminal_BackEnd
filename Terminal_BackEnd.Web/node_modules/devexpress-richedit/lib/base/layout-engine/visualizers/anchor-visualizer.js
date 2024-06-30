import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { BaseVisualizer } from './base-visualizer';
const SMAL_ICON_SIZE = 16;
export class AnchorVisualizer extends BaseVisualizer {
    NotifySelectionChanged(_selection) {
        if (this.isFloatingObjectSelected())
            this.show();
        else
            this.hide();
    }
    NotifyScrollPositionChanged() { }
    NotifyPagesReady(_pageChanges) {
        if (this.isFloatingObjectSelected())
            this.show();
    }
    NotifyFullyFormatted(_pageCount) { }
    ;
    show() {
        const pos = this.control.selection.specialRunInfo.getPosition();
        const subDocument = this.control.selection.specialRunInfo.getParentSubDocument();
        const layoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, pos, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, pos, this.control.selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (layoutPosition != null) {
            const x = layoutPosition.getLayoutX(this.control.measurer);
            const y = layoutPosition.getLayoutY();
            this.bounds = new Rectangle(x - SMAL_ICON_SIZE, y, SMAL_ICON_SIZE, SMAL_ICON_SIZE);
            this.pageIndex = layoutPosition.pageIndex;
            this.raiseShow();
        }
    }
    isFloatingObjectSelected() {
        return this.control.selection.specialRunInfo.isSelected() && this.control.selection.specialRunInfo.isSelectedAnchorObject;
    }
}
