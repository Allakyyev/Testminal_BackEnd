import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../../core/layout/layout-position';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../../../core/model/sub-document';
import { LayoutWordBounds } from '../../../core/word-bounds-engine/layout-word-bounds';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
export class RichLayoutUtils {
    static getAllowedSizeForImage(subDocument, layoutFormatterManager, selection, logPosition) {
        const layoutPosition = LayoutPosition.ensure(layoutFormatterManager, selection, subDocument, logPosition, DocumentLayoutDetailsLevel.Row, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        const allowedSize = layoutPosition.column.createSize().applyConverter(UnitConverter.pixelsToTwips);
        if (layoutPosition.row.tableCellInfo)
            allowedSize.width = Math.min(UnitConverter.pixelsToTwips(layoutPosition.row.tableCellInfo.avaliableContentWidth), allowedSize.width);
        return allowedSize;
    }
    static modifyTextUnderCursor(control, text) {
        const subDocument = control.selection.activeSubDocument;
        let position = control.selection.lastSelectedInterval.start;
        let startInterval = LayoutWordBounds.getLayoutWordStartBound(control.layout, subDocument, control.selection, position);
        let startIntervalLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(control.layout, subDocument, startInterval, DocumentLayoutDetailsLevel.Box)
            : new LayoutPositionOtherSubDocumentCreator(control.layout, subDocument, startInterval, control.selection.pageIndex, DocumentLayoutDetailsLevel.Box))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(control.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (startIntervalLayoutPosition.isLastBoxInRow())
            startInterval = LayoutWordBounds.getLayoutWordStartBound(control.layout, subDocument, control.selection, position - 1);
        let endInterval = LayoutWordBounds.getLayoutWordEndBound(control.layout, subDocument, control.selection, startInterval, false);
        let intervalForModify = new FixedInterval(startInterval, endInterval - startInterval);
        const charBundle = control.inputPosition.charPropsBundle;
        control.modelManager.history.beginTransaction();
        control.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, intervalForModify), true, false);
        const result = control.modelManager.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, intervalForModify.start), charBundle, RunType.TextRun, text));
        control.modelManager.history.addAndRedo(new SelectionHistoryItem(control.modelManager.modelManipulator, control.selection, control.selection.getState(), control.selection.getState().setPosition(result.insertedInterval.end)));
        control.modelManager.history.endTransaction();
    }
}
