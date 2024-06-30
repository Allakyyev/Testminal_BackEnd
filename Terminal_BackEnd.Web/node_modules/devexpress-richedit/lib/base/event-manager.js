import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { TextBufferChangedSubDocumentChange } from '../core/model/changes/sub-document/text/text-buffer-changed';
import { InsertTextHistoryItem } from '../core/model/history/items/insert-text-history-item';
import { HistoryItemIntervalState } from '../core/model/history/states/history-item-state';
import { HistoryItemTextBufferStateObject } from '../core/model/history/states/history-item-state-object';
import { InsertTextManipulatorParams } from '../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../core/model/runs/run-type';
import { SubDocumentPosition } from '../core/model/sub-document';
import { Log } from '../core/rich-utils/debug/logger/base-logger/log';
import { LogSource } from '../core/rich-utils/debug/logger/base-logger/log-source';
import { Browser } from '@devexpress/utils/lib/browser';
import { Errors } from '@devexpress/utils/lib/errors';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { KeyCode, KeyUtils } from '@devexpress/utils/lib/utils/key';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { RichEditClientCommand } from './commands/client-command';
import { CommandSimpleOptions } from './commands/command-base';
import { ReadOnlyMode } from './interfaces/i-rich-edit-core';
import { SelectionHistoryItem } from './model/history/selection/selection-history-item';
import { MouseHandler } from './mouse-handler/mouse-handler/mouse-handler';
import { TouchHandler } from './mouse-handler/touch-handler/touch-handler';
import { LogObjToStrCanvas } from './rich-utils/debug/logger/canvas-logger/log-obj-to-str-canvas';
import { RichLayoutUtils } from './rich-utils/layout/rich-layout-utils';
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["None"] = 0] = "None";
    MouseButton[MouseButton["Left"] = 1] = "Left";
    MouseButton[MouseButton["Right"] = 2] = "Right";
    MouseButton[MouseButton["Middle"] = 4] = "Middle";
})(MouseButton || (MouseButton = {}));
export class EventManager {
    constructor(control, boxVisualizerManager) {
        this.moveLocked = false;
        this.shouldPreventContextMenuEvent = true;
        this.accumulatedText = "";
        this.accumulatedTextInsertId = null;
        this.accumulatedTextMaxLength = Browser.Chrome ? 3 : 9;
        this.control = control;
        this.mouseHandler = new MouseHandler(control, boxVisualizerManager);
        this.touchHandler = new TouchHandler(control, boxVisualizerManager);
    }
    set mouseWheelEvent(val) {
        this.mouseHandler.mouseWheelEvent = val;
        this.touchHandler.mouseWheelEvent = val;
    }
    dispose() {
        clearTimeout(this.accumulatedTextInsertId);
        clearTimeout(this.lockMouseMoveTimerId);
        clearTimeout(this.onMouseUpTimerId);
    }
    onShortcut(shortcutCode) {
        if (this.accumulatedText.length)
            this.insertFunc();
        this.control.shortcutManager.processShortcut(shortcutCode);
        this.mouseHandler.onShortcut(shortcutCode);
        if (EnumUtils.isAnyOf(shortcutCode, KeyCode.Enter, KeyCode.Tab, KeyCode.Space) && this.control.selection.lastSelectedInterval.start > 0)
            this.control.autoCorrectService.performAutoCorrect();
    }
    onMouseDown(evt) {
        Log.print(LogSource.EventManager, "onMouseDown", LogObjToStrCanvas.richMouseEvent(evt));
        if (!this.control.clientSideEvents.raisePointerDown(evt.mouseEvent)) {
            this.lockMouseMove();
            this.mouseHandler.onMouseDown(evt);
        }
    }
    onMouseMove(evt) {
        Log.print(LogSource.EventManager, "onMouseMove", LogObjToStrCanvas.richMouseEvent(evt));
        if (this.moveLocked)
            return;
        this.mouseHandler.onMouseMove(evt);
    }
    onMouseUp(evt) {
        Log.print(LogSource.EventManager, "onMouseUp", LogObjToStrCanvas.richMouseEvent(evt));
        let handled = false;
        if (evt.layoutPoint)
            handled = this.control.clientSideEvents.raisePointerUp(evt.mouseEvent);
        if (!handled) {
            this.lockMouseMove();
            this.mouseHandler.onMouseUp(evt);
            if (evt.layoutPoint) {
                if (Browser.TouchUI)
                    this.control.inputController.setPosition(evt.absolutePoint.x + 2, evt.absolutePoint.y + 2);
                this.onMouseUpTimerId = setTimeout(() => this.control.focusManager.captureFocus(), 0);
            }
        }
    }
    onTouchStart(evt) {
        Log.print(LogSource.EventManager, "onTouchStart", LogObjToStrCanvas.richMouseEvent(evt));
        if (!this.control.clientSideEvents.raisePointerDown(evt.mouseEvent))
            this.touchHandler.onTouchStart(evt);
    }
    onTouchEnd(evt) {
        Log.print(LogSource.EventManager, "onTouchEnd", LogObjToStrCanvas.richMouseEvent(evt));
        let handled = false;
        if (evt.layoutPoint)
            handled = this.control.clientSideEvents.raisePointerUp(evt.mouseEvent);
        if (!handled)
            this.touchHandler.onTouchEnd(evt);
    }
    onTouchMove(evt) {
        Log.print(LogSource.EventManager, "onTouchMove", LogObjToStrCanvas.richMouseEvent(evt));
        return this.touchHandler.onTouchMove(evt);
    }
    onDoubleTap(evt) {
        Log.print(LogSource.EventManager, "onDoubleTap", LogObjToStrCanvas.richMouseEvent(evt));
        this.touchHandler.onDoubleTap(evt);
    }
    onGestureStart(evt) {
        this.touchHandler.onGestureStart(evt);
    }
    onMouseDblClick(evt) {
        Log.print(LogSource.EventManager, "onMouseDoubleClick", LogObjToStrCanvas.richMouseEvent(evt));
        this.mouseHandler.onMouseDoubleClick(evt);
        this.control.inputController.setPosition(evt.absolutePoint.x, evt.absolutePoint.y);
    }
    onMouseWheel(evt) {
        Log.print(LogSource.EventManager, "onMouseWheel", LogObjToStrCanvas.richMouseEvent(evt));
        this.mouseHandler.onMouseWheel(evt);
    }
    onText(text, isUpdated) {
        if (isUpdated)
            this.modifyLastInsertedSymbol(text);
        else {
            if (this.control.commandManager.clipboardTimerId === null) {
                this.accumulatedText += text;
                if (this.accumulatedTextInsertId) {
                    clearTimeout(this.accumulatedTextInsertId);
                    this.accumulatedTextInsertId = null;
                }
                if (this.accumulatedText.length > this.accumulatedTextMaxLength)
                    this.insertFunc();
                else
                    this.accumulatedTextInsertId = setTimeout(() => this.insertFunc.apply(this), 1);
            }
        }
    }
    onTextReplace(text, length) {
        if (length != undefined)
            this.modifyLastText(text, length);
        else
            RichLayoutUtils.modifyTextUnderCursor(this.control, text);
    }
    modifyLastText(text, length) {
        if (length === 0) {
            this.control.beginUpdate();
            this.control.commandManager.getCommand(RichEditClientCommand.InsertText).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, text));
            this.control.endUpdate();
            return;
        }
        let endInterval = this.control.selection.lastSelectedInterval.start;
        let startInterval = endInterval - length;
        let intervalForModify = new FixedInterval(startInterval, endInterval - startInterval);
        const insertTextHistoryItem = this.control.modelManager.modelManipulator.text.getLastModifiableHistoryItem((hi) => hi instanceof InsertTextHistoryItem);
        if (!insertTextHistoryItem)
            return false;
        const setSelectionHistoryItem = this.control.modelManager.modelManipulator.text.getLastModifiableHistoryItem((hi) => hi instanceof SelectionHistoryItem);
        this.control.modelManager.modelManipulator.range.removeIntervalWithoutHistory(insertTextHistoryItem.params.subDocPos.subDocument, intervalForModify, false);
        this.control.modelManager.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(insertTextHistoryItem.params.subDocPos.subDocument, intervalForModify.start), insertTextHistoryItem.params.charPropsBundle, RunType.TextRun, text));
        setSelectionHistoryItem.newState.intervalsInfo.intervals[0].start = startInterval + text.length;
        insertTextHistoryItem.params.text = text;
        var newPositionSelection = setSelectionHistoryItem.newState.intervalsInfo.intervals[0].start;
        this.control.selection.changeState((newState) => newState.setPosition(newPositionSelection));
        this.control.commandManager.lastTextInsertDate = new Date(0);
    }
    modifyLastInsertedSymbol(symbol) {
        if (symbol.length !== 1)
            throw new Error(Errors.InternalException);
        const insertTextHistoryInfo = this.control.modelManager.modelManipulator.text.getLastModifiableHistoryItem((hi) => hi instanceof InsertTextHistoryItem);
        if (!insertTextHistoryInfo)
            throw new Error(Errors.InternalException);
        const textLength = insertTextHistoryInfo.params.text.length;
        insertTextHistoryInfo.params.text = insertTextHistoryInfo.params.text.substr(0, textLength - 1) + symbol;
        this.updateSymbol(insertTextHistoryInfo.params.subDocPos.subDocument, insertTextHistoryInfo.params.subDocPos.position + textLength - 1, symbol);
    }
    updateSymbol(subDocument, position, symbol) {
        const state = new HistoryItemIntervalState();
        const chunkIndex = SearchUtils.normedInterpolationIndexOf(subDocument.chunks, c => c.startLogPosition.value, position);
        const chunk = subDocument.chunks[chunkIndex];
        const chunkRelativePosition = position - chunk.startLogPosition.value;
        const oldSymbol = chunk.textBuffer.substr(chunkRelativePosition, 1);
        state.register(new HistoryItemTextBufferStateObject(position, symbol));
        chunk.textBuffer = chunk.textBuffer.substr(0, chunkRelativePosition) + symbol + chunk.textBuffer.substr(chunkRelativePosition + 1);
        this.control.modelManager.modelManipulator.notifyModelChanged(new TextBufferChangedSubDocumentChange(subDocument.id, state));
        return oldSymbol;
    }
    insertFunc() {
        const insertCommand = this.control.commandManager.getCommand(RichEditClientCommand.InsertText);
        const textWasInserted = insertCommand.execute(this.control.commandManager.isPublicApiCall, this.accumulatedText);
        this.accumulatedText = "";
        this.accumulatedTextInsertId = -1;
        if (textWasInserted)
            this.control.autoCorrectService.performAutoCorrect();
    }
    onFocusIn() {
        if (this.control.readOnly === ReadOnlyMode.None) {
            if (!this.isFocused())
                this.control.clientSideEvents.raiseGotFocus();
            this.control.focusManager.isInFocus = true;
        }
    }
    onFocusOut() {
        if (this.isFocused())
            this.control.clientSideEvents.raiseLostFocus();
        this.control.focusManager.isInFocus = false;
    }
    isFocused() {
        return this.control.focusManager.isInFocus;
    }
    lockMouseMove() {
        this.moveLocked = true;
        this.lockMouseMoveTimerId = setTimeout(() => this.moveLocked = false, 0);
    }
}
export class RichMouseEvent {
    constructor(evt, layoutPoint, source, scrollTop, scrollLeft) {
        this.layoutPoint = layoutPoint;
        this.absolutePoint = new Point(EvtUtils.getEventX(evt), EvtUtils.getEventY(evt));
        this.scroll = new Point(scrollLeft, scrollTop);
        this.modifiers = KeyUtils.getKeyModifiers(evt);
        this.button = this.isLeftButtonPressed(evt) ? MouseButton.Left : MouseButton.Right;
        this.middleButtonPressed = !!(evt.buttons & MouseButton.Middle);
        this.source = source;
        this.mouseEvent = evt;
    }
    isLeftButtonPressed(evt) {
        return !Browser.MSTouchUI ? EvtUtils.isLeftButtonPressed(evt) : evt.button != 2;
    }
}
