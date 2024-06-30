export class Paddings {
    constructor(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}
export class SimpleViewSettings {
    constructor(native) {
        this._native = native;
    }
    get paddings() {
        const p = this._native.core.innerClientProperties.viewsSettings.paddings;
        return new Paddings(p.top, p.right, p.bottom, p.left);
    }
    get fixedWidth() { return this._native.core.innerClientProperties.viewsSettings.fixedWidth; }
    set paddings(paddings) {
        const oldPaddings = this._native.core.innerClientProperties.viewsSettings.paddings;
        if (!oldPaddings.equals(paddings)) {
            this._native.core.innerClientProperties.viewsSettings.paddings.copyFrom(paddings);
            this._native.core.layoutFormatterManager.invalidator.onChangedAllLayout();
        }
    }
    set fixedWidth(width) {
        const oldWidth = this._native.core.innerClientProperties.viewsSettings.fixedWidth;
        if (oldWidth !== width) {
            this._native.core.innerClientProperties.viewsSettings.fixedWidth = width;
            this._native.core.layoutFormatterManager.invalidator.onChangedAllLayout();
        }
    }
}
