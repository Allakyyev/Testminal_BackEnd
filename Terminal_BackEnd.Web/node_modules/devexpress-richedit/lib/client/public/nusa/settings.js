import { HomeTabCommandId } from '../rich-edit';
import { createDefaultCommandSets } from './commands';
import { registerRichEditCustomContainerType } from './custom-container-registrator';
import { registerRichEditCustomControlType } from './custom-control-registrator';
import { WRE_NUSA_conceptNameAttr, WRE_NUSA_containerTypeAttr, WRE_NUSA_controlTypeAttr, WRE_NUSA_enabledAttr, WRE_NUSA_reinitializeVuiForm, WRE_registerCommands } from './external-types';
import { createDefaultPlaceholders } from './placeholders';
import { RichEditsHolder } from './rich-edits-holder';
export class NusaSettings {
    constructor(native) {
        this._richEditsHolder = new RichEditsHolder();
        this._registered = false;
        this._native = native;
    }
    get registered() { return this._registered; }
    getFocusedRichEdit() {
        const focused = this._richEditsHolder.getFocusedRichEdit();
        return focused ? focused.getPublicRichEdit() : null;
    }
    registerCommands(options = {}) {
        if (!options)
            options = {};
        const commandSets = createDefaultCommandSets();
        const placeholders = createDefaultPlaceholders();
        if (options.customizeCommands)
            options.customizeCommands(commandSets, placeholders);
        WRE_registerCommands(commandSets, placeholders);
    }
    getCommandHandler() {
        return (commandId, _placeholderIds, placeholderValues) => {
            const reCmdId = commandId;
            const rich = this._richEditsHolder.getFocusedRichEdit();
            if (!rich)
                return false;
            switch (reCmdId) {
                case 'DxReFontColor': {
                    rich.getPublicRichEdit().executeCommand(HomeTabCommandId.ChangeFontForeColor, placeholderValues[0]);
                    return true;
                }
                case 'DxReFontSize': {
                    rich.getPublicRichEdit().executeCommand(HomeTabCommandId.ChangeFontSize, parseInt(placeholderValues[0]));
                    return true;
                }
                default:
                    return false;
            }
        };
    }
    getCustomControl() {
        return this._registered ? this._richEditsHolder.getCustomControl(this._native.element.getAttribute(WRE_NUSA_controlTypeAttr)) : null;
    }
    getCustomContainer() {
        return this._registered ? this._richEditsHolder.getCustomContainer(this._native.element.getAttribute(WRE_NUSA_containerTypeAttr)) : null;
    }
    unregister() {
        if (!this._registered)
            return;
        removeAttribute(this._native.element, WRE_NUSA_controlTypeAttr);
        removeAttribute(this._native.element, WRE_NUSA_conceptNameAttr);
        removeAttribute(this._native.element, WRE_NUSA_containerTypeAttr);
        this._richEditsHolder.unregisterRichEdit(this._native);
        this._registered = false;
        WRE_NUSA_reinitializeVuiForm();
    }
    register(options) {
        var _a, _b;
        if (this._registered)
            return;
        const customControlType = (_a = options === null || options === void 0 ? void 0 : options.customControlType) !== null && _a !== void 0 ? _a : "DevExpressRichEdit";
        const customContainerType = (_b = options === null || options === void 0 ? void 0 : options.customContainerType) !== null && _b !== void 0 ? _b : "DevExpressRichEditContainer";
        const conceptName = options === null || options === void 0 ? void 0 : options.conceptName;
        addAttribute(this._native.element, WRE_NUSA_controlTypeAttr, customControlType);
        addAttribute(this._native.element, WRE_NUSA_containerTypeAttr, customContainerType);
        if (conceptName)
            addAttribute(this._native.element, WRE_NUSA_conceptNameAttr, conceptName);
        disableRibbonInputs(this._native.barHolder.ribbon);
        this._richEditsHolder.registerRichEdit(this._native);
        this._registered = true;
        registerRichEditCustomControlType(customControlType, this._richEditsHolder);
        registerRichEditCustomContainerType(customContainerType, this._richEditsHolder);
        WRE_NUSA_reinitializeVuiForm();
    }
}
function disableRibbonInputs(ribbon) {
    if (ribbon) {
        const collection = ribbon.ribbon.element.getElementsByTagName('input');
        for (let i = 0; i < collection.length; i++)
            collection[i].setAttribute(WRE_NUSA_enabledAttr, 'false');
    }
}
function removeAttribute(element, name) {
    const oldAttr = element.getAttribute(name);
    if (oldAttr !== null)
        element.removeAttribute(name);
}
function addAttribute(element, name, value) {
    removeAttribute(element, name);
    element.setAttribute(name, value);
}
