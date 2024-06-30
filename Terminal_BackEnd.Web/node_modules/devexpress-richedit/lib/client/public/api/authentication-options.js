export class AuthenticationOptionsApi {
    constructor(native) {
        this._native = native;
    }
    get userName() {
        return this._native.core.modelManager.richOptions.documentProtection.authenticationUserName;
    }
    set userName(value) {
        this._native.core.modelManager.richOptions.documentProtection.authenticationUserName = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseProtectionPropertiesChanged();
    }
    get group() {
        return this._native.core.modelManager.richOptions.documentProtection.authenticationGroup;
    }
    set group(value) {
        this._native.core.modelManager.richOptions.documentProtection.authenticationGroup = value;
        this._native.core.modelManager.modelManipulator.documentProtectionProperties.raiseProtectionPropertiesChanged();
    }
}
