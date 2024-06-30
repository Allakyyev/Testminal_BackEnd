import { Errors } from '@devexpress/utils/lib/errors';
import { ResizeColumnTableHelper, ResizeRowTableHelper } from '../resize-table-helper';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
export class MouseHandlerDragResizeTableBase extends MouseHandlerStateBase {
    onMouseDown(evt) {
        this.helper = new (this.getHelperConstructor())(this.handler.control, this.handler.boxVisualizerManager.resizeTableVisualizer, evt);
    }
    onMouseMove(evt) {
        this.helper.move(evt);
    }
    onMouseUp(evt) {
        this.helper.end(evt);
        this.handler.switchToDefaultState();
    }
    getHelperConstructor() {
        throw new Error(Errors.NotImplemented);
    }
}
export class MouseHandlerDragTableRowState extends MouseHandlerDragResizeTableBase {
    getHelperConstructor() {
        return ResizeRowTableHelper;
    }
}
export class MouseHandlerDragTableColumnState extends MouseHandlerDragResizeTableBase {
    getHelperConstructor() {
        return ResizeColumnTableHelper;
    }
}
