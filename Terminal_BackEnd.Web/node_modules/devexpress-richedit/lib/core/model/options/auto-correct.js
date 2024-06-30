import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class AutoCorrectSettings {
    constructor() {
        this.detectUrls = true;
        this.correctTwoInitialCapitals = false;
        this.replaceTextAsYouType = false;
        this.enableAutomaticNumbering = true;
        this.caseSensitiveReplacement = false;
        this.replaceInfoCollection = [];
    }
    copyFrom(obj) {
        this.detectUrls = obj.detectUrls;
        this.correctTwoInitialCapitals = obj.correctTwoInitialCapitals;
        this.replaceTextAsYouType = obj.replaceTextAsYouType;
        this.enableAutomaticNumbering = obj.enableAutomaticNumbering;
        this.caseSensitiveReplacement = obj.caseSensitiveReplacement;
        this.replaceInfoCollection = ListUtils.map(obj.replaceInfoCollection, d => new AutoCorrectReplaceInfo(d.replace, d.with));
    }
    clone() {
        const result = new AutoCorrectSettings();
        result.copyFrom(this);
        return result;
    }
}
export class AutoCorrectReplaceInfo {
    constructor(whatReplace, withReplace) {
        this.replace = whatReplace;
        this.with = withReplace;
    }
    clone() {
        return new AutoCorrectReplaceInfo(this.replace, this.with);
    }
}
