import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { ControlOptions } from '../../../core/model/options/control';
import { LayoutWordBounds } from '../../../core/word-bounds-engine/layout-word-bounds';
import { Browser } from '@devexpress/utils/lib/browser';
import { HitTestDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ModifierKey } from '@devexpress/utils/lib/utils/key';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../../commands/client-command';
import { SelectTableRowCommandOptions } from '../../commands/selection/select-table-command';
import { ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters } from '../../commands/sub-document/change-active-sub-document-command';
import { MouseButton } from '../../event-manager';
import { HitTestManager } from '../../layout-engine/hit-test-manager/hit-test-manager';
import { ResizeBoxVisualizer } from '../../layout-engine/visualizers/resize-box-visualizer';
import { SetSelectionParams } from '../../selection/set-selection-params';
import { ResizeColumnTableHelper, ResizeRowTableHelper } from '../resize-table-helper';
import { MouseHandler } from './mouse-handler';
import { MouseHandlerAutoScrollState } from './mouse-handler-auto-scroll-state';
import { MouseHandlerBeginDragHelperState } from './mouse-handler-begin-drag-helper-state';
import { MouseHandlerDragTableColumnState, MouseHandlerDragTableRowState } from './mouse-handler-drag-column-or-row-state';
import { MouseHandlerBeginContentDragHelperState, MouseHandlerDragContentState } from './mouse-handler-drag-content-states';
import { MouseHandlerDragFloatingObjectState } from './mouse-handler-drag-floating-object-state';
import { MouseHandlerParagraphSelectState } from './mouse-handler-paragraph-select-state';
import { MouseHandlerResizeBoxState } from './mouse-handler-resize-box-state';
import { MouseHandlerRotateBoxState } from './mouse-handler-rotate-box-state';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
import { MouseHandlerBeginMultiselectionState, MouseHandlerContinueSelectionByCharactersState, MouseHandlerContinueSelectionByLinesState, MouseHandlerContinueSelectionByTableCellsState, MouseHandlerContinueSelectionByTableColumnsState, MouseHandlerContinueSelectionByTableRowsState } from './mouse-handler-text-selection-states';
export class MouseHandlerDefaultState extends MouseHandlerStateBase {
    onMouseDoubleClick(evt) {
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return;
        if (this.isLeftAreaOffset(htr, evt)) {
            this.handler.control.commandManager.getCommand(RichEditClientCommand.SelectParagraph)
                .execute(this.handler.control.commandManager.isPublicApiCall, htr.getPosition());
            return;
        }
        const activeSubDocument = this.handler.control.selection.activeSubDocument;
        if (htr.exactlyDetailLevel < DocumentLayoutDetailsLevel.PageArea) {
            if (activeSubDocument.isMain()) {
                if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top) {
                    this.handler.control.commandManager.getCommand(RichEditClientCommand.InsertHeader).execute(this.handler.control.commandManager.isPublicApiCall, htr.pageIndex);
                    return;
                }
                if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom) {
                    this.handler.control.commandManager.getCommand(RichEditClientCommand.InsertFooter).execute(this.handler.control.commandManager.isPublicApiCall, htr.pageIndex);
                    return;
                }
            }
            else if (this.shouldActivateMainArea(activeSubDocument, htr)) {
                this.handler.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain).execute(this.handler.control.commandManager.isPublicApiCall);
                return;
            }
        }
        if (this.isLeftArea(htr, evt) || htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.PageArea) {
            var position = htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset + htr.box.rowOffset + htr.charOffset;
            if (htr.boxIndex == htr.row.boxes.length - 1 && htr.charOffset == htr.box.getLength())
                position--;
            const selection = this.handler.control.selection;
            const startInterval = LayoutWordBounds.getLayoutWordStartBound(this.handler.control.layout, activeSubDocument, selection, position);
            const endInterval = LayoutWordBounds.getLayoutWordEndBound(this.handler.control.layout, activeSubDocument, selection, position, true);
            if (endInterval <= startInterval)
                return;
            selection.changeState((newState) => {
                const interval = FixedInterval.fromPositions(startInterval, endInterval);
                if (evt.modifiers & ModifierKey.Ctrl)
                    newState.addInterval(interval);
                else
                    newState.setInterval(interval);
                newState.resetKeepX().setEndOfLine(false);
            });
            this.handler.switchState(new MouseHandlerParagraphSelectState(this.handler, evt, startInterval));
        }
    }
    shouldActivateMainArea(activeSubDocument, htr) {
        return (activeSubDocument.isHeader() && !!(htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom)) ||
            (activeSubDocument.isFooter() && !!(htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top)) ||
            (activeSubDocument.isHeaderFooter() && !htr.pageArea);
    }
    changeActiveSubDocument(evt) {
        const control = this.handler.control;
        const activeSubDocument = control.selection.activeSubDocument;
        if (!activeSubDocument.isHeaderFooter())
            return false;
        var htr = control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.PageArea, null, true);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return false;
        if (htr.pageArea.subDocument.isHeaderFooter()) {
            if (htr.pageArea.subDocument.id != activeSubDocument.id || control.selection.pageIndex != htr.pageIndex) {
                control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                    .execute(control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(control, htr.pageIndex, htr.pageArea.subDocument.isHeader()));
                return true;
            }
            return false;
        }
        if (htr.pageArea.subDocument.isMain()) {
            if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top) {
                control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                    .execute(control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(control, htr.pageIndex, true));
                return true;
            }
            if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom) {
                control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                    .execute(control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(control, htr.pageIndex, false));
                return true;
            }
            return false;
        }
        return false;
    }
    onMouseDown(evt) {
        var _a;
        let activeSubDocument = this.handler.control.selection.activeSubDocument;
        this.handler.control.barHolder.contextMenu.onCanvasMouseDown();
        (_a = this.handler.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.onCanvasMouseDown();
        if (evt.middleButtonPressed) {
            this.handler.switchState(new MouseHandlerAutoScrollState(this.handler));
            this.handler.state.onMouseDown(evt);
            return;
        }
        if (this.changeActiveSubDocument(evt))
            return;
        if (MouseHandlerDefaultState.canHandleFullTableSelection(evt)) {
            this.handler.control.selection.setSelection(new SetSelectionParams()
                .setInterval(this.handler.control.selection.tableInfo.table.interval));
            return;
        }
        if (ResizeColumnTableHelper.canHandleResize(evt) && !this.handler.control.readOnly) {
            let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.PageArea, null);
            if (htr.pageArea.subDocument == activeSubDocument) {
                this.handler.switchState(new MouseHandlerDragTableColumnState(this.handler));
                this.handler.state.onMouseDown(evt);
                return;
            }
        }
        if (ResizeRowTableHelper.canHandleResize(evt) && !this.handler.control.readOnly) {
            let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.PageArea, null);
            if (htr.pageArea.subDocument == activeSubDocument) {
                this.handler.switchState(new MouseHandlerDragTableRowState(this.handler));
                this.handler.state.onMouseDown(evt);
                return;
            }
        }
        if (this.shouldProcessResizeBoxVisualizer(evt))
            if (this.resizeRotationChecker(() => {
                if (activeSubDocument.isTextBox())
                    MouseHandlerHelper.selectParentsTextBox(this.handler.control);
                this.beginResizeBoxMouseHandler(evt);
            }))
                return;
        if (ResizeBoxVisualizer.shouldRotate(evt, this.handler.control))
            if (this.resizeRotationChecker(() => {
                if (activeSubDocument.isTextBox())
                    MouseHandlerHelper.selectParentsTextBox(this.handler.control);
                this.beginRotate(evt);
            }))
                return;
        let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, activeSubDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None && !htr.floatingObject)
            return;
        if (!ResizeBoxVisualizer.shouldHandleTextBoxAreaClick(evt) && activeSubDocument.isTextBox()) {
            MouseHandlerHelper.changeActiveSubDocumentToParent(this.handler.control);
            htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        }
        this.processMouseDownOnMaxDetailsLevel(evt, htr, activeSubDocument);
    }
    processMouseDownOnMaxDetailsLevel(evt, htr, activeSubDocument) {
        if (htr.floatingObject) {
            if (htr.floatingObject.belongsToSubDocId != this.handler.control.selection.activeSubDocument.id)
                MouseHandlerHelper.changeActiveSubDocumentToParent(this.handler.control);
            const box = htr.floatingObject;
            this.selectFloatingObject(box);
            const specRunInfo = this.handler.control.selection.specialRunInfo;
            if (specRunInfo.isSelectedAnchorObject) {
                if (box.getType() == LayoutBoxType.AnchorTextBox &&
                    HitTestManager.isPointInTexBoxArea(evt.layoutPoint, box, activeSubDocument.isTextBox() ? 0 : box.rotationInRadians)) {
                    this.handler.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToTextBox).execute(this.handler.control.commandManager.isPublicApiCall);
                    this.handler.boxVisualizerManager.resizeBoxVisualizer.show(htr.pageIndex, null, null, null, box);
                    htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
                }
                else {
                    if (this.resizeRotationChecker(() => {
                        const dragFloatingObjectState = new MouseHandlerDragFloatingObjectState(this.handler, evt);
                        this.handler.switchState(new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, dragFloatingObjectState));
                    }))
                        return;
                    else {
                        if (specRunInfo.isPictureSelected()) {
                            this.handler.control.selection.setSelection(new SetSelectionParams()
                                .setInterval(new FixedInterval(specRunInfo.getPicturePosition(), 1)));
                            return;
                        }
                    }
                }
            }
        }
        if (Browser.TouchUI && htr.subDocument.isMain() && htr.exactlyDetailLevel < DocumentLayoutDetailsLevel.PageArea) {
            if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top || htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom)
                this.handler.control.viewManager.canvasScrollManager.waitForDblClick();
        }
        if (evt.button === MouseButton.Right && this.handler.control.selection.lastSelectedInterval.contains(htr.getPosition()))
            return;
        if (this.shouldSelectEntireTableColumn(htr))
            this.beginSelectEntireTableColumn(htr, evt);
        else if (this.shouldSelectEntireTableRow(htr))
            this.beginSelectEntireTableRow(htr, evt);
        else if (this.shouldBeginDragExistingSelection(htr, evt))
            this.beginDragExistingSelection(evt, true);
        else if (this.shouldSelectEntireTableCell(htr, evt)) {
            if (this.shouldSelectPicture(htr, !!(evt.modifiers & ModifierKey.Ctrl)))
                this.selectImage(evt, htr);
            else
                this.beginSelectEntireTableCell(htr, evt);
        }
        else if (this.isLeftArea(htr, evt)) {
            if (evt.modifiers & ModifierKey.Ctrl && this.handler.control.selection.isCollapsed())
                this.handler.control.commandManager.getCommand(RichEditClientCommand.SelectAll).execute(this.handler.control.commandManager.isPublicApiCall, htr.getPosition());
            else if (this.isLeftAreaOffset(htr, evt))
                this.beginLineSelection(htr, evt);
            else
                this.beginCharacterSelection(evt, htr, !!(evt.modifiers & ModifierKey.Shift));
        }
        else if (this.shouldSelectPicture(htr, !!(evt.modifiers & ModifierKey.Ctrl)))
            this.selectImage(evt, htr);
        else if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Character && evt.modifiers & ModifierKey.Ctrl)
            this.beginCharacterMultiSelection(htr);
        else if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.PageArea)
            this.beginCharacterSelection(evt, htr, !!(evt.modifiers & ModifierKey.Shift));
    }
    onMouseUp(evt) {
        if ((evt.button === MouseButton.Right || evt.button === MouseButton.Left && Browser.MacOSPlatform && (evt.modifiers & ModifierKey.Ctrl))
            && !evt.middleButtonPressed && evt.layoutPoint) {
            this.handler.control.popupMenuManager.showByMouseClick(evt.absolutePoint);
        }
        if (this.handler.control.modelManager.richOptions.fields.openHyperlinkOnClick || (evt.modifiers & ModifierKey.Ctrl)) {
            const field = this.handler.getHyperlinkFieldResult(evt);
            if (field) {
                if (!this.handler.control.clientSideEvents.raiseHyperlinkClick(evt.mouseEvent, field))
                    this.handler.control.commandManager.getCommand(RichEditClientCommand.OpenHyperlink)
                        .execute(this.handler.control.commandManager.isPublicApiCall, field);
            }
        }
    }
    static canHandleFullTableSelection(evt) {
        return EvtUtils.getEventSource(evt.mouseEvent).className.indexOf(RendererClassNames.FULL_TABLE_SELECTOR) > -1;
    }
    shouldSelectEntireTableColumn(htr) {
        if (!htr.row)
            return false;
        if (!htr.row.tableCellInfo)
            return false;
        return !!(htr.deviations[DocumentLayoutDetailsLevel.TableCell] & HitTestDeviation.Top);
    }
    shouldSelectEntireTableRow(htr) {
        if (!htr.row)
            return false;
        if (!htr.row.tableCellInfo)
            return false;
        return !!(htr.deviations[DocumentLayoutDetailsLevel.TableCell] & HitTestDeviation.Left);
    }
    shouldSelectEntireTableCell(htr, evt) {
        if (!htr.row)
            return false;
        if (!htr.row.tableCellInfo)
            return false;
        if (htr.deviations[DocumentLayoutDetailsLevel.TableCell])
            return false;
        if (evt.modifiers & ModifierKey.Shift)
            return false;
        return true;
    }
    beginSelectEntireTableColumn(htr, evt) {
        let shouldAddSelection = evt.modifiers & ModifierKey.Ctrl;
        let cmd = this.handler.control.commandManager.getCommand(shouldAddSelection ? RichEditClientCommand.ExtendSelectTableColumn : RichEditClientCommand.SelectTableColumn);
        let table = htr.row.tableCellInfo.parentRow.parentTable.logicInfo.grid.table;
        let cellGridIndex = htr.row.tableCellInfo.cellGridIndex;
        cmd.execute(this.handler.control.commandManager.isPublicApiCall, { table: table, columnIndices: [cellGridIndex] });
        let selectionState = new MouseHandlerContinueSelectionByTableColumnsState(this.handler, htr.row.tableCellInfo.parentRow.parentTable, cellGridIndex, htr.column.x + htr.pageArea.x);
        let dragState = new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, selectionState);
        this.handler.switchState(dragState);
    }
    beginSelectEntireTableRow(htr, evt) {
        let shouldAddSelection = evt.modifiers & ModifierKey.Ctrl;
        let cmd = this.handler.control.commandManager.getCommand(shouldAddSelection ? RichEditClientCommand.ExtendSelectTableRow : RichEditClientCommand.SelectTableRow);
        let table = htr.row.tableCellInfo.parentRow.parentTable.logicInfo.grid.table;
        let rowIndex = htr.row.tableCellInfo.parentRow.rowIndex;
        cmd.execute(this.handler.control.commandManager.isPublicApiCall, new SelectTableRowCommandOptions(this.handler.control, table, [rowIndex], true));
        let selectionState = new MouseHandlerContinueSelectionByTableRowsState(this.handler, htr.row.tableCellInfo.parentRow.parentTable, rowIndex);
        let dragState = new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, selectionState);
        this.handler.switchState(dragState);
    }
    beginSelectEntireTableCell(htr, evt) {
        let shouldAddSelection = !!(evt.modifiers & ModifierKey.Ctrl);
        var position = this.getPosition(htr);
        const selection = this.handler.control.selection;
        selection.changeState((newState) => {
            const interval = new FixedInterval(position, 0);
            if (shouldAddSelection || (evt.button & MouseButton.Right))
                newState.addInterval(interval);
            else
                newState.setInterval(interval);
            newState.resetKeepX().setEndOfLine(false);
        });
        let rowIndex = htr.row.tableCellInfo.parentRow.rowIndex;
        let gridCellIndex = htr.row.tableCellInfo.cellGridIndex;
        let selectionState = new MouseHandlerContinueSelectionByTableCellsState(this.handler, htr.row.tableCellInfo.parentRow.parentTable, rowIndex, gridCellIndex, this.getPosition(htr));
        let dragState = new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, selectionState);
        this.handler.switchState(dragState);
    }
    beginCharacterMultiSelection(htr) {
        var position = htr.getPosition();
        this.handler.switchState(new MouseHandlerBeginMultiselectionState(this.handler, position));
    }
    isLeftArea(htr, evt) {
        if (!htr)
            return false;
        if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Page &&
            htr.deviations[DocumentLayoutDetailsLevel.Column] & HitTestDeviation.Left &&
            (evt.layoutPoint.x <= htr.pageArea.x + htr.column.x))
            return true;
        return false;
    }
    isLeftAreaOffset(htr, evt) {
        if (htr) {
            if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Page &&
                htr.deviations[DocumentLayoutDetailsLevel.Column] & HitTestDeviation.Left &&
                evt.layoutPoint.x <= htr.pageArea.x + htr.column.x - MouseHandler.LEFT_AREA_COMMANDS_OFFSET)
                return true;
            if (htr.detailsLevel >= DocumentLayoutDetailsLevel.Box &&
                htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Row &&
                htr.box == htr.row.boxes[0] &&
                htr.deviations[DocumentLayoutDetailsLevel.Box] & HitTestDeviation.Left &&
                evt.layoutPoint.x <= htr.pageArea.x + htr.column.x + htr.row.x + htr.box.x - MouseHandler.LEFT_AREA_COMMANDS_OFFSET) {
                const h = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, null);
                if (h.floatingObject && h.floatingObject.isInText())
                    return true;
            }
        }
        return false;
    }
    shouldProcessResizeBoxVisualizer(evt) {
        return this.handler.boxVisualizerManager.resizeBoxVisualizer.shouldCapture(evt) &&
            this.handler.control.selection.activeSubDocument.isEditable([new FixedInterval(this.handler.control.selection.specialRunInfo.getPosition(), 1)]);
    }
    beginResizeBoxMouseHandler(evt) {
        this.handler.switchState(new MouseHandlerResizeBoxState(this.handler));
        this.handler.state.onMouseDown(evt);
    }
    beginRotate(evt) {
        this.handler.switchState(new MouseHandlerRotateBoxState(this.handler));
        this.handler.state.onMouseDown(evt);
    }
    beginCharacterSelection(evt, htr, extendSelection) {
        this.setStartSelection(htr, extendSelection);
        this.handler.switchState(new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, new MouseHandlerContinueSelectionByCharactersState(this.handler)));
    }
    setStartSelection(htr, extendSelection) {
        this.handler.control.inputController.setEditableDocumentContent("");
        var selection = this.handler.control.selection;
        var position = this.getPosition(htr);
        const endOfLine = position === htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset +
            htr.column.pageAreaOffset + htr.row.getEndPosition();
        selection.changeState((newState) => {
            if (extendSelection)
                newState.extendLastInterval(position);
            else
                newState.setInterval(new FixedInterval(position, 0));
            newState.resetKeepX().setEndOfLine(endOfLine);
        });
    }
    getPosition(htr) {
        var position = htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset;
        if (htr.deviations[DocumentLayoutDetailsLevel.Box] & HitTestDeviation.Right) {
            var lastVisibleBoxInRow = htr.row.getLastVisibleBox();
            if (lastVisibleBoxInRow)
                position += lastVisibleBoxInRow.getEndPosition();
        }
        else {
            position += htr.box.rowOffset + htr.charOffset;
            if (htr.boxIndex == htr.row.boxes.length - 1 && htr.charOffset == htr.box.getLength() && !htr.box.isVisible())
                position -= 1;
        }
        return position;
    }
    beginLineSelection(htr, evt) {
        var lineStart = htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset;
        if (evt.modifiers & ModifierKey.Shift) {
            this.handler.control.commandManager.getCommand(RichEditClientCommand.ExtendSelectLineNoUpdateControlState).execute(this.handler.control.commandManager.isPublicApiCall, lineStart);
        }
        else if (evt.modifiers & ModifierKey.Ctrl)
            this.handler.control.commandManager.getCommand(RichEditClientCommand.AddSelectedLineCommandNoUpdateControlState).execute(this.handler.control.commandManager.isPublicApiCall, lineStart);
        else
            this.handler.control.commandManager.getCommand(RichEditClientCommand.SelectLineNoUpdateControlState).execute(this.handler.control.commandManager.isPublicApiCall, lineStart);
        this.handler.switchState(new MouseHandlerBeginDragHelperState(evt.layoutPoint, this.handler, new MouseHandlerContinueSelectionByLinesState(this.handler)));
    }
    shouldSelectPicture(htr, ctrlPressed) {
        if (htr.exactlyDetailLevel < DocumentLayoutDetailsLevel.Box)
            return false;
        return htr.box.getType() == LayoutBoxType.Picture && !ctrlPressed;
    }
    shouldBeginDragExistingSelection(htr, evt) {
        if (!(evt.modifiers & ModifierKey.Shift) &&
            ControlOptions.isEnabled(this.handler.control.modelManager.richOptions.control.drag) && !this.handler.control.selection.isCollapsed() &&
            htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Box) {
            let position = htr.getPosition();
            return ListUtils.unsafeAnyOf(this.handler.control.selection.intervals, (interval) => interval.contains(position));
        }
        return false;
    }
    selectImage(evt, htr) {
        var position = htr.getPosition() - htr.charOffset;
        var selection = this.handler.control.selection;
        selection.deprecatedSetSelection(position, position + 1, false, -1, true);
        if (ControlOptions.isEnabled(this.handler.control.modelManager.richOptions.control.drag))
            this.beginDragExistingSelection(evt, false);
    }
    beginDragExistingSelection(evt, resetSelectionOnMouseUp) {
        var dragState = new MouseHandlerDragContentState(this.handler);
        var state = new MouseHandlerBeginContentDragHelperState(evt.layoutPoint, this.handler, dragState);
        state.resetSelectionOnMouseUp = resetSelectionOnMouseUp;
        this.handler.switchState(state);
    }
    selectFloatingObject(box) {
        const pos = this.handler.control.layout.anchorObjectsPositionInfo.getPosition(box.objectId);
        this.handler.control.selection.setSelection(new SetSelectionParams().setInterval(new FixedInterval(pos, 1)));
    }
}
export class MouseHandlerHelper {
    static selectParentsTextBox(control) {
        const textBoxPosition = control.selection.specialRunInfo.getTextBoxPosition();
        if (textBoxPosition > -1) {
            this.changeActiveSubDocumentToParent(control);
            control.selection.setSelection(new SetSelectionParams().setInterval(new FixedInterval(textBoxPosition, 1)));
        }
    }
    static changeActiveSubDocumentToParent(control) {
        const selection = control.selection;
        const parentActiveSubDocument = selection.specialRunInfo.getParentSubDocument();
        if (!parentActiveSubDocument)
            return;
        if (parentActiveSubDocument.isMain())
            control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain).execute(control.commandManager.isPublicApiCall);
        else
            control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToHeaderFooterByPageIndex)
                .execute(control.commandManager.isPublicApiCall, new ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters(control, selection.pageIndex, parentActiveSubDocument.isHeader()));
    }
}
