import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPoint } from '../../../core/layout/layout-point';
import { Field } from '../../../core/model/fields/field';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../core/model/floating-objects/enums';
import { RangeCopy } from '../../../core/model/manipulators/range/create-range-copy-operation';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { HitTestDeviation, RectangleDeviation, Rectangle as Rect } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { ScrollState } from '../../scroll/model-states';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../sub-document/change-active-sub-document-command';
import { SwitchTextBoxSubDocumentsStateHistoryItem } from '../../../core/model/history/items/switch-text-box-sub-documents-state-history-item';
export class FloatingObjectMovedArgumentInner {
    constructor(subDocumentId, newPosition, pageIntervals, pageIndex, objectX, objectY) {
        this.newPosition = newPosition;
        this.subDocumentId = subDocumentId;
        this.pageIntervals = pageIntervals;
        this.pageIndex = pageIndex;
        this.objectX = objectX;
        this.objectY = objectY;
        if (this.pageIndex == 0 && this.pageIntervals[0].start != 0)
            this.pageIntervals.splice(0, 1, new FixedInterval(0, this.pageIntervals[0].end));
    }
}
export class FloatingObjectDragDropChangePositionCommand extends CommandBase {
    get activeSubDocument() {
        return this.selection.activeSubDocument;
    }
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() && specialRunInfo.isSelectedAnchorObject &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    executeCore(_state, options) {
        const topInfo = this.control.viewManager.canvasManager.getScrollTopInfo();
        const runInfo = this.activeSubDocument.getRunAndIndexesByPosition(this.selection.specialRunInfo.getPosition());
        const oldRun = runInfo.run.clone();
        const oldRunPos = runInfo.getAbsoluteRunPosition();
        const finalClickPoint = options.finalClickPoint;
        const layoutPoint = new LayoutPoint(options.endPageIndex, finalClickPoint.x, finalClickPoint.y);
        const initialHtr = this.control.hitTestManager.calculate(layoutPoint, DocumentLayoutDetailsLevel.Character, null, true);
        if (!initialHtr.pageArea)
            return;
        initialHtr.correctAsVisibleBox();
        this.history.beginTransaction();
        if (initialHtr.pageArea.subDocument.id !== this.activeSubDocument.id)
            this.changeActiveSubDocument(initialHtr, finalClickPoint);
        this.move(oldRun, oldRunPos, initialHtr, options.endPageIndex, options.finalPoint);
        this.history.endTransaction();
        this.selection.scrollManager.setScroll(new ScrollState().byScrollInfo.setPageInfo(topInfo));
        return true;
    }
    changeActiveSubDocument(htr, point) {
        const activeSubDocument = this.selection.activeSubDocument;
        if (!activeSubDocument.isHeaderFooter())
            return false;
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return false;
        if (htr.pageArea.subDocument.isHeaderFooter()) {
            if (htr.pageArea.subDocument.id != activeSubDocument.id || this.selection.pageIndex != htr.pageIndex) {
                this.changeActiveSubDocumentToHeaderFooter(htr.pageIndex, htr.pageArea.subDocument.isHeader());
                return true;
            }
        }
        else if (htr.pageArea.subDocument.isMain()) {
            const bounds = this.getPageClientBounds(htr.page);
            const center = bounds.center;
            const rect = new Rect(center.x, center.y, 0, 0);
            const deviation = new RectangleDeviation(rect, point).calcDeviation().deviation.getValue();
            if (deviation & HitTestDeviation.Top) {
                this.changeActiveSubDocumentToHeaderFooter(htr.pageIndex, true);
                return true;
            }
            if (deviation & HitTestDeviation.Bottom) {
                this.changeActiveSubDocumentToHeaderFooter(htr.pageIndex, false);
                return true;
            }
        }
        return false;
    }
    changeActiveSubDocumentToHeaderFooter(pageIndex, isHeader) {
        this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
            .execute(this.control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(this.control, pageIndex, isHeader));
    }
    getPageClientBounds(page) {
        const areas = page.mainSubDocumentPageAreas;
        let result = areas[0];
        for (let i = 1; i < areas.length; i++)
            result = Rect.union(areas[i], result);
        return result;
    }
    move(oldRun, oldRunPos, initialHtr, endPageIndex, finalPoint) {
        if (this.shouldMoveInsideTable(oldRun, initialHtr)) {
            const paragraphStartHTR = this.findParagraphStartOnThisPage(initialHtr);
            const newLogPos = this.getNewLogPosition(this.activeSubDocument, paragraphStartHTR);
            const arg = new FloatingObjectMovedArgumentInner(this.activeSubDocument.id, newLogPos, paragraphStartHTR.page.getContentIntervals(), paragraphStartHTR.pageIndex, finalPoint.x, finalPoint.y);
            this.control.owner.raiseFloatingObjectMovedObject(arg);
            if (newLogPos != arg.newPosition || finalPoint.x != arg.objectX || finalPoint.y != arg.objectY) {
                this.handleEvent(arg, oldRun, oldRunPos, false);
            }
            else {
                this.moveInsideTable(oldRun, oldRunPos, newLogPos, paragraphStartHTR, finalPoint, false);
            }
        }
        else {
            this.moveOutsideTable(oldRun, oldRunPos, endPageIndex, finalPoint);
        }
    }
    shouldMoveInsideTable(oldRun, initialHtr) {
        if (!initialHtr.row.tableCellInfo)
            return false;
        if (!this.modelManipulator.model.compatibilitySettings.getActualLayoutInTableCell(oldRun.anchorInfo))
            return false;
        return true;
    }
    handleEvent(arg, oldRun, oldRunPos, oldIntervalRemoved) {
        const lp = this.activeSubDocument.isMain() ?
            LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, this.activeSubDocument, arg.newPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false)) :
            new LayoutPositionOtherSubDocumentCreator(this.control.layout, this.activeSubDocument, arg.newPosition, this.control.selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        const finalPos = new Point(arg.objectX, arg.objectY);
        if (lp.row.tableCellInfo)
            this.moveInsideTable(oldRun, oldRunPos, arg.newPosition, lp, finalPos, oldIntervalRemoved);
        else {
            const newPoint = new Point(finalPos.x - lp.getLayoutX(null, DocumentLayoutDetailsLevel.Column), finalPos.y);
            const newAnchorInfo = this.getNewAnchorInfo(oldRun.anchorInfo, newPoint);
            if (!oldIntervalRemoved)
                this.removeOldRun(oldRun, oldRunPos);
            this.addRun(oldRun, arg.newPosition, newAnchorInfo);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(new FixedInterval(arg.newPosition, 1))));
        }
    }
    moveInsideTable(oldRun, oldRunPos, newLogPos, finalPosHTR, finalPoint, oldIntervalRemoved) {
        const offset = finalPosHTR.row.tableCellInfo ?
            new Point(finalPosHTR.row.tableCellInfo.x, finalPosHTR.row.tableCellInfo.y) :
            new Point(0, 0);
        const newPoint = new Point(finalPoint.x - finalPosHTR.getLayoutX(null, DocumentLayoutDetailsLevel.Column) - offset.x, finalPoint.y - finalPosHTR.getLayoutY(DocumentLayoutDetailsLevel.Column) - offset.y);
        if (!oldIntervalRemoved)
            this.removeOldRun(oldRun, oldRunPos);
        this.control.layoutFormatterManager.forceFormatPage(finalPosHTR.pageIndex);
        const newRunPos = newLogPos + (oldRunPos < newLogPos ? -1 : 0);
        this.addRun(oldRun, newRunPos, this.getNewAnchorInfo(oldRun.anchorInfo, newPoint));
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(new FixedInterval(newRunPos, 1))));
    }
    moveOutsideTable(oldRun, oldRunPos, endPageIndex, pagePosition) {
        this.removeOldRun(oldRun, oldRunPos);
        this.control.layoutFormatterManager.forceFormatPage(endPageIndex);
        const layoutPoint = new LayoutPoint(Math.min(endPageIndex, this.control.layout.pages.length), pagePosition.x, pagePosition.y);
        const htr = this.control.hitTestManager.calculate(layoutPoint, DocumentLayoutDetailsLevel.Row, this.activeSubDocument);
        const paragraphStartHTR = this.findParagraphStartOnThisPage(htr);
        const newLogPos = this.getNewLogPosition(this.activeSubDocument, paragraphStartHTR);
        const arg = new FloatingObjectMovedArgumentInner(this.activeSubDocument.id, newLogPos, paragraphStartHTR.page.getContentIntervals(), paragraphStartHTR.pageIndex, pagePosition.x, pagePosition.y);
        this.control.owner.raiseFloatingObjectMovedObject(arg);
        if (newLogPos != arg.newPosition || pagePosition.x != arg.objectX || pagePosition.y != arg.objectY) {
            this.handleEvent(arg, oldRun, oldRunPos, true);
        }
        else {
            const newPoint = new Point(pagePosition.x - htr.getLayoutX(null, DocumentLayoutDetailsLevel.Column), pagePosition.y);
            const newAnchorInfo = this.getNewAnchorInfo(oldRun.anchorInfo, newPoint);
            this.addRun(oldRun, newLogPos, newAnchorInfo);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(new FixedInterval(newLogPos, 1))));
        }
    }
    removeOldRun(oldRun, oldRunPos) {
        const subDoc = oldRun.paragraph.subDocument;
        this.rangeCopy = RangeCopy.create(new SubDocumentIntervals(subDoc, [FixedInterval.fromPositions(oldRunPos, oldRunPos + 1)]));
        const interval = new SubDocumentInterval(subDoc, new FixedInterval(oldRunPos, 1));
        this.modelManipulator.range.removeInterval(interval, false, false);
    }
    findParagraphStartOnThisPage(htr) {
        const paragraph = this.selection.activeSubDocument.getParagraphByPosition(htr.getLogPosition());
        while (htr.stepBackRow()) {
            if (!paragraph.interval.contains(htr.getLogPosition())) {
                htr.stepForwardRow();
                break;
            }
        }
        return htr;
    }
    addRun(oldRun, position, anchorInfo) {
        if (this.rangeCopy) {
            const intermediateRun = this.rangeCopy.model.mainSubDocument.getFirstRun();
            intermediateRun.anchorInfo = anchorInfo.clone();
            this.rangeCopy.insertTo(this.modelManipulator, new SubDocumentPosition(this.activeSubDocument, position));
        }
        this.rangeCopy = null;
        const newRun = this.activeSubDocument.getRunAndIndexesByPosition(position).run;
        if (newRun.getType() == RunType.AnchoredTextBoxRun) {
            const oldTextBoxRun = oldRun;
            const originalSubDocument = this.control.modelManager.model.subDocuments[oldTextBoxRun.subDocId];
            this.history.addAndRedo(new SwitchTextBoxSubDocumentsStateHistoryItem(this.modelManipulator, originalSubDocument, this.activeSubDocument, position));
        }
    }
    getNewAnchorInfo(anchorInfo, newPoint) {
        anchorInfo = anchorInfo.clone();
        anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        anchorInfo.horizontalPositionType = AnchorObjectHorizontalPositionType.Column;
        anchorInfo.verticalPositionType = AnchorObjectVerticalPositionType.Page;
        anchorInfo.percentOffset.x = 0;
        anchorInfo.percentOffset.y = 0;
        anchorInfo.offset.x = UnitConverter.pixelsToTwips(newPoint.x);
        anchorInfo.offset.y = UnitConverter.pixelsToTwips(newPoint.y);
        return anchorInfo;
    }
    getNewLogPosition(subDocument, htr) {
        const pos = htr.getLogPosition(DocumentLayoutDetailsLevel.Row);
        if (!subDocument.fields.length)
            return pos;
        const index = Math.max(0, Field.normedBinaryIndexOf(subDocument.fields, pos));
        const topLevelField = subDocument.fields[index].getAbsolutelyTopLevelField();
        const startFieldPos = topLevelField.getFieldStartPosition();
        for (let ind = topLevelField.index, field; field = subDocument.fields[ind]; ind++) {
            if (field.getFieldStartPosition() >= topLevelField.getFieldEndPosition())
                break;
            if (pos == field.getResultStartPosition()) {
                const lp = subDocument.isMain() ?
                    LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, pos, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true)) :
                    new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, pos, this.control.selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                        .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true));
                if (startFieldPos >= lp.getLogPosition(DocumentLayoutDetailsLevel.Row) + lp.row.getLastBox().getEndPosition())
                    return startFieldPos;
                else
                    break;
            }
        }
        return pos;
    }
}
export class FloatingObjectDragDropChangePositionCommandParameters extends CommandOptions {
    constructor(control, startPageIndex, endPageIndex, finalPoint, finalClickPoint) {
        super(control);
        this.startPageIndex = startPageIndex;
        this.endPageIndex = endPageIndex;
        this.finalPoint = finalPoint;
        this.finalClickPoint = finalClickPoint;
    }
}
