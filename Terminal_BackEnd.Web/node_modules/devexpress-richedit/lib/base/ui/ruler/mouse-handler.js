import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { RichEditClientCommand } from '../../commands/client-command';
export class RulerMouseHandler {
    constructor(modelData, controls) {
        this.listener = null;
        this._enable = true;
        this._visible = true;
        this.modelData = modelData;
        this.controls = controls;
        this.controlsList = [
            this.controls.firstLineIndent,
            this.controls.leftIndent,
            this.controls.rightIndent,
            this.controls.tables,
            this.controls.leftMargin,
            this.controls.rightMargin,
            this.controls.columns,
            this.controls.tabs,
        ];
    }
    setEnable(enable) {
        if (this._enable != enable) {
            if (!enable)
                this.onEscPress();
            this._enable = enable;
        }
    }
    setVisible(visible) {
        if (this._visible != visible) {
            if (!visible)
                this.onEscPress();
            this._visible = visible;
        }
    }
    canHandle(source) {
        return DomUtils.isItParent(this.controls.ruler.rootElement, source);
    }
    notHandle() {
        return this.modelData.isReadOnly || !this._enable || !this._visible;
    }
    onDoubleClick(evt) {
        const source = EvtUtils.getEventSource(evt);
        const command = this.controls.rightMargin.canHandle(source) || this.controls.leftMargin.canHandle(source) ?
            RichEditClientCommand.ShowPageSetupForm :
            RichEditClientCommand.ShowTabsForm;
        this.modelData.commandManager.getCommand(command).execute(this.modelData.commandManager.isPublicApiCall);
    }
    onMouseDown(evt) {
        if (this.notHandle())
            return;
        const source = EvtUtils.getEventSource(evt);
        for (let listener of this.controlsList) {
            if (listener.onMouseDown(source, evt)) {
                this.listener = listener;
                break;
            }
        }
    }
    onMouseMove(distance, source) {
        if (this.notHandle() || !this.listener)
            return;
        this.listener.onMouseMove(distance, source);
        this.controls.updateView();
    }
    onMouseUp() {
        if (this.notHandle() || !this.listener)
            return;
        this.listener.onMouseUp();
        this.reset();
    }
    onEscPress() {
        if (this.notHandle() || !this.listener)
            return;
        this.listener.onEscPress();
        this.reset();
    }
    reset() {
        this.listener = null;
    }
}
