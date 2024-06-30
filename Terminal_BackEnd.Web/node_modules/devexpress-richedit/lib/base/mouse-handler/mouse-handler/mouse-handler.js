import { ManipulatorHandlerBase } from '../base/manipulator-handler-base';
import { MouseHandlerDefaultState } from './mouse-handler-default-state';
export class MouseHandler extends ManipulatorHandlerBase {
    constructor(control, boxVisualizerManager) {
        super(control, MouseHandlerDefaultState, boxVisualizerManager);
    }
    onMouseDoubleClick(evt) {
        this.state.onMouseDoubleClick(evt);
    }
    onMouseDown(evt) {
        this.state.onMouseDown(evt);
    }
    onMouseUp(evt) {
        this.state.onMouseUp(evt);
    }
    onMouseMove(evt) {
        this.state.onMouseMove(evt);
    }
    onMouseWheel(evt) {
        this.state.onMouseWheel(evt);
    }
    onShortcut(shortcutCode) {
        this.state.onShortcut(shortcutCode);
    }
    setCursorPointer(pointer) {
        this.control.viewManager.canvasManager.setCursorPointer(pointer);
    }
    restoreCursorPointer() {
        this.control.viewManager.canvasManager.setCursorPointer(CursorPointer.Auto);
    }
}
MouseHandler.LEFT_AREA_COMMANDS_OFFSET = 20;
MouseHandler.WAIT_FOR_DBLCLICK_INTERVAL = 300;
export var CursorPointer;
(function (CursorPointer) {
    CursorPointer[CursorPointer["Default"] = 0] = "Default";
    CursorPointer[CursorPointer["Move"] = 1] = "Move";
    CursorPointer[CursorPointer["Copy"] = 2] = "Copy";
    CursorPointer[CursorPointer["NoDrop"] = 3] = "NoDrop";
    CursorPointer[CursorPointer["EResize"] = 4] = "EResize";
    CursorPointer[CursorPointer["NResize"] = 5] = "NResize";
    CursorPointer[CursorPointer["SResize"] = 6] = "SResize";
    CursorPointer[CursorPointer["WResize"] = 7] = "WResize";
    CursorPointer[CursorPointer["SEResize"] = 8] = "SEResize";
    CursorPointer[CursorPointer["SWResize"] = 9] = "SWResize";
    CursorPointer[CursorPointer["NWResize"] = 10] = "NWResize";
    CursorPointer[CursorPointer["NEResize"] = 11] = "NEResize";
    CursorPointer[CursorPointer["EWResize"] = 12] = "EWResize";
    CursorPointer[CursorPointer["NSResize"] = 13] = "NSResize";
    CursorPointer[CursorPointer["Auto"] = 14] = "Auto";
})(CursorPointer || (CursorPointer = {}));
