export class PrintLayoutViewSettings {
    constructor(native) {
        this._native = native;
    }
    get showHorizontalRuler() {
        return this._native.core.horizontalRulerControl.getVisible();
    }
    set showHorizontalRuler(showHorizontalRuler) {
        this._native.core.innerClientProperties.viewsSettings.showHorizontalRuler = showHorizontalRuler;
        this._native.core.horizontalRulerControl.setVisible(showHorizontalRuler);
        this._native.core.owner.adjustControl();
    }
}
