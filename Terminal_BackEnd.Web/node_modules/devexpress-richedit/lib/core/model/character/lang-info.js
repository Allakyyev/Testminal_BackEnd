export class LangInfo {
    constructor(bidi, eastAsia, latin) {
        this.bidi = bidi || "";
        this.eastAsia = eastAsia || "";
        this.latin = latin || "";
    }
    copyFrom(obj) {
        this.bidi = obj.bidi;
        this.eastAsia = obj.eastAsia;
        this.latin = obj.latin;
    }
    equals(obj) {
        return obj && this.bidi == obj.bidi &&
            this.eastAsia == obj.eastAsia &&
            this.latin == obj.latin;
    }
    static equalsBinary(langInfoA, langInfoB) {
        return langInfoA && langInfoB &&
            langInfoA.bidi == langInfoB.bidi &&
            langInfoA.eastAsia == langInfoB.eastAsia &&
            langInfoA.latin == langInfoB.latin;
    }
    clone() {
        var obj = new LangInfo(null, null, null);
        obj.copyFrom(this);
        return obj;
    }
    isEmpty() {
        if (this.bidi == "" && this.eastAsia == "" && this.latin == "")
            return true;
        return false;
    }
}
