import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../core/layout/document-layout-details-level';
import { LayoutPoint } from '../../core/layout/layout-point';
export function getLayoutPoint(layoutFormatterManager, subDocument, position, endOfLine, pageIndex) {
    if (position > subDocument.getDocumentEndPosition())
        position = subDocument.getDocumentEndPosition();
    const layout = layoutFormatterManager.layout;
    let layoutPosition;
    if (subDocument.isMain()) {
        layoutPosition = LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(layoutFormatterManager, subDocument, position, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    else {
        while (!layout.isFullyFormatted && layout.validPageCount < pageIndex) {
            if (!layoutFormatterManager.forceFormatPage(layout.validPageCount))
                break;
        }
        layoutPosition = new LayoutPositionOtherSubDocumentCreator(layout, subDocument, position, pageIndex, DocumentLayoutDetailsLevel.Character)
            .create(new LayoutPositionCreatorConflictFlags().setDefault(endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    if (!layoutPosition)
        return { layoutPoint: null, layoutPosition: null };
    const layoutPoint = new LayoutPoint(layoutPosition.pageIndex, layoutPosition.getLayoutX(layoutFormatterManager.measurer), layoutPosition.getLayoutY(DocumentLayoutDetailsLevel.Box));
    return { layoutPoint: layoutPoint, layoutPosition: layoutPosition };
}
