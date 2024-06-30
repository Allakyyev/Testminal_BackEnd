export class WebSettings {
    constructor() {
        this.leftMargin = 0;
        this.topMargin = 0;
        this.rightMargin = 0;
        this.bottomMargin = 0;
        this.id = 1;
    }
    isBodyMarginsSet() {
        return this.leftMargin != 0 || this.topMargin != 0 || this.rightMargin != 0 || this.bottomMargin != 0;
    }
    clone() {
        const result = new WebSettings();
        result.leftMargin = this.leftMargin;
        result.topMargin = this.topMargin;
        result.rightMargin = this.rightMargin;
        result.bottomMargin = this.bottomMargin;
        result.id = this.id;
        return result;
    }
}
