import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class RichEditsHolder {
    getRichEditGlobalObject() {
        let devExpressObj = window.DevExpress;
        if (!devExpressObj)
            window.DevExpress = devExpressObj = {};
        let richEditObj = devExpressObj.RichEdit;
        if (!richEditObj)
            devExpressObj.RichEdit = richEditObj = {};
        return richEditObj;
    }
    getRichs() {
        if (!this._richEdits) {
            const richEditGlobalObj = this.getRichEditGlobalObject();
            this._richEdits = richEditGlobalObj.richEdits;
            if (!this._richEdits)
                this._richEdits = richEditGlobalObj.richEdits = [];
        }
        return this._richEdits;
    }
    getRegisteredControlTypes() {
        if (!this._registeredControlTypes) {
            const richEditGlobalObj = this.getRichEditGlobalObject();
            this._registeredControlTypes = richEditGlobalObj.controlTypes;
            if (!this._registeredControlTypes)
                this._registeredControlTypes = richEditGlobalObj.controlTypes = {};
        }
        return this._registeredControlTypes;
    }
    getRegisteredContainerTypes() {
        if (!this._registeredContainerTypes) {
            const richEditGlobalObj = this.getRichEditGlobalObject();
            this._registeredContainerTypes = richEditGlobalObj.containerTypes;
            if (!this._registeredContainerTypes)
                this._registeredContainerTypes = richEditGlobalObj.containerTypes = {};
        }
        return this._registeredContainerTypes;
    }
    registerRichEdit(richEdit) {
        this.getRichs().push(richEdit);
    }
    unregisterRichEdit(richEdit) {
        const richs = this.getRichs();
        const index = ListUtils.indexBy(richs, rich => rich === richEdit);
        if (index >= 0)
            richs.splice(index, 1);
    }
    registerControlType(controlTypeName) {
        this.getRegisteredControlTypes()[controlTypeName] = null;
    }
    registerControlTypeObject(controlTypeName, object) {
        this.getRegisteredControlTypes()[controlTypeName] = object;
    }
    isControlTypeRegistered(controlTypeName) {
        return this.getRegisteredControlTypes()[controlTypeName] !== undefined;
    }
    getCustomControl(controlTypeName) {
        const instance = this.getRegisteredControlTypes()[controlTypeName];
        return instance ? instance : null;
    }
    registerContainerType(containerTypeName) {
        this.getRegisteredContainerTypes()[containerTypeName] = null;
    }
    registerContainerTypeObject(containerTypeName, object) {
        this.getRegisteredContainerTypes()[containerTypeName] = object;
    }
    isContainerTypeRegistered(containerTypeName) {
        return this.getRegisteredContainerTypes()[containerTypeName] !== undefined;
    }
    getCustomContainer(containerTypeName) {
        const instance = this.getRegisteredContainerTypes()[containerTypeName];
        return instance ? instance : null;
    }
    getRichEditByElement(element) {
        const richs = this.getRichs();
        return ListUtils.elementBy(richs, rich => rich.element === element);
    }
    getFocusedRichEdit() {
        const richs = this.getRichs();
        return ListUtils.elementBy(richs, rich => rich.core.focusManager.isInFocus);
    }
}
