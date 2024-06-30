import { ManipulatorHandlerBase } from '../base/manipulator-handler-base';
import { TouchHandlerDefaultState } from './touch-handler-default-state';
export class TouchHandler extends ManipulatorHandlerBase {
    constructor(control, boxVisualizerManager) {
        super(control, TouchHandlerDefaultState, boxVisualizerManager);
    }
    onTouchStart(evt) {
        this.state.onTouchStart(evt);
    }
    onDoubleTap(evt) {
        this.state.onDoubleTap(evt);
    }
    onTouchEnd(evt) {
        this.state.onTouchEnd(evt);
    }
    onTouchMove(evt) {
        return this.state.onTouchMove(evt);
    }
    onGestureStart(_evt) {
        this.switchToDefaultState();
    }
}
