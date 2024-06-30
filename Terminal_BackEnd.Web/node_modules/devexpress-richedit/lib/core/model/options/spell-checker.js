export class SpellCheckerError {
}
export class SpellCheckerSettings {
    constructor() {
        this.isEnabled = false;
        this.customDictionaryGuid = "";
        this.canAddWord = false;
        this.suggestionCount = 4;
    }
    copyFrom(obj) {
        this.isEnabled = obj.isEnabled;
        this.suggestionCount = obj.suggestionCount;
        this.customDictionaryGuid = obj.customDictionaryGuid;
        this.canAddWord = obj.canAddWord;
        this.maxRequestLength = obj.maxRequestLength && obj.maxRequestLength > 0 ? obj.maxRequestLength : 300;
        this.checkWordSpelling = obj.checkWordSpelling;
        this.addWordToDictionary = obj.addWordToDictionary;
    }
    clone() {
        const result = new SpellCheckerSettings();
        result.copyFrom(this);
        return result;
    }
}
